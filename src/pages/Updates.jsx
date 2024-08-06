import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import AppUpdates from "../partials/tabcomponents/AppUpdates";
import EmailUpdates from "../partials/tabcomponents/EmailUpdates";

function Updates() {
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
          title="Updates"
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
                  App Updates
                </button>
                <button
                  className={`${
                    activeTab === "2"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("2")}
                >
                  Email Update
                </button>
              </div>
            </div>
            <div className="p-4">
              {activeTab === "1" && <AppUpdates />}
              {activeTab === "2" && <EmailUpdates />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Updates;
