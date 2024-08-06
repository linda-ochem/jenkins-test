import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import ExchangeRates from "../partials/tabcomponents/ExchangeRates";
import TransactionLimits from "../partials/tabcomponents/TransactionLimits";

function RatesAndLimits() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Rates And Limits"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
            {/* Page tabs */}
            <div className="border-b border-gray-300">
              <div className="flex text-blue-900 gap-12">
                <button
                  className={`${
                    activeTab === "1"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("1")}
                >
                  Exchange Rates
                </button>
                <button
                  className={`${
                    activeTab === "2"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("2")}
                >
                  Transaction Limits
                </button>
              </div>
            </div>
            <div className="p-4">
              {activeTab === "1" && <ExchangeRates />}
              {activeTab === "2" && <TransactionLimits />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RatesAndLimits;
