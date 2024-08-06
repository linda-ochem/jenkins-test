import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { connect, useDispatch } from "react-redux";
import { Table, Dropdown, Modal, Progress, Tooltip, message } from "antd";
import { getAllSTVRequests } from "../redux/admin/admin.actions";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SearchForm from "../partials/actions/SearchForm";
import { PetitionCard } from "../partials/adminDashboard/adminAnalytics/PetitionCard";
import success from "../images/successicon.svg";
import {
  AdminUpdateVisaPaymentStatus,
  bulkPaymentReminder,
  getFileVisaAnalytics,
  getVisaTypes,
  selectedPaymentReminder,
  singlePaymentReminder,
} from "../actions";
import { formatAmount, replaceUnderscoreWithSpace } from "../utils/Utils";
import { toWholeCurrency } from "../helpers";

function STVHome(props) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState("");
  const [visaType, setVisaType] = useState("");
  const [allVisaTypes, setAllVisaTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRecord, setModalRecord] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    fullname: "",
    email: "",
    visaType: "",
    amountPaid: "",
    invoiceAmount: "",
    currency: "USD",
  });

  const dataSource = props.admin?.stv?.data?.data?.data;
  const total = props.admin?.stv?.data?.data?.pagination.total;

  useEffect(() => {
    const fetchVisaTypes = async () => {
      setLoading(true);
      try {
        const response = await getVisaTypes();
        // console.log("VisaTypess: ", response);
        setAllVisaTypes(response.data?.priceLists);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error(
          "Sorry, Couldn't fetch file categories. Pls Try again later"
        );
      }
    };

    fetchVisaTypes();
  }, []);

  const visaOptions = allVisaTypes
    .filter((item) => item.type === "F-1" || item.type === "B-1/B-2")
    .map((item) => {
      return {
        label: item.name,
        value: item.type,
      };
    });

  const PaymentStatusOptions = [
    {
      label: "Paid",
      value: "PAID",
    },
    {
      label: "Pending",
      value: "PENDING",
    },
    {
      label: "Unpaid",
      value: "UNPAID",
    },
  ];
  const ReviewStatusOptions = [
    {
      label: "Submitted",
      value: "SUBMITTED",
    },
    {
      label: "Not Submitted",
      value: "NOT_SUBMITTED",
    },
    {
      label: "Awaiting Review",
      value: "AWAITING_REVIEW",
    },
    {
      label: "Reviewed",
      value: "REVIEWED",
    },
  ];

  // console.log(visaOptions);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const openModalWithRecord = (record) => {
    setModalRecord(record);
    setIsModalOpen(true);
  };

  const closeModalWithRecord = () => {
    setModalRecord(null);
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const handleViewFiles = async (record) => {
    navigate(`/pathways/files/${record.userId}`);
  };

  const handleNameClick = (record) => {
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await getFileVisaAnalytics();
      // console.log("Analytics: ", response.data);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Sorry, Couldn't fetch file categories. Pls Try again later"
      );
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    dispatch(
      getAllSTVRequests(
        pageNumber,
        visaType,
        status,
        searchTerm,
        paymentStatus,
        reviewStatus
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, visaType, searchTerm, status, paymentStatus, reviewStatus]);

  const columns = [
    {
      title: "Name",
      dataIndex: "fullname",
      width: 150,
      render: (text, record) => {
        return (
          <div
            onClick={() => {
              handleNameClick(record);
            }}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record.fullname}
          </div>
        );
      },
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Visa Type",
      dataIndex: "visaType",
      width: 90,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      width: 95,
    },
    {
      title: "Amount",
      render: (text, record) => {
        return toWholeCurrency(record?.amount !== "0" ? record.amount : 0);
      },
      width: 100,
    },
    {
      title: "Amount Paid",
      render: (text, record) => {
        return toWholeCurrency(
          record?.amountPaid !== "0" ? record?.amountPaid : 0
        );
      },
      width: 100,
    },
    {
      title: "Amount Remaining",
      render: (text, record) => {
        return toWholeCurrency(
          record?.amountRemaining !== "0" ? record?.amountRemaining : 0
        );
      },
      width: 103,
    },
    {
      title: "Upload Percentage",
      render: (text, record) => {
        const percent = record.fileUploadPercentage;
        let statusColor;
        if (percent >= 70) {
          statusColor = "#52c41a"; // You can customize colors based on your preference
        } else if (percent <= 40) {
          statusColor = "red";
        } else {
          statusColor = "#faad14";
        }
        return (
          <Progress
            percent={percent}
            status={statusColor}
            strokeColor={statusColor}
            format={() => `${percent}%`}
          />
        );
      },
      width: 120,
    },
    {
      title: "Payment Status",
      render: (text, record) => {
        const percent = record.paymentPercent;
        const paymentStatus = record.paymentStatus;

        return (
          <div className="">
            <DotIndicator percent={percent} />
            {percent}% {paymentStatus}
          </div>
        );
      },
      width: 150,
    },
    {
      title: "Start Date",
      dataIndex: "reviewStatus",
      render: (text, record) => {
        return moment(record?.createdAt).format("lll");
      },
      width: 180,
    },
    {
      title: "Completion Date",
      dataIndex: "completionDate",
      render: (text, record) => {
        return moment(record?.updatedAt).format("lll");
      },
      width: 180,
    },
    {
      title: "Review Status",
      dataIndex: "reviewStatus",
      render: (text, record) => {
        const status = replaceUnderscoreWithSpace(record?.reviewStatus);

        return (
          <div className="">
            <DotIndicator2 status={status} />
            {status}
          </div>
        );
      },
      width: 180,
    },

    (props.Role === "legal-officer" ||
      props.Role === "super-admin" ||
      (props.Role === "admin" &&
        (props.auth?.user?.data?.data?.email === "fisolawevesti.com" ||
          props.auth?.user?.data?.data?.email === "austin@wevesti.com"))) && {
      title: "Actions",
      width: 90,
      fixed: "right",
      key: "actions",
      render: (text, record) => {
        return (
          <Dropdown
            menu={{
              items: items.map((item) => ({
                ...item,
                onClick: () => item.onClick(record),
              })),
            }}
            trigger={["hover"]}
            placement="bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#000000"
              viewBox="0 0 256 256"
              style={{ cursor: "pointer" }}
            >
              <path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"></path>
            </svg>
          </Dropdown>
        );
      },
    },
  ].filter(Boolean);

  const items = [
    // {
    //   label: "Review Request",
    //   key: "review",
    //   onClick: (record) => {
    //     openModalWithRecord(record);
    //     handleReview(record);
    //   },
    // },

    {
      label: "View Files",
      key: "view files",
      onClick: (record) => {
        handleViewFiles(record);
      },
    },
    {
      label: "Send Payment Invoice",
      key: "invoice",
      onClick: (record) => {
        handleSendSingleReminder(record);
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleReview = async (record) => {
    // console.log(record);
    try {
      const res = await AdminUpdateVisaPaymentStatus(record);
      // console.log(res);
      message.success(res.data?.message);
    } catch (error) {
      message.error(`${error}`);
    }
  };

  var formatRecordAmount = (value) => {
    value = value.replace(/[^\d]/g, "");
    value = Number(value).toLocaleString();
    return value;
  };

  const setInputs = (e) => {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "amount" || name === "invoiceAmount") {
      value = formatRecordAmount(value);
    }

    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleNewRecord = async () => {
    const formData = new FormData();
    formData.append("email", newRecord.email);
    formData.append("fullname", newRecord.fullname);
    formData.append("amount", newRecord.invoiceAmount);
    formData.append("amountPaid", newRecord.amountPaid);
    formData.append("visaType", newRecord.visaType);
    formData.append("currency", newRecord.currency);
    Modal.confirm({
      title: `Are you sure you want to add a record ${fullname}?`,
      onOk: async () => {
        try {
          await updateVisaFile(formData);
          message.success("Record added successfully");
          setTimeout(() => {
            setIsOpen(false);
            window.location.reload();
          }, 1000);
        } catch (error) {
          // message.error(`${error}`);
          message.error("Could not add record ");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will add new record ",
      okButtonProps: {
        style: {
          background: "#120669",
          color: "white",
        },
      },
      cancelButtonProps: {
        style: {
          background: "#4f0805",
          color: "white",
        },
      },
    });
  };

  const handleSendReminder = async () => {
    const data = {
      formIds: selectedRowKeys,
    };
    // console.log("handleSendReminder formIds:", data);
    Modal.confirm({
      title:
        "Are you sure you want to send payment reminders to selected users?",
      onOk: async () => {
        try {
          await selectedPaymentReminder(data);
          message.success("Payment reminder has been sent successfully");
          setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
          }, 1000);
        } catch (error) {
          // message.error(`${error}`);
          message.error("Could not send Payment reminder ");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will send payment invoices ",
    });
  };

  const handleSendSingleReminder = async (record) => {
    const formId = record.id;
    // console.log("handleSendSingleReminder formId:", formId);
    Modal.confirm({
      title: "Are you sure you want to send payment invoice?",
      onOk: async () => {
        try {
          await singlePaymentReminder(formId);
          // console.log(res);
          message.success("Payment reminder has been sent successfully");
        } catch (error) {
          // message.error(`${error}`);
          message.error("Could not send Payment reminder ");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will send payment invoices ",
    });
  };

  const handleSendBulkReminder = async () => {
    Modal.confirm({
      title: "Are you sure you want to send bulk payment invoice?",
      onOk: async () => {
        try {
          await bulkPaymentReminder();
          // console.log(res);
          message.success("Payment reminder has been sent successfully");
        } catch (error) {
          message.error("Could not send bulk payment invoices ");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will send bulk payment invoices ",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="STV Payments"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-4 w-full  mx-auto">
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/*  (Metrics card) */}
              <PetitionCard
                title="Total Revenue"
                amount={
                  analytics ? formatAmount(analytics?.totalRevenue, 2, 3) : 0
                }
              />
              <PetitionCard
                title="Weekly Revenue"
                amount={
                  analytics ? formatAmount(analytics?.weeklyRevenue, 2, 3) : 0
                }
              />
              <PetitionCard
                title="Monthly Revenue"
                amount={
                  analytics ? formatAmount(analytics?.monthlyRevenue, 2, 3) : 0
                }
              />
              <PetitionCard
                title="Quarterly Revenue"
                amount={
                  analytics
                    ? formatAmount(analytics?.quarterlyRevenue, 2, 3)
                    : 0
                }
              />
            </div>

            {/* Content */}
            <div className="">
              <div className="relative">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0 py-4">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Transactions
                    </h1>
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for user "
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                        />
                      </div>
                    </div>
                    <div className="grid grid-flow-col w-[80%] sm:auto-cols-max justify-start sm:justify-end gap-2">
                      <div className="grid grid-flow-col sm:auto-cols-max justify-between sm:justify-end gap-2">
                        <div className="w-[10rem]">
                          <button
                            className=" border-blue-600 h-10 w-full flex justify-center p-3 rounded-md items-center bg-blue-950 text-white hover:bg-blue-900"
                            onClick={() => setIsOpen(true)}
                          >
                            New Record
                          </button>
                        </div>
                        {hasSelected ? (
                          <button
                            className="text-white bg-blue-900 rounded-lg border border-white flex justify-between items-center gap-4 text-[16px] h-10 px-5 "
                            onClick={handleSendReminder}
                          >
                            Send Payment Invoice to {selectedRowKeys?.length}{" "}
                            {selectedRowKeys?.length > 1 ? "users" : "user"}
                          </button>
                        ) : (
                          <button
                            className="bg-transparent rounded-lg border border-blue-950 bg-[#e9eaee] flex justify-between items-center gap-4 text-[16px] h-10 px-5 "
                            onClick={handleSendBulkReminder}
                          >
                            <span className="text-blue-950">
                              Send Payment Invoice
                            </span>
                          </button>
                        )}
                      </div>
                      <div className="w-[8rem]">
                        <label
                          className="block text-sm font-medium mb-1 sr-only"
                          htmlFor="status"
                        >
                          Visa Type
                        </label>
                        <select
                          value={visaType}
                          onChange={(e) => setVisaType(e.target.value)}
                          className="form-select bg-slate-300 h-10 w-full px-2 py-1 focus:outline-transparent focus:ring-2 focus:border-none focus:border-transparent rounded-md border-none hover:border-none "
                        >
                          <option value="">Visa Type</option>
                          {visaOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-[10rem]">
                        <label
                          className="block text-sm font-medium mb-1 sr-only"
                          htmlFor="status"
                        >
                          Payment Status
                        </label>
                        <select
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                          className="form-select bg-slate-300 h-10 w-full px-2 py-1 focus:outline-transparent focus:ring-2 focus:border-none focus:border-transparent rounded-md border-none hover:border-none "
                        >
                          <option value="">Payment Status</option>
                          {PaymentStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-[9rem]">
                        <label
                          className="block text-sm font-medium mb-1 sr-only"
                          htmlFor="status"
                        >
                          Review Status
                        </label>
                        <select
                          value={reviewStatus}
                          onChange={(e) => setReviewStatus(e.target.value)}
                          className="form-select bg-slate-300 h-10 w-full px-2 py-1 focus:outline-transparent focus:ring-2 focus:border-none focus:border-transparent rounded-md border-none hover:border-none "
                        >
                          <option value="">Review Status</option>
                          {ReviewStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-auto w-full">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Transactions{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
                      </h2>
                    </header>
                    <Table
                      loading={props.admin.loading}
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={dataSource}
                      rowKey={(records) => records.id}
                      pagination={{
                        current: pageNumber,
                        total: total,
                        pageSize: 50,
                        onChange: (page) => {
                          setPageNumber(page);
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

        {/* update modal */}
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={closeModalWithRecord}
          footer=""
        >
          <div className="flex flex-col justify-center items-center w-full">
            <p className="text-blue-950 text-sm font-semibold mb-1">
              Are you sure?
            </p>
            <p className="text-blue-950 text-sm font-normal mb-1">
              Do you want to update
              {modalRecord?.firstName + " " + modalRecord?.lastName}'s review
              status?
            </p>
            <div className="w-full flex justify-center items-center mt-4">
              <button
                onClick={() => {
                  // handleReview();
                  setOpen(true);
                  setIsModalOpen(false);
                }}
                className="btn-sm border-blue-600 h-12 w-1/2 flex flex-col  bg-blue-950 text-white hover:bg-blue-900"
              >
                Yes, update.
              </button>
            </div>
          </div>
        </Modal>

        {/* new record modal */}
        <Modal
          open={isOpen}
          onOk={handleNewRecord}
          onCancel={() => setIsOpen(false)}
          footer=""
        >
          <div className="flex flex-col justify-center items-center w-full">
            <p className="w-full flex justify-start items-center mt-4 text-blue-900 font-bold text-2xl">
              Create New Record
            </p>

            <form className="w-full space-y-3">
              <div className="w-full flex flex-col justify-center gap-4 items-center">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="userid"
                  >
                    Fullname
                  </label>

                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter fullname"
                    className="form-textarea w-full px-2 py-1 h-10 border border-blue-950  text-blue-900"
                    value={newRecord?.fullname}
                    onChange={setInputs}
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="userid"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter fullname"
                    className="form-textarea w-full px-2 py-1 h-10 border border-blue-950  text-blue-900"
                    value={newRecord?.email}
                    onChange={setInputs}
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="status"
                  >
                    Visa Type
                  </label>
                  <select
                    value={newRecord?.visaType}
                    name="visaType"
                    onChange={setInputs}
                    className="form-select border border-blue-950  text-blue-900 h-10 w-full px-2 py-1 focus:outline-transparent focus:ring-2 focus:border-0 focus:border-transparent rounded-md"
                  >
                    <option value="">Visa Type</option>
                    {visaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="email"
                  >
                    Invoice Amount
                  </label>

                  <input
                    type="text"
                    name="invoiceAmount"
                    placeholder="Enter Invoice Amount"
                    className="form-textarea w-full h-10 px-2 py-1 border border-blue-950  text-blue-900"
                    value={newRecord?.invoiceAmount}
                    onChange={setInputs}
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="email"
                  >
                    Amount Paid
                  </label>

                  <input
                    type="text"
                    name="amount"
                    placeholder="Enter email"
                    className="form-textarea w-full h-10 px-2 py-1 border border-blue-950  text-blue-900"
                    value={newRecord?.amount}
                    onChange={setInputs}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="w-full flex justify-start items-center mt-8">
            <button
              onClick={() => {
                handleNewRecord();
              }}
              disabled={
                newRecord?.fullname !== "" ||
                newRecord?.email !== "" ||
                newRecord?.invoiceAmount !== "" ||
                newRecord?.amount !== "" ||
                newRecord?.visaType !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                newRecord?.fullname &&
                newRecord?.email &&
                newRecord?.invoiceAmount &&
                newRecord?.visaType &&
                newRecord?.amount
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col  my-auto"
              }`}
            >
              Yes, Add Record.
            </button>
          </div>
        </Modal>

        {/* success modal */}
        <Modal
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer=""
          closable={false}
          maskClosable={false}
        >
          <div className="flex flex-col justify-center items-center w-full">
            <img src={success} alt="success icon" />
            <p className="text-blue-950 text-sm font-semibold mb-1">
              Successfully Updated
            </p>
            <p className="text-blue-950 text-sm font-normal mb-1">
              You have successfully uploaded a document for{" "}
              {/* {user?.firstName + " " + user?.lastName} */}
            </p>
            <div className="w-full flex justify-center items-center mt-4">
              <button
                onClick={() => {
                  window.location.reload();
                  setIsModalOpen(false);
                }}
                className="btn-sm border-blue-600 h-12 w-1/2 flex flex-col  bg-blue-950 text-white hover:bg-blue-900"
              >
                Okay, Thank you.
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

const DotIndicator = ({ percent }) => {
  let colorClass;
  if (percent >= 80) {
    colorClass = "bg-green-500";
  } else if (percent >= 50) {
    colorClass = "bg-yellow-500";
  } else {
    colorClass = "bg-red-500";
  }

  return (
    <Tooltip title={`${percent}%`}>
      <span
        className={`h-3 w-3 rounded-full inline-block mr-1 ${colorClass}`}
      />
    </Tooltip>
  );
};

const DotIndicator2 = ({ status }) => {
  let colorClass;
  if (status === "COMPLETED") {
    colorClass = "bg-green-500";
  } else if (status === "IN_PROGRESS") {
    colorClass = "bg-yellow-500";
  } else {
    colorClass = "bg-red-500";
  }

  return (
    <Tooltip title={`${status}%`}>
      <span
        className={`h-3 w-3 rounded-full inline-block mr-1 ${colorClass}`}
      />
    </Tooltip>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(STVHome);
