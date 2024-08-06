import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import MerchantPayments from "./MigrationFees";
import Transfers from "./Transfers";
import Transactions from "./Transactions";
import BillsPayment from "./BillsPayment";

function PaymentHistories(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (location.hash === "#transfers") {
      setActiveTab("3");
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
          title="Payment History"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            {/* <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> */}
            {/* Page tabs */}
            <div className="border-b border-gray-300">
              <div className="flex text-blue-900 gap-12">
                <button
                  id="transactions"
                  className={`${
                    activeTab === "1"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("1")}
                >
                  Transactions
                </button>
                <button
                  id="transfers"
                  className={`${
                    activeTab === "3"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("3")}
                >
                  Transfers
                </button>

                <button
                  id="billspayments"
                  className={`${
                    activeTab === "5"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("5")}
                >
                  Bills Payment
                </button>
              </div>
            </div>
            <div className="p-4">
              {activeTab === "1" && <Transactions Role={props.Role} />}
              {activeTab === "3" && <Transfers />}
              {activeTab === "4" && <MerchantPayments />}
              {activeTab === "5" && <BillsPayment />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PaymentHistories;
