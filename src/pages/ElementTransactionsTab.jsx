import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import ElementDeposits from "./ElementDeposits";
import ElementWithdrawal from "./ElementWithdrawal";

function ElementTransactionsTab(props) {
  // console.log(props.Role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (location.hash === "#breaksaferequests") {
      setActiveTab("3");
    }
    if (location.hash === "#safelocktransactions") {
      setActiveTab("1");
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Element Transactions"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
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
                  Deposits Transactions
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
                  Withdrawal Transactions
                </button>
              </div>
            </div>
            <div className="p-4">
              {activeTab === "1" && <ElementDeposits Role={props.Role} />}
              {activeTab === "2" && <ElementWithdrawal Role={props.Role} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ElementTransactionsTab;
