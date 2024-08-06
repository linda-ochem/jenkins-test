import React, { useEffect, useState, useRef } from "react";
import Transition from "../utils/Transition";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { connect, useDispatch } from "react-redux";
import {
  getAllTotalsElement,
  getAllDailyTotalsElement,
} from "../redux/admin/admin.actions";
import {
  DashboardCard,
  NoLinkCard,
  TransactionCard,
} from "../partials/adminDashboard/adminAnalytics/DashboardCard";
import { fetchDailyBalanceElement } from "../actions";
import routes from "../routes";
import { formatAmount, getCurrency } from "../utils/Utils";
import moment from "moment";
import ElementUserAnalytics from "../partials/adminDashboard/adminAnalytics/ElementUserAnalytics";
import ElementRevenueAnalytics from "../partials/adminDashboard/adminAnalytics/ElementRevenueAnalytics";

function ElementDashboard(props) {
  const {
    auth: { user },
  } = props;
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [balances, setBalances] = useState([]);
  const [monthBalances, setMonthBalances] = useState([]);
  const [twoWeeksBalances, setTwoWeeksBalances] = useState([]);
  const [oneWeekBalances, setOneWeekBalances] = useState([]);

  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const initial = "USD";

  useEffect(() => {
    initial; // Set initial selected period after component mount
  }, [initial]);

  const totals = props.admin?.totals;
  // console.log(totalItems);
  // console.log(totals);

  useEffect(() => {
    props.getAllTotalsElement(
      selectedCurrency ? selectedCurrency.value : initial
    );
    fetchMonthBalances();
    fetch2weeksBalances();
    fetch1weekBalances();
    // fboBalanceFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  function calculateDates(duration) {
    const currentDate = new Date();
    let startDate, endDate;

    switch (duration) {
      case "1month":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          currentDate.getDate()
        );
        break;
      case "2weeks":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 14
        );
        break;
      case "1week":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 7
        );
        break;
      default:
        throw new Error("Invalid duration");
    }

    endDate = currentDate;

    return { startDate, endDate };
  }

  const fetchMonthBalances = async () => {
    const { startDate, endDate } = calculateDates("1month");
    try {
      const response1 = await fetchDailyBalanceElement(
        selectedCurrency ? selectedCurrency.value : initial,
        moment(startDate).format("YYYY-MM-DD"),
        moment(endDate).format("YYYY-MM-DD")
      );
      setMonthBalances(response1.data);
      // console.log("1Month balances...", response1);
    } catch (error) {
      // console.log(error);
    }
  };

  const fetch2weeksBalances = async () => {
    try {
      (async () => {
        const { startDate, endDate } = calculateDates("2weeks");
        const response2 = await fetchDailyBalanceElement(
          selectedCurrency ? selectedCurrency.value : initial,
          moment(startDate).format("YYYY-MM-DD"),
          moment(endDate).format("YYYY-MM-DD")
        );
        setTwoWeeksBalances(response2.data);
        // console.log("2weeks balances...", response2);
      })();
    } catch (error) {
      // console.log(error);
    }
  };

  const fetch1weekBalances = async () => {
    try {
      (async () => {
        const { startDate, endDate } = calculateDates("1week");
        const response2 = await fetchDailyBalanceElement(
          selectedCurrency ? selectedCurrency.value : initial,
          moment(startDate).format("YYYY-MM-DD"),
          moment(endDate).format("YYYY-MM-DD")
        );
        setOneWeekBalances(response2.data);
        // console.log("1week balances...", response2);
      })();
    } catch (error) {
      // console.log(error);
    }
  };

  // const WalletSum = async () => {
  //   try {
  //     const res = await getAllTotalsElement(initial);
  //     // console.log("wallet sum: ",res);
  //     setFBoBalance(res.data?.data?.availableBalance);
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   WalletSum();
  // }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        Role={props.Role}
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Element Dashboard"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            {/* <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> */}
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Line chart (Revenue Analytics) */}
              {(props.Role === "super-admin" ||
                props.Role === "finance-admin") && (
                <ElementRevenueAnalytics
                  totals={totals}
                  oneWeekBalances={oneWeekBalances}
                  twoWeeksBalances={twoWeeksBalances}
                  monthBalances={monthBalances}
                />
              )}

              {/* Line chart (User Analytics) */}
              <ElementUserAnalytics
                totals={totals}
                oneWeekBalances={oneWeekBalances}
                twoWeeksBalances={twoWeeksBalances}
                monthBalances={monthBalances}
              />
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 mt-10 mb-10"></div>
            <div className="grid grid-cols-12 gap-6">
              {/*  (Metrics card) */}
              {(props.Role === "super-admin" ||
                props.Role === "finance-admin") && (
                <>
                  <TransactionCard
                    title={`Total Transactions ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.totalTransactions
                        ? formatAmount(totals?.totalTransactions / 100, 2)
                        : 0
                    }
                    week={
                      oneWeekBalances?.totalTransactions
                        ? formatAmount(
                            oneWeekBalances?.totalTransactions / 100,
                            2
                          )
                        : 0
                    }
                    twoWeeks={
                      twoWeeksBalances?.totalTransactions
                        ? formatAmount(
                            twoWeeksBalances?.totalTransactions / 100,
                            2
                          )
                        : 0
                    }
                    month={
                      monthBalances?.totalTransactions
                        ? formatAmount(
                            monthBalances?.totalTransactions / 100,
                            2
                          )
                        : 0
                    }
                    thisMonth={
                      totals?.totalTransactions
                        ? formatAmount(totals?.totalTransactions / 100, 2)
                        : 0
                    }
                    // rate="10.5"
                    // balance="100,000"
                    linkName="See All Transactions"
                    // to={routes.payment_histories}
                  />

                  <DashboardCard
                    title={`Total Withdrawal ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.withdrawalSum
                        ? formatAmount(totals?.withdrawalSum / 100, 2)
                        : 0
                    }
                    week={
                      oneWeekBalances?.withdrawalSum
                        ? formatAmount(oneWeekBalances?.withdrawalSum / 100, 2)
                        : 0
                    }
                    twoWeeks={
                      twoWeeksBalances?.withdrawalSum
                        ? formatAmount(twoWeeksBalances?.withdrawalSum / 100, 2)
                        : 0
                    }
                    month={
                      monthBalances?.withdrawalSum
                        ? formatAmount(monthBalances?.withdrawalSum / 100, 2)
                        : 0
                    }
                    rate="49"
                    balance="88,740"
                    linkName="See More"
                    // to="/payment-histories#transactions"
                  />

                  <DashboardCard
                    title={`Total Transfers ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.transferSum
                        ? formatAmount(totals?.transferSum / 100, 2)
                        : 0
                    }
                    week={
                      oneWeekBalances?.transferSum
                        ? formatAmount(oneWeekBalances?.transferSum / 100, 2)
                        : 0
                    }
                    twoWeeks={
                      twoWeeksBalances?.transferSum
                        ? formatAmount(twoWeeksBalances?.transferSum / 100, 2)
                        : 0
                    }
                    month={
                      monthBalances?.transferSum
                        ? formatAmount(monthBalances?.transferSum / 100, 2)
                        : 0
                    }
                    linkName="See All Transactions"
                    // to="/payment-histories#transfers"
                  />

                  <DashboardCard
                    title={`Total Wallet Deposits ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.totalWalletDeposit
                        ? formatAmount(totals?.totalWalletDeposit / 100, 2)
                        : 0
                    }
                    week={
                      oneWeekBalances?.totalWalletDeposit
                        ? formatAmount(
                            oneWeekBalances?.totalWalletDeposit / 100,
                            2
                          )
                        : 0
                    }
                    twoWeeks={
                      twoWeeksBalances?.totalWalletDeposit
                        ? formatAmount(
                            twoWeeksBalances?.totalWalletDeposit / 100,
                            2
                          )
                        : 0
                    }
                    month={
                      monthBalances?.totalWalletDeposit
                        ? formatAmount(
                            monthBalances?.totalWalletDeposit / 100,
                            2
                          )
                        : 0
                    }
                    linkName="See All Transactions"
                    // to="/user_updates#bottom"
                  />

                  <DashboardCard
                    title="Total Number of users"
                    amount={totals?.users ? totals?.users?.toLocaleString() : 0}
                    week={
                      oneWeekBalances?.users
                        ? oneWeekBalances?.users?.toLocaleString()
                        : 0
                    }
                    twoWeeks={
                      twoWeeksBalances?.users
                        ? twoWeeksBalances?.users?.toLocaleString()
                        : 0
                    }
                    month={
                      monthBalances?.users
                        ? monthBalances?.users?.toLocaleString()
                        : 0
                    }
                    // rate="10.5"
                    // balance="96,000"
                    linkName="See Users"
                    to={routes.user_updates}
                  />

                  <DashboardCard
                    title={`Total Wallet Balance ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.totalWalletBalance
                        ? formatAmount(totals?.totalWalletBalance / 100, 2)
                        : 0
                    }
                    linkName="See more"
                    to="/user_updates#bottom"
                  />

                  <NoLinkCard
                    title={`Founders Card ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={totals?.foundersCards ? totals?.foundersCards : 0}
                  />
                  <NoLinkCard
                    title={`Total Withdrawal Profit ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )} (All Time)`}
                    amount={
                      totals?.withdrawalSumProfit
                        ? formatAmount(totals?.withdrawalSumProfit / 100, 2)
                        : 0
                    }
                  />

                  <DashboardCard
                    title="Pending Account Requests"
                    amount={
                      totals?.pendingAccountNumberRequest
                        ? totals?.pendingAccountNumberRequest?.toLocaleString()
                        : 0
                    }
                    linkName="See more"
                    // to={routes.pendingacct_requests}
                  />

                  <DashboardCard
                    title="Total Charges on Card Creation"
                    amount={
                      totals?.totalCardCreationProfit
                        ? formatAmount(totals?.totalCardCreationProfit / 100, 2)
                        : 0
                    }
                    linkName="See More"
                    // to="/card-tab#cardTransactions"
                  />
                  <DashboardCard
                    title={`Total Card Funding ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.cardFundings
                        ? formatAmount(totals?.cardFundings / 100, 2)
                        : 0
                    }
                    linkName="See More"
                    to="/card-tab#cardTransactions"
                  />
                  <DashboardCard
                    title={`Total Card Transaction count `}
                    amount={
                      totals?.totalCardTransactions
                        ? totals?.totalCardTransactions.toLocaleString()
                        : 0
                    }
                    linkName="See More"
                    // to="/card-tab#cardTransactions"
                  />
                </>
              )}
              {props.Role === "super-admin" ||
              props.Role === "finance-admin" ? (
                ""
              ) : (
                <DashboardCard
                  title="Total Number of users"
                  amount={totals?.users ? totals?.users?.toLocaleString() : 0}
                  week={
                    oneWeekBalances?.users
                      ? oneWeekBalances?.users?.toLocaleString()
                      : 0
                  }
                  twoWeeks={
                    twoWeeksBalances?.users
                      ? twoWeeksBalances?.users?.toLocaleString()
                      : 0
                  }
                  month={
                    monthBalances?.users
                      ? monthBalances?.users?.toLocaleString()
                      : 0
                  }
                  // rate="10.5"
                  // balance="96,000"
                  linkName="See Users"
                  to={routes.element_users}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getAllTotalsElement: (selectedCurrency) => {
    dispatch(getAllTotalsElement(selectedCurrency));
  },
  getAllDailyTotalsElement: (selectedCurrency, duration) => {
    dispatch(getAllDailyTotalsElement(selectedCurrency, duration));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
  isModalOpen: state.isModalOpen,
});

function DashboardDropdown({ options, selected, setSelected }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn justify-between min-w-44 bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        aria-label="Select date range"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="flex items-center">
          <span>{selected ? selected.currency : "Select currency"}</span>
        </span>
        <svg
          className="shrink-0 ml-1 fill-current text-slate-400"
          width="11"
          height="7"
          viewBox="0 0 11 7"
        >
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="z-10 absolute top-full left-0 w-full bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-slate-600"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {options.map((option) => (
            <button
              key={option.id}
              tabIndex="0"
              className={`flex items-center w-full hover:bg-slate-50 py-1 px-3 cursor-pointer ${
                selected && option.id === selected.id ? "text-indigo-500" : ""
              }`}
              onClick={() => {
                setSelected(option);
                setDropdownOpen(false);
              }}
            >
              {selected && option.id === selected.id && (
                <svg
                  className="shrink-0 mr-2 fill-current text-indigo-500"
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                >
                  <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.696L3.989 9.41l8.423-8.423a1 1 0 00-1.414-1.414z" />
                </svg>
              )}
              <span>{option.currency}</span>
            </button>
          ))}
        </div>
      </Transition>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ElementDashboard);
