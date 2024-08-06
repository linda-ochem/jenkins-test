import React, { useEffect, useRef, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import UserAnalytics from "../partials/adminDashboard/adminAnalytics/UserAnalytics";
import SearchForm from "../partials/actions/SearchForm";
import { connect, useDispatch } from "react-redux";
import { toWholeCurrency } from "../helpers";
import routes from "../routes";
import { Table, message, DatePicker, Spin } from "antd";
import { fetchAllUsers } from "../redux/customers/customers.action";
import {
  getAllPendingAcctRequest,
  getAllTotals,
} from "../redux/admin/admin.actions";
import {
  UserUpdateCards,
  UserUpdateCards2,
} from "../partials/adminDashboard/adminAnalytics/DashboardCard";
import { useLocation, useNavigate } from "react-router-dom";
import { getPendingKYC } from "../actions";
import { sendGetRequest2 } from "../requests";
import ModalBlank from "../partials/actions/ModalBlank";
import moment from "moment";

function UserUpdates(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const targetRef = useRef();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [kycStatus, setKycStatus] = useState("pending");
  const [pageNumber, setpageNumber] = useState(1);
  const [currency, setCurrency] = useState("NGN");
  const [allPending, setAllPending] = useState([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const dataSource = props.customers?.customers?.data?.data;
  const totalItems = props.customers?.customers?.data?.pagination?.total;
  const totals = props.admin?.totals;

  const [exportFilterParams, setExportFilterParams] = useState({
    email: "",
    element: "",
    blacklisted: "",
    kycLevel: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  const handleExportFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setExportFilterParams({
      ...exportFilterParams,
      [name]: newValue,
    });
  };

  const handleExportDateRangeChange = (date, dateString) => {
    setExportFilterParams({
      ...exportFilterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
    // console.log(dateString)
  };

  // const handleExportChange = (field, value, isCheckbox = false) => {
  //   setExportFilterParams((prevState) => ({
  //     ...prevState,
  //     [field]: isCheckbox ? value.target.checked : value,
  //   }));
  // };

  useEffect(() => {
    dispatch(getAllPendingAcctRequest(pageNumber, kycStatus, searchQuery));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, kycStatus, searchQuery]);

  //makes the call to fetch all users
  useEffect(() => {
    props.fetchAllUsers(pageNumber, searchQuery);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchQuery]);

  //makes the call to fetch all totals
  useEffect(() => {
    props.getAllTotals(currency);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  useEffect(() => {
    fetchPendingKyc(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const fetchPendingKyc = async (pageNumber) => {
    try {
      const response = await getPendingKYC(pageNumber);
      setAllPending(response?.pagination?.total);
    } catch (error) {
      message.error("Unable to fetch data, pls try again");
    }
  };

  const fetchSavingsReport = async () => {
    const queryString = Object.keys(exportFilterParams)
      .filter(
        (key) =>
          exportFilterParams[key] !== null && exportFilterParams[key] !== ""
      ) // Filter out empty and null values
      .map((key) => `${key}=${exportFilterParams[key]}`)
      .join("&");

    try {
      setLoading(true);
      const response = await sendGetRequest2(
        `/admin/customers-export?page=${pageNumber}&limit=50${
          queryString ? `&${queryString}` : ""
        }`
      );
      // console.log(response);
      if (response.data) {
        setLoading(false);
        console.log(response);
      } else {
        setLoading(false);
        console.error("Error fetching data from the API");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network error:", error);
    }
  };

  const handleRowClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/userdetails/${record.id}`, {
      state: { user: record },
    });
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 60,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      render: (text, record) => (
        <div
          style={{ cursor: "Pointer", color: "#1E3A8A" }}
          onClick={() => handleRowClick(record)}
        >
          {`${record.firstName} ${record.lastName}`}
        </div>
      ),
      // fixed: "left",
      width: 200,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => {
        if (text === "false" && record.phoneNumberNew) {
          const { code, local } = record.phoneNumberNew;
          return `${code} ${local}`;
        } else {
          return text;
        }
      },
      width: 200,
    },
    {
      title: "KYC Level",
      dataIndex: "kycLevel",
      width: 100,
    },
    {
      title: "NGN Balance",
      dataIndex: "walletInNGNKobo",
      render: (walletInNGNKobo) => {
        return toWholeCurrency(walletInNGNKobo);
      },
      width: 100,
    },
    {
      title: "USD Balance",
      dataIndex: "walletAmountInUSCents",
      render: (walletAmountInUSCents) => {
        return toWholeCurrency(walletAmountInUSCents);
      },
      width: 100,
    },
    {
      title: "Verification Type",
      dataIndex: "verificationType",
      render: (verificationType) => {
        return verificationType ? verificationType : "null";
      },
      width: 150,
    },
    {
      title: "AccountNumber",
      dataIndex: "providusAccountNumber",
      // fixed: "right",
      render: (providusAccountNumber) => {
        return providusAccountNumber ? providusAccountNumber : "N/A";
      },
      width: 150,
    },
  ];

  useEffect(() => {
    if (location.hash === "#bottom") {
      // Scroll to the target element when the hash is '#bottom'
      targetRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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
          title="User Updates"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/*  (Metrics card) */}
              <UserUpdateCards
                title="Total Number of Users"
                amount={totals?.users ? totals?.users?.toLocaleString() : "..."}
                linkName="See All Users"
              />
              <UserUpdateCards2
                title="All Users with Approved KYC"
                amount={
                  totals?.totalLevelOneUsers
                    ? totals?.totalLevelOneUsers?.toLocaleString()
                    : "..."
                }
              />

              <UserUpdateCards
                title="Users with Pending KYC"
                amount={allPending ? allPending?.toLocaleString() : "..."}
                linkName="Approve KYC"
                to={routes.pending_kyc}
              />
              <UserUpdateCards
                title="Pending Account Requests"
                amount={
                  totals?.pendingAccountNumberRequest
                    ? totals?.pendingAccountNumberRequest
                    : "..."
                }
                linkName="Assign Account Numbers"
                to={routes.pendingacct_requests}
              />
            </div>
            {/* Line chart (User Analytics) */}
            <div className="py-4">
              <UserAnalytics totals={totals} />
            </div>
            {/* Content */}
            <div className="mt-10">
              <div className="relative">
                {/* pageNumber header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0 py-4">
                    <h1 className="text-xl md:text-3xl text-blue-900 font-bold">
                      User List
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    {props.Role === "super-admin" && (
                      <div className="grid grid-flow-col sm:auto-cols-max justify-between sm:justify-end gap-2">
                        <button
                          className="bg-blue-900 rounded flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                          onClick={() => setExportModalOpen(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>

                          <span className="text-white">Export</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full">
                    <div className="hidden sm:block w-full">
                      <SearchForm
                        placeholder="Search for user by name or email"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                      />
                    </div>
                  </div>
                  <div className="" id="bottom">
                    <Table
                      loading={props.customers?.loading}
                      columns={columns}
                      dataSource={dataSource}
                      rowkey={(record) => record.id}
                      pagination={{
                        current: pageNumber,
                        total: totalItems,
                        pageSize: 50,
                        onChange: (pageNumber) => {
                          setpageNumber(pageNumber);
                        },
                      }}
                      scroll={{
                        x: 1000,
                        y: 500,
                      }}
                    ></Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* export filter */}
      <ModalBlank
        id="report-modal"
        modalOpen={exportModalOpen}
        setModalOpen={setExportModalOpen}
        click={() => {
          setExportModalOpen(false);
          setExportFilterParams({
            email: "",
            element: "",
            blacklisted: "",
            kycLevel: "",
            userId: "",
            startDate: "",
            endDate: "",
          });
        }}
        title="Export Filter"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full gap-4 ">
                {/* Left: Searchbar */}
                <div className="mb-4 sm:mb-0 w-full">
                  <div className=" flex justify-start gap-8 items-center ">
                    <div className="w-1/4">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="blacklisted"
                      >
                        Blacklisted
                      </label>

                      <input
                        type="checkbox"
                        name="blacklisted"
                        className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                        value={exportFilterParams.blacklisted}
                        onChange={handleExportFilterChange}
                      />
                    </div>
                    <div className="w-1/4">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="element"
                      >
                        Element
                      </label>

                      <input
                        type="checkbox"
                        name="element"
                        className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                        value={exportFilterParams.element}
                        onChange={handleExportFilterChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4 sm:mb-0 w-full">
                  <div className=" hidden sm:block w-full ">
                    <label htmlFor="Currency" className="sr-only">
                      Select Type
                    </label>
                    <select
                      name="status"
                      value={exportFilterParams.kycLevel}
                      onChange={handleExportFilterChange}
                      className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        exportFilterParams.kycLevel
                          ? "bg-blue-100"
                          : "bg-transparent"
                      }`}
                    >
                      <option value="">
                        {exportFilterParams.kycLevel
                          ? exportFilterParams.kycLevel
                          : "KYC LEVEL"}
                      </option>
                      <option value="active">Level 1 </option>
                      <option value="completed">Level 2 </option>
                      <option value="pending">Level 3 </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-4 items-center">
                <div className="w-1/2">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="email"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    value={exportFilterParams.email}
                    onChange={handleExportFilterChange}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="userid"
                  >
                    User ID
                  </label>

                  <input
                    type="text"
                    name="userId"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    value={exportFilterParams.userId}
                    onChange={handleExportFilterChange}
                  />
                </div>
              </div>
              <div className="sm:flex sm:justify-between sm:items-center mt-4 pt-4 md:mb-2 w-full gap-4">
                <DatePicker.RangePicker
                  style={{
                    borderRadius: "18px",
                    padding: "7px 11px 7px",
                    borderColor: "#3b82f680",
                    width: "100%",
                  }}
                  value={[
                    exportFilterParams.startDate
                      ? moment(exportFilterParams.startDate)
                      : "",
                    exportFilterParams.endDate
                      ? moment(exportFilterParams.endDate)
                      : "",
                  ]}
                  onChange={handleExportDateRangeChange}
                />
              </div>
            </div>
          </form>
        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 w-full">
          <div className="flex flex-wrap justify-between w-full">
            {loading ? (
              <div className="flex items-center justify-center mx-auto">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <button
                  className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExportModalOpen(false);
                    setExportFilterParams({
                      email: "",
                      element: "",
                      blacklisted: "",
                      kycLevel: "",
                      userId: "",
                      startDate: "",
                      endDate: "",
                    });
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    fetchSavingsReport();
                  }}
                  disabled={loading}
                  className="btn-sm border-blue-600 h-16 w-1/2 flex flex-col bg-blue-900 text-white hover:bg-blue-950"
                >
                  {loading ? "Exporting Data..." : "Export Data"}
                </button>
              </>
            )}
          </div>
        </div>
      </ModalBlank>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  fetchAllUsers: (pageNumber, searchQuery) => {
    dispatch(fetchAllUsers(pageNumber, searchQuery));
  },
  getAllTotals: (currency) => {
    dispatch(getAllTotals(currency));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdates);
