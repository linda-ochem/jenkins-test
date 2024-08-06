import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import CardTransactions from "./CardTransactions";
import VirtualConversions from "./VirtualConversions";
import { DashboardCard01 } from "../partials/adminDashboard/adminAnalytics/DashboardCard";
import routes from "../routes";
import { connect, useDispatch } from "react-redux";
import { getVirtualCardConversion } from "../actions";
import { getAllTotals } from "../redux/admin/admin.actions";
import { formatAmount } from "../utils/Utils";
import PhysicalCardTransactions from "./PhysicalCardTransactions";

function CardTab(props) {
  // console.log(props)
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [foundersCardUsers, setFoundersCardUsers] = useState(null);

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (location.hash === "#cardTransactions") {
      setActiveTab("1");
    }
  }, [location]);

  const totals = props.admin?.totals;

  const fetchFoundersCardUsers = async () => {
    try {
      (async () => {
        const response = await getVirtualCardConversion("Stripe");
        // console.log(response);
        setFoundersCardUsers(response.data.length);
      })();
    } catch (error) {
      message.error(
        "Unable to fetch transaction at this time. Please try again later"
      );
    }
  };

  useEffect(() => {
    dispatch(getAllTotals("NGN"));
    fetchFoundersCardUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(totals);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Cards"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            {/* <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> */}
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/*  (Metrics card) */}
              <DashboardCard01
                title="Total Charges on Card Creation"
                amount={
                  totals?.totalCardCreationProfit
                    ? formatAmount(totals?.totalCardCreationProfit / 100, 2)
                    : "..."
                }
                linkName="See All Transactions"
              />
              <DashboardCard01
                title="Total Number of Physical Naira Cards"
                amount={
                  totals?.deliveredGGCards
                    ? totals?.deliveredGGCards?.toLocaleString()
                    : "..."
                }
                linkName="View Waitlist"
                to={routes.physical_waitlist}
              />
              <DashboardCard01
                title="Total Number of Tyrus Cards"
                amount={
                  totals?.tyrusCards
                    ? totals?.tyrusCards?.toLocaleString()
                    : "..."
                }
                linkName="View Waitlist"
                to={routes.physical_waitlist}
              />
              <DashboardCard01
                title="Total Number of Founders Cards"
                amount={
                  totals?.foundersCards
                    ? totals.foundersCards.toLocaleString()
                    : "..."
                }
                // linkName="View Whitelist"
                // to={routes.founders_waitlist}
              />
            </div>
            {/* Page tabs */}
            <div className="border-b border-gray-300 pt-8">
              <div className="flex text-blue-900 gap-12">
                <button
                  id="cardTransactions"
                  className={`${
                    activeTab === "1"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("1")}
                >
                  Card Transactions
                </button>
                <button
                  id="cardConversions"
                  className={`${
                    activeTab === "2"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("2")}
                >
                  Virtual Card Lists
                </button>
                <button
                  id="cardTransactions"
                  className={`${
                    activeTab === "3"
                      ? "text-blue-900 border-b-4 border-blue-900"
                      : "text-gray-500"
                  } py-2 px-4 font-semibold`}
                  onClick={() => handleTabSelect("3")}
                >
                  Physical Card Transactions
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === "1" && <CardTransactions />}
              {activeTab === "2" && (
                <VirtualConversions Role={props.Role} user={props.user} />
              )}
              {activeTab === "3" && <PhysicalCardTransactions />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(CardTab);
