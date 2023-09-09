import React, { useState, useEffect } from "react";
import { BsBoxFill, BsFillLightbulbFill, BsStopwatch } from "react-icons/bs";
import {
  FaArrowDownUpAcrossLine,
  FaBandage,
  FaComputer,
  FaPooStorm,
  FaTag,
} from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import Chart from "../components/Chart";
import TxnChart from "../components/txnchart";
import { backendurl, stasurl, txnurl, blockurl } from "../api/backendurl";

const Monitoring = () => {
  const [metrics, setMetrics] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const proxyURL = backendurl;

  useEffect(() => {
    fetch(proxyURL)
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split("\n");

        const metricsData = {};

        lines.forEach((line) => {
          if (line.startsWith("# HELP")) {
            const metricName = line.split(" ")[2];

            const valueLine = lines.find((vLine) =>
              vLine.startsWith(metricName)
            );

            if (valueLine) {
              const metricValue = parseFloat(valueLine.split(" ")[1]);

              metricsData[metricName] = metricValue;
            }
          }
        });

        setMetrics(metricsData);
      })
      .catch((error) => {
        console.error("Error fetching Prometheus metrics:", error);
      });
  }, []);
  useEffect(() => {
    fetch(stasurl)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetch(txnurl)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  // const shortenHash = (hash) => {
  //   return hash.slice(0, 30);
  // };
  const formatHash = (hash) => {
    const maxLength = 10;
    const ellipsis = "...";
    if (hash.length <= maxLength * 2 + ellipsis.length) {
      return hash;
    }
    const start = hash.slice(0, maxLength);
    const end = hash.slice(-maxLength);
    return `${start}${ellipsis}${end}`;
  };
  useEffect(() => {
    // Fetch data from the API
    fetch(blockurl)
      .then((response) => response.json())
      .then((data) => {
        setBlocks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="max-w-container mx-auto px-[10px]  py-[10px] flex flex-col gap-y-[10px] md:flex-row md:gap-x-[10px]">
        {/* best block start */}
        <div className="md:w-[24%] w-full border ">
          <div className="flex gap-x-3  items-center border-b px-[10px]">
            <div className="text-[50px]">
              <BsBoxFill />
            </div>
            <div className="">
              <small>Total Block</small>
              <h2 className="font-thin">{data.total_blocks}</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaComputer /> <small>Active Validator Nodes</small>
            </div>
            <div className="">{metrics["edge_consensus_validators"]}/1000</div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaArrowDownUpAcrossLine /> <small>RPC bad calls</small>
            </div>
            <div className="">{metrics["edge_json_rpc_eth_call_errors"]}</div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaPooStorm /> <small>Know tx</small>
            </div>
            <div className="">{metrics["edge_txpool_already_known_tx"]}</div>
          </div>
          <div className="border-b px-[10px]">
            <div className="mt-3">
              <Chart />
            </div>
          </div>
          <div className="mt-3">
            <TxnChart />
          </div>

          <div className="px-[10px]">
            <small>{/*Gas Spending*/}</small>
            <div className="mt-3">{/* <Chart /> */}</div>
          </div>
        </div>

        {/* best block end */}
        {/* last block start */}
        <div className="md:w-[24%] w-full border ">
          <div className="flex gap-x-3  items-center border-b px-[10px]">
            <div className="text-[50px]">
              <GiSandsOfTime />
            </div>
            <div className="">
              <small>Last Block</small>
              <h2 className="font-thin">1s ago</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaTag /> <small>AverageGas Price</small>
            </div>
            <div className="">
              {data.gas_prices ? (
                <div className="">{data.gas_prices.average}</div>
              ) : (
                <div className="">Loading...</div>
              )}
              Gwei
            </div>
          </div>
          <div className="border-b px-[10px]">
            <div className="mt-3">{/* <Chart /> */}</div>
          </div>
          <div className="px-[10px]">
            <div className="mt-3">{/* <Chart /> */}</div>
          </div>
        </div>
        {/* last block end */}
        {/* Avg Block Time start */}
        <div className="md:w-[24%] w-full border ">
          <div className="flex gap-x-3  items-center border-b px-[10px]">
            <div className="text-[50px]">
              <BsStopwatch />
            </div>
            <div className="">
              <small>Avg Block Time</small>
              <h2 className="font-thin">{data.average_block_time / 1000}s</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <BsStopwatch /> <small>RPC latency</small>
            </div>
            <div className="">
              {metrics["edge_json_rpc_eth_blockNumber_time"]}
            </div>
          </div>

          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <BsFillLightbulbFill /> <small>Uptime</small>
            </div>
            <div className="">100%</div>
          </div>
          <div className="border-b px-[10px]">
            <small>Latest Transaction Hashes</small>
            <div className="mt-3">
              {/* <Chart/> */}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <ul>
                    {transactions.map((item, index) => (
                      <li key={index}>
                        <a
                          href={`https://mainnet.mindscan.info/tx/${item.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatHash(item.hash)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <div className="border-b px-[10px]">
                  <small>Latest Blocks</small>
                  <div className="mt-3">
                    {/* <Chart/> */}

                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <div>
                        <ul>
                          {blocks.map((block, index) => (
                            <li key={index}>
                              <a
                                href={`https://mainnet.mindscan.info/blocks/${block.height}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {block.height}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div></div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* List Start  */}
      <div className="max-w-container mx-auto px-[10px]  py-[10px] overflow-x-scroll"></div>
      {/* list end */}
    </>
  );
};

export default Monitoring;
