import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import VisaForms from "../partials/tabcomponents/VisaForms";

function PathwaysTabs(props) {
  // console.log(props.Role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (location.hash === "#breaksaferequests") {
      setActiveTab("2");
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
          title="Safe Lock"
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
                  id="visaforms"
                  className={`${
                    activeTab === "1"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("1")}
                >
                  All Visa Forms
                </button>
              </div>
            </div>
            <div className="p-4">
              {activeTab === "1" && <VisaForms Role={props.Role} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PathwaysTabs;
