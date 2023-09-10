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
    <div className="container text-center"><h1 className="text-[#43d9ff]">Monitoring App</h1></div>
      <div className="max-w-container mx-auto px-[10px] justify-center  py-[10px] flex flex-col gap-y-[10px] md:flex-row md:gap-x-[10px]">
        {/* best block start */} 
        <div className="md:w-[24%] w-full border  shadow-md rounded-md bg-[#ffffffa5]">
          <div className="flex gap-x-3  items-center border-b px-[10px]">
            <div className="text-[50px]">
              <BsBoxFill className="text-[#43d9ff]" />
            </div>
            <div className="">
              <small className="text-[#b137a5]">Total Block</small>
              <h2 className="font-thin text-[#37b22a]">{data.total_blocks}</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaComputer className="text-green-700" /> <small className="text-[#b137a5]">Active Validator Nodes</small>
            </div>
            <div className="text-green-700">{metrics["edge_consensus_validators"]}/1000</div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaArrowDownUpAcrossLine className="text-green-700" /> <small className="text-[#b137a5]">RPC bad calls</small>
            </div>
            <div className="text-green-700">{metrics["edge_json_rpc_eth_call_errors"]}</div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaPooStorm className="text-green-700" /> <small className="text-[#b137a5]">Know tx</small>
            </div>
            <div className="text-green-700">{metrics["edge_txpool_already_known_tx"]}</div>
          </div>
          <div className=" px-[10px]">
            <div className="mt-3">
              <Chart />
         
            <TxnChart />
            </div>
          </div>
      

          <div className="px-[10px]">
            <small className="text-[#b137a5]">{/*Gas Spending*/}</small>
            <div className="mt-3">{/* <Chart /> */}</div>
          </div>
        </div>

        {/* best block end */}
        {/* last block start */}
        <div className="md:w-[24%] w-full border  shadow-md rounded-md bg-[#ffffffa5]">
          <div className="flex gap-x-3  items-center border-b px-[10px]">
            <div className="text-[50px]">
              <GiSandsOfTime className="text-[#43d9ff]" />
            </div>
            <div className="">
              <small className="text-[#b137a5]">Last Block</small>
              <h2 className="font-thin text-[#37b22a]">1s ago</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaTag className="text-green-700" /> <small className="text-[#b137a5]">AverageGas Price</small>
            </div>
            <div className="flex gap-x-2 text-green-700">
              {data.gas_prices ? (
                <div className="text-green-700">{data.gas_prices.average}</div>
              ) : (
                <div className="text-green-700">Loading...</div>
              )}
              Gwei
            </div>
          </div>
          <div className=" px-[10px]">
            <div className="mt-3">{/* <Chart /> */}</div>
          </div>
          <div className="px-[10px]">
            <div className="mt-3">{/* <Chart /> */}</div>
          </div>
        </div>
        {/* last block end */}
        {/* Avg Block Time start */}
        <div className="md:w-[24%] w-full border  shadow-md rounded-md bg-[#ffffffa5]">
          <div className="flex gap-x-3  items-center border-b px-[10px]">
            <div className="text-[50px]">
              <BsStopwatch className="text-[#43d9ff]" />
            </div>
            <div className="">
              <small className="text-[#b137a5]">Avg Block Time</small>
              <h2 className="font-thin text-[#37b22a]">{data.average_block_time / 1000}s</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <BsStopwatch className="text-green-700" /> <small className="text-[#b137a5]">RPC latency</small>
            </div>
            <div className="text-green-700">
              {metrics["edge_json_rpc_eth_blockNumber_time"]}
            </div>
          </div>

          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <BsFillLightbulbFill className="text-green-700" /> <small className="text-[#b137a5]">Uptime</small>
            </div>
            <div className="text-green-700">100%</div>
          </div>
          <div className=" px-[10px]">
            <small className="text-[#b137a5]">Latest Transaction Hashes</small>
            <div className="mt-3">
              {/* <Chart/> */}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <ul className="!p-0" >
                    {transactions.map((item, index) => (
                      <li key={index}>
                        <a
                          href={`https://mainnet.mindscan.info/tx/${item.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500"
                        >
                          {formatHash(item.hash)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <div >
                  <small className="text-[#b137a5]">Latest Blocks</small>
                  <div className="mt-3">
                    {/* <Chart/> */}

                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="!p-0">
                        <ul className="!p-0">
                          {blocks.map((block, index) => (
                            <li key={index}>
                              <a
                                href={`https://mainnet.mindscan.info/blocks/${block.height}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500"
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
      {/* <div className="max-w-container mx-auto px-[10px]  py-[10px] overflow-x-scroll"></div> */}
      {/* list end */}
    </>
  );
};

export default Monitoring;
