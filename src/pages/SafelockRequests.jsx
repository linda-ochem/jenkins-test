import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { Button, DatePicker, Modal, Table, Tag, message } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ModalBlank from "../partials/actions/ModalBlank";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { approveDeclineBreakSafeRequests } from "../actions";
import SearchForm from "../partials/actions/SearchForm";
import { toWholeCurrency } from "../helpers";
import { sendGetRequest2 } from "../requests";

function SafeLockRequests(props) {
  const [filterParams, setFilterParams] = useState({
    status: "",
    currency: "",
    safeLockId: "",
    breakSafeLockId: "",
    userId: "",
    muturityStatus: "",
    search: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataSource, setDataSource] = useState(null);
  const [total, setTotal] = useState(null);
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  const handleDateRangeChange = (date, dateString) => {
    setFilterParams({
      ...filterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
    // console.log(dateString)
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilterParams({
      ...filterParams,
      [name]: newValue,
    });
  };

  const handleRowClick = (user) => {
    setModalOpen(true);
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/break-safe-requests?page=${pageNumber}&limit=10${
            queryString ? `&${queryString}` : ""
          }`
        );
        // console.log(response);
        if (response.data) {
          setLoading(false);
          // console.log(response);
          setDataSource(response.data?.data);
          setTotal(response.data?.pagination?.total);
          // setTotal(response.data?.data?.pagination.totalPages);
        } else {
          setLoading(false);
          console.error("Error fetching data from the API");
        }
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, [filterParams, pageNumber]);

  const handleAction = (requestId = id, status = action) => {
    Modal.confirm({
      title: `Are you sure you want to ${
        status === "declined" ? "decline" : "approve"
      } this request ?`,
      onOk: async () => {
        setLoading(true);
        try {
          const res = await approveDeclineBreakSafeRequests(requestId, status);
          // console.log(res);
          message.success(`${res.data.message}`);
          setLoading(false);
          setModalOpen(false);
          window.location.reload();
        } catch (error) {
          setLoading(false);
          message.error(error.response?.data.message);
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: `If you continue you will ${
        status === "declined" ? "decline" : "approve"
      } this request`,
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 80,
    },
    {
      title: "User Name",
      dataIndex: "senderName",
      render: (text, record) => {
        return (
          <div
            style={{ cursor: "pointer", color: "#080675" }}
            onClick={() => handleNameClick(record)}
          >
            {record?.user?.firstName + " " + record?.user?.lastName}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Email Address",
      // dataIndex: "email",
      render: (text, record) => {
        return record?.user?.email;
      },
      width: 200,
    },
    {
      title: "Target Amount",
      dataIndex: "targetAmount",
      render: (text, record) => {
        return toWholeCurrency(record.safeLock?.targetAmount);
      },
      width: 200,
    },
    {
      title: "Saved Amount",
      dataIndex: "amount",
      render: (text, record) => {
        return toWholeCurrency(record.safeLock?.lockedAmount);
      },
      width: 120,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      width: 120,
    },
    {
      title: "Savings Name",
      render: (text, record) => {
        return record.safeLock?.name;
      },
      width: 150,
    },
    {
      title: "Start Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.safeLock?.startDate, "YYYY-MM-DD HH:mm:ss").format(
          "lll"
        );
      },
      width: 120,
    },
    {
      title: "End Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.safeLock?.endDate, "YYYY-MM-DD HH:mm:ss").format(
          "lll"
        );
      },
      width: 120,
    },
    {
      title: "Approved By",
      index: "approvedBy",
      render: (text, record) => {
        return record.approvedBy;
      },
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      // fixed: "right",
      width: 120,
      render: (tag, record) => {
        let color;
        let text = "N/A"; // Default text for null status

        if (tag) {
          if (tag.includes("pending")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("active")) {
            color = "#117439";
            text = tag;
          } else {
            color = "#921616";
            text = tag;
          }
        }

        return (
          <Tag color={color} key={tag}>
            {text}
          </Tag>
        );
      },
    },
    (props.Role === "super-admin" || props.Role === "finance-admin") && {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => {
        return (
          <Button
            style={{ backgroundColor: "", color: "" }}
            onClick={() => handleRowClick(record)}
          >
            Take Action
          </Button>
        );
      },
    },
  ].filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="relative">
            <div className="w-full mx-auto">
              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                    Break Safe Requests
                  </h1>
                </div>

                {/* Right: Actions */}
                {/* See all card Transactions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* See all card Transactions */}
                  <button
                    onClick={goBack}
                    className=" hover:text-blue-900 text-blue-900 flex gap-2 text-lg font-bold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-900 font-bold"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                    Back
                  </button>
                </div>
              </div>

              <div className="border p-5">
                <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                  {/* Left: Searchbar */}
                  <div className="mb-4 sm:mb-0 w-full">
                    <div className=" hidden sm:block w-full ">
                      <SearchForm
                        name="search"
                        placeholder="Search for user transaction"
                        onChange={handleFilterChange}
                        value={filterParams.search}
                      />
                    </div>
                  </div>

                  {/* Right: filter Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <DatePicker.RangePicker
                      // className="rounded-full "
                      style={{
                        borderRadius: "18px",
                        padding: "7px 11px 7px",
                        borderColor: "#3b82f680",
                      }}
                      value={[
                        filterParams.startDate
                          ? moment(filterParams.startDate)
                          : "",
                        filterParams.endDate
                          ? moment(filterParams.endDate)
                          : "",
                      ]}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                </div>
                <div className="sm:flex sm:gap-3 sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                  {/* Filter by Transaction Status */}
                  <div className="w-[15%]">
                    <label htmlFor="Transaction Type" className="sr-only">
                      Select Type
                    </label>
                    <select
                      name="status"
                      value={filterParams.status}
                      onChange={handleFilterChange}
                      className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        filterParams.trxType ? "bg-blue-100" : "bg-transparent"
                      }`}
                    >
                      <option value="">
                        {filterParams.status ? filterParams.status : "Status"}
                      </option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>

                  {/* Filter by Currency */}
                  <div className="w-[15%]">
                    <label htmlFor="Currency" className="sr-only">
                      Select Type
                    </label>
                    <select
                      name="currency"
                      value={filterParams.currency}
                      onChange={handleFilterChange}
                      className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        filterParams.currency ? "bg-blue-100" : "bg-transparent"
                      }`}
                    >
                      <option value="">
                        {filterParams.currency
                          ? filterParams.currency
                          : "Currency"}
                      </option>
                      <option value="NGN">Naira (₦)</option>
                      <option value="USD">Dollar ($)</option>
                      <option value="GBP">Pounds (£)</option>
                      <option value="GHS">Cedis (¢)</option>
                      <option value="ZMW">Kwacha (zmw)</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="table-auto w-full">
                  <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        All Requests{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
                      </h2>
                    </header>

                    {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                          <p className="font-semibold text-blue-900">
                            Total withdrawal Sum:
                          </p>
                          <div className="sm:flex sm:gap-3 sm:items-center mb-4 pb-4 md:mb-2 -mt-2 w-full">
                            <div className="">
                              <p className="form-input rounded-full w-full px-2 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ">
                                {" "}
                                <strong>
                                  {" "}
                                  ₦
                                  {totalAmount
                                    ? toWholeCurrency(totalAmount)
                                    : 0.0}
                                </strong>
                              </p>
                            </div>
                            <div className="">
                              <p className="form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ">
                                {" "}
                                <strong>
                                  GH¢
                                  {totalAmountGHS
                                    ? toWholeCurrency(totalAmountGHS)
                                    : 0.0}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div> */}
                  </div>
                  <Table
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={(record) => record.id}
                    pagination={{
                      current: pageNumber,
                      total: total,
                      onChange: (pageNumber) => {
                        setPageNumber(pageNumber);
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
        </main>
        <ModalBlank
          id="acct-modal"
          modalOpen={modalOpen}
          setModalOpen={(arg) => {
            setSelectedUser(null);
            return setModalOpen(arg);
          }}
          click={() => {
            setModalOpen(false);
            setSelectedUser(null);
            setAction("");
          }}
          title="Take Action on this transaction"
        >
          {selectedUser && (
            <>
              <div className="px-5 py-4">
                <form>
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="amount"
                      >
                        Amount
                      </label>

                      <input
                        className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                        defaultValue={toWholeCurrency(
                          selectedUser?.safeLock?.lockedAmount
                        )}
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="action"
                        className="block text-sm font-medium mb-1 text-blue-900"
                      >
                        Select Action
                      </label>
                      <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          action ? "bg-blue-100" : "bg-transparent"
                        }`}
                      >
                        <option value="">Select an action</option>
                        <option value="completed">Approve</option>
                        <option value="declined">Decline</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-5 py-4 w-full">
                <div className="flex flex-wrap justify-between w-full">
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(false);
                      setSelectedUser(null);
                      setAction("");
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    onClick={() => handleAction(selectedUser.id, action)}
                    disabled={action !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      action
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                    }`}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </>
          )}
        </ModalBlank>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(SafeLockRequests);
