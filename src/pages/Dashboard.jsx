import React, { useEffect, useState, useRef } from "react";
import Transition from "../utils/Transition";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/adminDashboard/adminAnalytics/WelcomeBanner";
import RevenueAnalytics from "../partials/adminDashboard/adminAnalytics/RevenueAnalytics";
import UserAnalytics from "../partials/adminDashboard/adminAnalytics/UserAnalytics";
import { connect, useDispatch } from "react-redux";
import { toWholeCurrency } from "../helpers";
import { getAllTotals, getAllDailyTotals } from "../redux/admin/admin.actions";
import {
  DashboardCard,
  NoLinkCard,
  TransactionCard,
} from "../partials/adminDashboard/adminAnalytics/DashboardCard";
import {
  fboBalance,
  fetchDailyBalance,
  getTotals,
  updateProfile,
} from "../actions";
import routes from "../routes";
import { UpdateModal } from "../partials/actions/ModalBlank";
import { message } from "antd";
import { formatAmount, getCurrency } from "../utils/Utils";
import moment from "moment";
import { Logout } from "../redux/auth/auth.actions";

function Dashboard(props) {
  const {
    auth: { user },
  } = props;
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [balances, setBalances] = useState([]);
  const [fBoBalance, setFBoBalance] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [monthBalances, setMonthBalances] = useState([]);
  const [twoWeeksBalances, setTwoWeeksBalances] = useState([]);
  const [oneWeekBalances, setOneWeekBalances] = useState([]);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const initial = "NGN";

  useEffect(() => {
    initial; // Set initial selected period after component mount
  }, [initial]);

  const options = [
    {
      id: 0,
      value: "NGN",
      currency: "Naira (₦)",
    },
    {
      id: 1,
      value: "USD",
      currency: "Dollar ($)",
    },
    {
      id: 2,
      value: "GBP",
      currency: "Pounds (£)",
    },
    {
      id: 3,
      value: "GHS",
      currency: "Cedis (₵)",
    },
    {
      id: 4,
      value: "ZMW",
      currency: "Kwacha (ZMW)",
    },
  ];

  const totals = props.admin?.totals;
  // console.log(totalItems);
  // console.log(totals);

  useEffect(() => {
    props.getAllTotals(selectedCurrency ? selectedCurrency.value : initial);
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
      const response1 = await fetchDailyBalance(
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
        const response2 = await fetchDailyBalance(
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
        const response2 = await fetchDailyBalance(
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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setProfilePicture(base64String);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  var setInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    const maindata = {
      profilePicture,
      fullName: state.firstName + " " + state.lastName,
    };
    // console.log(maindata);
    setLoading(true);
    try {
      const response = await updateProfile(maindata);
      // console.log("response: ", response);
      message.success(response.message);
      if (response.message) {
        setLoading(false);
        setOpen(false);
      }
      dispatch(Logout());
    } catch (error) {
      setLoading(false);
      message.error(
        "Sorry, Couldn't update your profile at this time. Pls Try again later"
      );
    }
  };

  useEffect(() => {
    if (
      (user?.data?.data?.fullName === null &&
        user?.data?.data?.validFactorAuth) ||
      (user?.data?.data?.fullName === " " && user?.data?.data?.validFactorAuth)
    ) {
      setOpen(true);
    }
  }, [user]);

  const WalletSum = async () => {
    try {
      const res = await getTotals();
      // console.log("wallet sum: ",res);
      setFBoBalance(res.data?.data?.availableBalance);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    WalletSum();
    fboBalanceFetch();
  }, []);

  const fboBalanceFetch = async () => {
    try {
      const res = await fboBalance();
      // console.log(res);
      // console.log(res.data);
      setFBoBalance(res.data.availableBalance);
    } catch (error) {
      message.error(error.response?.data.message);
    }
  };

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
          title="Dashboard"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            {/* <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> */}
            {/* Welcome banner */}
            <WelcomeBanner />
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Line chart (Revenue Analytics) */}
              {(props.Role === "super-admin" ||
                props.Role === "finance-admin") && (
                <RevenueAnalytics
                  totals={totals}
                  oneWeekBalances={oneWeekBalances}
                  twoWeeksBalances={twoWeeksBalances}
                  monthBalances={monthBalances}
                />
              )}

              {/* Line chart (User Analytics) */}
              <UserAnalytics
                totals={totals}
                oneWeekBalances={oneWeekBalances}
                twoWeeksBalances={twoWeeksBalances}
                monthBalances={monthBalances}
              />
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 mt-10 mb-10">
              <div className="flex flex-col w-full">
                {(props.Role === "super-admin" ||
                  props.Role === "finance-admin") && (
                  <>
                    <p>Toggle here to see figures for different currencies</p>
                    <DashboardDropdown
                      options={options}
                      selected={selectedCurrency}
                      setSelected={setSelectedCurrency}
                      align="right"
                    />
                  </>
                )}
              </div>
            </div>
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
                    to={routes.payment_histories}
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
                    to="/payment-histories#transactions"
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
                    to="/payment-histories#transfers"
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
                    to="/user_updates#bottom"
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
                    title="Total Bills Payment"
                    amount={
                      totals?.billPayment
                        ? formatAmount(totals?.billPayment / 100, 2)
                        : 0
                    }
                    week={
                      oneWeekBalances?.billPayment
                        ? formatAmount(oneWeekBalances?.billPayment / 100, 2)
                        : 0
                    }
                    twoWeeks={
                      twoWeeksBalances?.billPayment
                        ? formatAmount(twoWeeksBalances?.billPayment / 100, 2)
                        : 0
                    }
                    month={
                      monthBalances?.billPayment
                        ? formatAmount(monthBalances?.billPayment / 100, 2)
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
                  <DashboardCard
                    title={`Total Providus Deposit ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )}`}
                    amount={
                      totals?.totalProvidusDeposit
                        ? formatAmount(totals?.totalProvidusDeposit / 100, 2)
                        : 0
                    }
                    linkName="See All Transactions"
                    to="/user_updates#bottom"
                  />
                  <DashboardCard
                    title="FBO Balance ($)"
                    amount={fBoBalance ? formatAmount(fBoBalance / 1, 2) : 0}
                    linkName="See More"
                    to={routes.fbo_transactions}
                  />
                  <NoLinkCard
                    title={`Total Withdrawal Profit ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )} (All Time)`}
                    amount={
                      totals?.withdrawalProfit
                        ? formatAmount(totals?.withdrawalProfit / 100, 2)
                        : 0
                    }
                  />
                  <DashboardCard
                    title={`Total Migration Payments ${getCurrency(
                      selectedCurrency ? selectedCurrency.value : initial
                    )} `}
                    amount={
                      totals?.sevisPayment
                        ? formatAmount(totals?.sevisPayment / 100, 2)
                        : 0
                    }
                    linkName="See More"
                    to="/payment-histories#merchantpayments"
                  />

                  <DashboardCard
                    title="Pending Account Requests"
                    amount={
                      totals?.pendingAccountNumberRequest
                        ? totals?.pendingAccountNumberRequest?.toLocaleString()
                        : 0
                    }
                    linkName="See more"
                    to={routes.pendingacct_requests}
                  />

                  <DashboardCard
                    title="Total Charges on Card Creation"
                    amount={
                      totals?.totalCardCreationProfit
                        ? formatAmount(totals?.totalCardCreationProfit / 100, 2)
                        : 0
                    }
                    linkName="See More"
                    to="/card-tab#cardTransactions"
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
                    to="/card-tab#cardTransactions"
                  />
                  <DashboardCard
                    title={`Total Locked Savings Amount `}
                    amount={
                      totals?.totalLockedSavingsAmount
                        ? formatAmount(
                            totals?.totalLockedSavingsAmount / 100,
                            2
                          )
                        : 0
                    }
                    linkName="See More"
                    to={routes.safelock}
                  />
                  <DashboardCard
                    title={`Total Completed Savings Amount `}
                    amount={
                      totals?.totalCompletedSavingsAmount
                        ? formatAmount(
                            totals?.totalCompletedSavingsAmount / 100,
                            2
                          )
                        : 0
                    }
                    linkName="See More"
                    to={routes.safelock}
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
                  to={routes.user_updates}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <UpdateModal
        title="Update your profile"
        modalOpen={open}
        setModalOpen={setOpen}
      >
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="userName"
                >
                  First Name
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  name="firstName"
                  value={state.firstName}
                  onChange={setInput}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="u"
                >
                  Last Name
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  name="lastName"
                  value={state.lastName}
                  onChange={setInput}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Upload profile Image
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  placeholder="Upload Image"
                  accept="image/*"
                  // onChange={(e) => handleUpload(e)}
                  onChange={handleUpload}
                  className={`form-input w-full px-2 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    profilePicture ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap justify-start items-end w-full">
            <button
              type="submit"
              onClick={() => handleUpdate()}
              disabled={
                (state.firstName !== "" &&
                  state.lastName !== "" &&
                  profilePicture !== null) ||
                !loading
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-12 flex w-full justify-center items-center ${
                state.firstName && state.lastName && profilePicture
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Update profile
            </button>
          </div>
        </div>
      </UpdateModal>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getAllTotals: (selectedCurrency) => {
    dispatch(getAllTotals(selectedCurrency));
  },
  getAllDailyTotals: (selectedCurrency, duration) => {
    dispatch(getAllDailyTotals(selectedCurrency, duration));
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
