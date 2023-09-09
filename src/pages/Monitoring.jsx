import React from "react";
import { BsBoxFill, BsFillLightbulbFill, BsStopwatch } from "react-icons/bs";
import { FaComputer, FaTag } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import Chart from "../components/Chart";

const Monitoring = () => {
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
              <small>Best Block</small>
              <h2 className="font-thin">#25,277,632</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <FaComputer /> <small>Active Nodes</small>
            </div>
            <div className="">83/85</div>
          </div>
          <div className="border-b px-[10px]">
            
            <div className="mt-3">
              <Chart />
            </div>
          </div>
          <div className="px-[10px]">
            <small>Gas Spending</small>
            <div className="mt-3">
              <Chart />
            </div>
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
              <FaTag /> <small>Gas Price</small>
            </div>
            <div className="">1 gwei</div>
          </div>
          <div className="border-b px-[10px]">
           
            <div className="mt-3">
              <Chart />
            </div>
          </div>
          <div className="px-[10px]">
         
            <div className="mt-3">
            <Chart />
            </div>
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
              <h2 className="font-thin">5.12s</h2>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <BsStopwatch /> <small>Page Latency</small>
            </div>
            <div className="">91ms</div>
          </div>
          <div className="border-b px-[10px]">
            <small>Last Block Miners</small>
            <div className="mt-3">
              <small className="text-[10px]">
                0x9e14a0597573abe111557558ccf547a48b9c76d4
              </small>{" "}
              <br />
              <small className="text-[10px]">
                0x9e14a0597573abe111557558ccf547a48b9c76d4
              </small>
            </div>
          </div>
          <div className="flex items-center py-1 justify-between  border-b px-[10px]">
            <div className="flex items-center gap-x-2 ">
              <BsFillLightbulbFill/> <small>Uptime</small>
            </div>
            <div className="">100%</div>
          </div>
          <div className="border-b px-[10px]">
            <small>Transactions</small>
            <div className="mt-3">
             <Chart/>
            </div>
          </div>
        </div>
        {/* Avg Block Time end */}
      </div>
      {/* List Start  */}
      <div className="max-w-container mx-auto px-[10px]  py-[10px] overflow-x-scroll" ></div>
      {/* list end */}
    </>
  );
};

export default Monitoring;
