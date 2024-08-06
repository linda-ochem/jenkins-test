import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { connect } from "react-redux";
import { toWholeCurrency } from "../helpers";
import { DatePicker, Table, Tag, message } from "antd";
// import { searchUser } from "../redux/customers/customers.action";

import moment from "moment";
// import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import { fboBalance, updateFBOTransaction } from "../actions";
import ModalBlank from "../partials/actions/ModalBlank";
import { sendGetRequest2 } from "../requests";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "../utils/Utils";

function FboTransactions() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterParams, setFilterParams] = useState({
    forFbo: null,
    trxStatus: "",
    trxType: "",
    trxRef: "",
    search: "",
    userId: "",
    startDate: "",
    endDate: "",
    nairaToUsd: null,
  });
  const [trxRefStatus, setTrxRefStatus] = useState("");
  const [selectedRecord, setSelectedRecord] = useState("");
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fBoBalance, setFBoBalance] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleDateRangeChange = (date, dateString) => {
    setFilterParams({
      ...filterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    console.log(date);
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilterParams({
      ...filterParams,
      [name]: newValue,
    });
  };

  //makes the call to fetch all FBO transactions
  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/fbo-transactions?page=${pageNumber}&page_limit=100${
            queryString ? `&${queryString}` : ""
          }`
          // `/fbio/transactions?page=${pageNumber}&page_limit=100${
          //   queryString ? `&${queryString}` : ""
          // }`
        );
        // console.log(response)
        if (response.data) {
          setLoading(false);
          // console.log(response);
          setDataSource(response.data?.data);
          setTotal(response.data?.pagination?.total);
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
      dataIndex: "userId",
      render: (text, record) => {
        return (
          <div
            style={{ cursor: "pointer", color: "#080675" }}
            onClick={() => handleIdClick(record)}
          >
            {record?.user?.firstName + " " + record?.user?.lastName}
          </div>
        );
      },
      width: 150,
    },
    {
      title: "Routing Number",
      dataIndex: "senderRoutingNumber",
      width: 120,
    },
    {
      title: "Bank Address",
      dataIndex: "bankAddress",
      width: 200,
    },
    {
      title: "Bank City",
      dataIndex: "bankCity",
      width: 120,
    },
    {
      title: "Receiver Account Number",
      dataIndex: "accountNumber",
      width: 200,
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      width: 200,
    },
    {
      title: "Amount",
      dataIndex: "amountInCents",
      render: (amountInCents) => {
        return toWholeCurrency(amountInCents);
      },
      width: 100,
    },
    {
      title: "Charges",
      dataIndex: "charges",
      render: (charges) => {
        return toWholeCurrency(charges);
      },
      width: 90,
    },

    {
      title: "Previous Balance ($)",
      dataIndex: "previousBalance",
      render: (previousBalance) => {
        return toWholeCurrency(previousBalance ? previousBalance : 0);
      },
      width: 100,
    },
    {
      title: "Balance ($)",
      dataIndex: "currentBalance",
      render: (currentBalance) => {
        return toWholeCurrency(currentBalance);
      },
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 180,
    },
    {
      title: "Transaction Reference",
      dataIndex: "trxRef",
      width: 160,
    },
    {
      title: "Transaction Type",
      dataIndex: "trxType",
      width: 150,
    },
    {
      title: "Mode",
      dataIndex: "",
      render: (live) => {
        return live ? "Live" : "Test";
      },
      width: 80,
    },
    {
      title: "Time",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "trxStatus",
      width: 120,
      fixed: "right",
      render: (tag) => {
        let color;
        let text = "N/A"; // Default text for null status

        if (tag) {
          if (tag.includes("PENDING")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("PROCESSING")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("IN-REVIEW")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("COMPLETED")) {
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
    {
      title: "Actions",
      index: "actions",
      fixed: "right",
      render: (text, record) => {
        return (
          <button
            onClick={() => handleRowClick(record)}
            style={{ cursor: "pointer" }}
          >
            Update
          </button>
        );
      },
      width: 120,
    },
  ];

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleSubmit = async (selectedRecord) => {
    const trxRefence = selectedRecord.trxRef;
    const newUserId = selectedRecord.userId;

    try {
      const res = await updateFBOTransaction(
        trxRefence,
        newUserId,
        trxRefStatus
      );
      message.success(res.data.message);
      window.location.reload();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const balanceFetch = async () => {
    try {
      const res = await fboBalance();
      // console.log(res);
      // console.log(res.data.data);
      setFBoBalance(res.data.availableBalance);
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    balanceFetch();
  }, []);

  const handleIdClick = (record) => {
    navigate(`/${record.userId}`);
    // setOpenModal(true);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header
            title="FBO Transactions"
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main>
            {/* Content */}
            <div className="relative">
              <div className="px-4 sm:px-6 py-4 w-full mx-auto">
                {/* <div className="px-4 sm:px-6 py-4 w-full max-w-9xl mx-auto"> */}
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0 w-full">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      {/* {filterParams} */}
                      FBO Transactions
                    </h1>
                  </div>
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <p className="font-bold text-xl">
                      Available Balance: $
                      {fBoBalance ? formatAmount(fBoBalance) : 0}
                    </p>
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
                        name="trxStatus"
                        value={filterParams.trxStatus}
                        onChange={handleFilterChange}
                        className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          filterParams.trxType
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">
                          {filterParams.trxStatus
                            ? filterParams.trxStatus
                            : "Status"}
                        </option>
                        <option value="PENDING"> Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DECLINED">Declined</option>
                        <option value="IN-REVIEW">In-Review</option>
                        <option value="DO_NOT_PROCESS">Do-not-process</option>
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
                          filterParams.currency
                            ? "bg-blue-100"
                            : "bg-transparent"
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

                    {/* Filter by Transaction Type */}
                    {/* <div className="w-[15%]">
                        <label htmlFor="type" className="sr-only">
                          Select Type
                        </label>
                        <select
                          name="type"
                          value={filterParams.type}
                          onChange={handleFilterChange}
                          className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                            filterParams.type ? "bg-blue-100" : "bg-transparent"
                          }`}
                        >
                          <option value="">
                            {filterParams.type
                              ? filterParams.type
                              : "Transaction Type"}
                          </option>
                          <option value="Naira Conversions">
                            Naira Conversions
                          </option>
                        </select>
                      </div> */}
                    <div className="flex flex-wrap items-center -m-3">
                      <div className="m-3">
                        {/* Start */}
                        <label className="flex items-center">
                          <input
                            name="forFbo"
                            value={filterParams.forFbo}
                            type="checkbox"
                            className="form-checkbox w-[2rem] h-[2rem]"
                            onChange={handleFilterChange}
                          />
                          <span className="text-sm ml-2">
                            Five Star Processing
                          </span>
                        </label>
                        {/* End */}
                      </div>
                      <div className="m-3">
                        {/* Start */}
                        <label className="flex items-center">
                          <input
                            name="nairaConversions"
                            value={filterParams.nairaConversions}
                            type="checkbox"
                            className="form-checkbox w-[2rem] h-[2rem]"
                            onChange={handleFilterChange}
                          />
                          <span className="text-sm ml-2">
                            Naira Conversions
                          </span>
                        </label>
                        {/* End */}
                      </div>
                    </div>
                  </div>
                  {/* Table */}
                  <div className="table-auto w-full">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>{" "}
                        Transactions{" "}
                      </h2>
                    </header>
                    <Table
                      loading={loading}
                      columns={columns}
                      dataSource={dataSource}
                      rowKey={(record) => record.id}
                      pagination={{
                        current: pageNumber,
                        total: total,
                        // pageSize: 50,
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
            id="updatefbo-modal"
            modalOpen={open}
            setModalOpen={setOpen}
            click={() => {
              setOpen(false);
              setTrxRefStatus("");
            }}
            title="Update FBO Transaction"
          >
            {/* Modal content */}
            <div className="px-5 py-4">
              <form>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="providusAccountNumber" className="sr-only">
                      Request Status
                    </label>
                    <select
                      value={trxRefStatus}
                      onChange={(e) => setTrxRefStatus(e.target.value)}
                      className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                        trxRefStatus ? "bg-blue-100" : "bg-transparent"
                      }`}
                    >
                      <option value="">Select an option</option>
                      <option value="PENDING"> Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="DECLINED">Declined</option>
                      <option value="IN-REVIEW">In-Review</option>
                      <option value="DO_NOT_PROCESS">Do-not-process</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            {/* Modal footer */}
            <div className="px-5 py-4 w-full">
              <div className="flex flex-wrap justify-between w-full">
                <button
                  className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    setTrxRefStatus("");
                  }}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  onClick={() => handleSubmit(selectedRecord)}
                  disabled={trxRefStatus !== "" ? false : true}
                  className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                    trxRefStatus
                      ? " bg-blue-950 text-white hover:bg-blue-900"
                      : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                  }`}
                >
                  Update Request
                </button>
              </div>
            </div>
          </ModalBlank>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(FboTransactions);
