import React, { useState } from "react";
import SingleSafeLock from "./SingleSafeLock";
import SingleSafeLockTransactions from "./SingleSafeLockTransactions";
import SingleSafelockRequests from "./SingleSafelockRequests";

const InnerSavingsTab = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  // console.log(props);

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
      {/* <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> */}
        {/* Page tabs */}
        <div className="border-b border-gray-300">
          <div className="flex text-blue-900 gap-12">
            <button
              id="safelock"
              className={`${
                activeTab === "1"
                  ? "text-blue-900 border-b-4 border-blue-900"
                  : "text-gray-500"
              } py-2 px-4 font-semibold`}
              onClick={() => handleTabSelect("1")}
            >
              {props.user?.firstName}'s Safelock Plans
            </button>
            <button
              id="safelock"
              className={`${
                activeTab === "2"
                  ? "text-blue-900 border-b-4 border-blue-900"
                  : "text-gray-500"
              } py-2 px-4 font-semibold`}
              onClick={() => handleTabSelect("2")}
            >
              {props.user?.firstName}'s Safelock Transactions
            </button>
            <button
              id="breaksafe"
              className={`${
                activeTab === "3"
                  ? "text-blue-900 border-b-4 border-blue-900"
                  : "text-gray-500"
              } py-2 px-4 font-semibold`}
              onClick={() => handleTabSelect("3")}
            >
              {props.user?.firstName}'s Break Safe Requests
            </button>
          </div>
        </div>
        <div className="">
          {activeTab === "1" && (
            <SingleSafeLock Role={props.Role} userId={props?.userId} />
          )}
          {activeTab === "2" && (
            <SingleSafeLockTransactions
              Role={props.Role}
              userId={props?.userId}
            />
          )}
          {activeTab === "3" && (
            <SingleSafelockRequests Role={props.Role} userId={props?.userId} />
          )}
        </div>
      </div>
    </main>
  );
};

export default InnerSavingsTab;
