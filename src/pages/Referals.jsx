import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import RefBonusWithdrawal from "../partials/tabcomponents/RefBonusWithdrawal";
import Referrers from "../partials/tabcomponents/Referrers";
import ElementReferrers from "../partials/tabcomponents/ElementReferrers";
import ElementRefBonusWithdrawal from "../partials/tabcomponents/ElementRefBonusWithdrawal";

function Referals(props) {
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
          title="Referrals"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
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
                  Referrers
                </button>
                <button
                  className={`${
                    activeTab === "2"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("2")}
                >
                  Bonus Withdrawal
                </button>
                <button
                  className={`${
                    activeTab === "3"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("3")}
                >
                  Element Referers
                </button>
                <button
                  className={`${
                    activeTab === "4"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("4")}
                >
                  Element Bonus Withdrawal
                </button>
              </div>
            </div>
            <div className="p-4">
              {activeTab === "1" && <Referrers />}
              {activeTab === "2" && <RefBonusWithdrawal Role={props.Role} />}
              {activeTab === "3" && <ElementReferrers />}
              {activeTab === "4" && (
                <ElementRefBonusWithdrawal Role={props.Role} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Referals;
