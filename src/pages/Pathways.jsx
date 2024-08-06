import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { AppUpdateCard } from "../partials/adminDashboard/adminAnalytics/DashboardCard";
import routes from "../routes";

function Pathways(props) {
  // const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Pathways"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4">
          {/* Cards */}
          <div className="grid grid-cols-12 lg:grid-cols-8 md:grid-cols-12 gap-6 py-8">
            {props.Role !== "legal-officer" && (
              <>
                <AppUpdateCard
                  title="Migration Fees"
                  linkName="View Migration Fees"
                  to={routes.migration_payment}
                />
                <AppUpdateCard
                  title="STV Payments"
                  linkName="View all payments"
                  to={routes.stv_payments}
                />
              </>
            )}
            <AppUpdateCard
              title="Petition Form Submissions"
              linkName="View submissions"
              to={routes.petition_submissions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pathways;
