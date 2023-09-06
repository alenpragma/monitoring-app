package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/rpc"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	ethereumClient *rpc.Client
	upgrader       = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	dataFile       = "data.json"
)

type EthereumStats struct {
	BlockNumber        string `json:"blockNumber"`
	GasPrice           string `json:"gasPrice"`
	Timestamp           int64  `json:"timestamp"`
	PendingTransactions int    `json:"pendingTransactions"`
	TotalPeers         int    `json:"totalPeers"`
	// Add more fields as needed
}

func init() {
	// Initialize the Ethereum client using WSS (WebSocket Secure)
	ethereumURL := "wss://seednode.mindchain.info/ws"
	var err error
	ethereumClient, err = rpc.DialWebsocket(ethereumURL)
	if err != nil {
		log.Fatalf("Failed to connect to Ethereum node: %v", err)
	}
}

func fetchBlockStats() (*EthereumStats, error) {
	// Fetch block number
	var blockNumber string
	err := ethereumClient.Call(&blockNumber, "eth_blockNumber")
	if err != nil {
		return nil, err
	}

	// Fetch gas price
	var gasPrice string
	err = ethereumClient.Call(&gasPrice, "eth_gasPrice")
	if err != nil {
		return nil, err
	}

	// Fetch pending transactions
	var pendingTransactions int
	err = ethereumClient.Call(&pendingTransactions, "eth_pendingTransactions")
	if err != nil {
		return nil, err
	}

	// Fetch total peers
	var totalPeers int
	err = ethereumClient.Call(&totalPeers, "net_peerCount")
	if err != nil {
		return nil, err
	}

	// You can fetch more statistics as needed
	// Example:
	// - Node info
	// - Transaction counts
	// - Account balances

	stats := &EthereumStats{
		BlockNumber:        blockNumber,
		GasPrice:           gasPrice,
		Timestamp:          time.Now().Unix(),
		PendingTransactions: pendingTransactions,
		TotalPeers:         totalPeers,
		// Add more fields here
	}

	return stats, nil
}

func readData() (*EthereumStats, error) {
	// Open and read data from data.json
	file, err := os.Open(dataFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var stats EthereumStats
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&stats); err != nil {
		return nil, err
	}

	return &stats, nil
}

func writeData(stats *EthereumStats) error {
	// Open and write data to data.json
	file, err := os.Create(dataFile)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	if err := encoder.Encode(stats); err != nil {
		return err
	}

	return nil
}

func getStatsHandler(c *gin.Context) {
	// Upgrade the HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade to WebSocket: %v", err)
		return
	}
	defer conn.Close()

	// Periodically fetch Ethereum stats and send updates over WebSocket
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			stats, err := fetchBlockStats()
			if err != nil {
				log.Printf("Failed to fetch Ethereum stats: %v", err)
				continue
			}

			// Write Ethereum stats to data.json
			err = writeData(stats)
			if err != nil {
				log.Printf("Failed to write Ethereum stats to data.json: %v", err)
				continue
			}

			// Send Ethereum stats as JSON over WebSocket
			err = conn.WriteJSON(stats)
			if err != nil {
				log.Printf("Failed to send Ethereum stats over WebSocket: %v", err)
				return
			}
		}
	}
}

func main() {
	// Initialize the Gin router
	r := gin.Default()

	// Enable CORS for your front-end (update with your front-end URL)
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://your-frontend-url"}
	r.Use(cors.New(config))

	// Define WebSocket route
	r.GET("/ws/stats", getStatsHandler)

	// Start the HTTP server
	fmt.Println("Ethereum Stats App is running on :8080")
	r.Run(":8080")
}
