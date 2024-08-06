import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { connect } from "react-redux";
import { toWholeCurrency } from "../helpers";
import moment from "moment";
import SingleCardTransactionPanel from "../partials/cardTables/SingleCardTransactionPanel";
import { DatePicker, Spin, Table, Tag, message } from "antd";
import { sendGetRequest2 } from "../requests";
import ModalBlank from "../partials/actions/ModalBlank";
import { generateReportVesti } from "../actions";
import { UserDetails } from "./UserDetails";
import { useNavigate } from "react-router-dom";

function Transactions(props) {
  // console.log(props);
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState({
    status: "",
    currency: "",
    type: "",
    trxRef: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [selectedItems, setSelectedItems] = useState(null);
  const [cardTransactionPanelOpen, setCardTransactionPanelOpen] =
    useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataSource, setDataSource] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [exportFilterParams, setExportFilterParams] = useState({
    currency: "",
    type: "",
    trxRef: "",
    interswitchTransactionReference: "",
    settlementIdFromProvidus: "",
    transactionId: "",
    userId: "",
    status: "",
    endDate: "",
    startDate: "",
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

  const handleDateRangeChange = (date, dateString) => {
    setFilterParams({
      ...filterParams,
      startDate: dateString[0],
      endDate: dateString[1],
    });
    // console.log(date);
    // console.log(dateString)
  };

  const handleDateChange = (event, dateType) => {
    const newDate = event.target.value;
    if (dateType === "start") {
      setStartDate(newDate);
    } else if (dateType === "end") {
      setEndDate(newDate);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilterParams({
      ...filterParams,
      [name]: newValue,
    });
  };

  const handleRowClick = (transaction) => {
    setCardTransactionPanelOpen(true);
    setSelectedItems(transaction);
  };

  const validateCompanyEmail = (email) => {
    const regex = /.*@wevesti.com$/;
    return regex.test(email);
  };

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const Data = {
        email,
        startDate,
        endDate,
        type,
      };
      const response2 = await generateReportVesti(Data);
      // console.log("response2 ::", response2);
      // console.log("response2 ::", response2.data?.message);
      setIsLoading(false);
      message.success(response2.data?.message);
      setReportModalOpen(false);
      setEmail("");
      setEndDate("");
      setType("");
      setStartDate("");
    } catch (error) {
      setIsLoading(false);
      // Handle errors from either API call
      if (error.message) {
        alert(error.message);
      } else alert(error.response.data);
      console.error("Error during API calls:", error);
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
        `/admin/transactions-export?page=${pageNumber}&limit=50${
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

  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key] !== null && filterParams[key] !== "") // Filter out empty and null values
        .map((key) => `${key}=${filterParams[key]}`)
        .join("&");

      try {
        setLoading(true);
        const response = await sendGetRequest2(
          `/admin/transactions?page=${pageNumber}&limit=50${
            queryString ? `&${queryString}` : ""
          }`
        );
        // console.log(response);
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

  useEffect(() => {
    if (location.hash === "#transactions") {
      setFilterParams({ ...filterParams, type: "WITHDRAWAL_FROM_WALLET" });
    }
  }, [location]);

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    console.log(record);
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
      title: "Full Name",
      dataIndex: "full Name",
      render: (text, record) => {
        return (
          <div
            onClick={() => handleNameClick(record)}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record.user.firstName + " " + record.user.lastName}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Username",
      dataIndex: "User Name",
      render: (text, record) => {
        return <div>{record.user.username}</div>;
      },
      width: 200,
    },
    {
      title: "Transaction Type",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "Currency",
      dataIndex: "currency ",
      render: (text, record) => {
        return record.currency?.split("_")[0];
      },
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => {
        return toWholeCurrency(amount);
      },
      width: 100,
    },
    {
      title: "Charges",
      dataIndex: "charges",
      render: (charges) => {
        return toWholeCurrency(charges);
      },
      width: 100,
    },
    {
      title: "Previous Balance",
      dataIndex: "previousBalance",
      render: (previousBalance) => {
        return toWholeCurrency(Number(previousBalance));
      },
      width: 100,
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      render: (currentBalance) => {
        return toWholeCurrency(Number(currentBalance));
      },
      width: 100,
    },
    {
      title: "Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (tag, record) => {
        let color;
        let text = "N/A"; // Default text for null status

        if (tag) {
          if (tag.includes("PENDING")) {
            color = "#f39c0a";
            text = tag;
          } else if (tag.includes("SUCCESS")) {
            color = "#117439";
            text = tag;
          } else {
            color = "#921616";
            text = tag;
          }
        }

        return (
          <Tag
            color={color}
            key={tag}
            style={{ color: "", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(record);
            }}
          >
            {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="mt-10">
            <div className="relative">
              <div className="px-4 sm:px-6 lg:px-2 w-full  mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Transactions
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
                          filterParams.trxType
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                      >
                        <option value="">
                          {filterParams.status ? filterParams.status : "Status"}
                        </option>
                        <option value="SUCCESS">Successful</option>
                        <option value="FAILURE">Failed</option>
                        <option value="PENDING">Pending</option>
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
                    <div className="w-[15%]">
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
                        <option value={"DEPOSIT_TO_WALLET"}>Deposit</option>
                        <option value="WITHDRAWAL_FROM_WALLET">
                          Withdrawal
                        </option>
                        <option value="CARD_DEPOSIT">Card Deposit</option>
                        <option value="DEPOSIT_TO_CARD">Deposit To Card</option>
                        <option value="DEBIT_FROM_CARD">
                          Withdrawal From Card
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Table */}
                  <div>
                    <div>
                      {/* Table */}
                      <div className="overflow-x-auto">
                        <header className="px-5 py-4">
                          <h2 className="font-semibold text-blue-900">
                            Transactions{" "}
                            <span className="text-slate-400 font-medium">
                              {total?.toLocaleString()}
                            </span>
                          </h2>
                        </header>
                        <div className="table-auto w-full">
                          <Table
                            loading={loading}
                            columns={columns}
                            dataSource={dataSource}
                            rowKey={(record) => record.id}
                            pagination={{
                              current: pageNumber,
                              total: total,
                              pageSize: 50,
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
                </div>
              </div>
            </div>
          </div>
          {/* export filter */}
          <ModalBlank
            id="report-modal"
            modalOpen={exportModalOpen}
            setModalOpen={setExportModalOpen}
            click={() => {
              setExportModalOpen(false);
              setExportFilterParams({
                currency: "",
                type: "",
                trxRef: "",
                interswitchTransactionReference: "",
                settlementIdFromProvidus: "",
                transactionId: "",
                userId: "",
                status: "",
                endDate: "",
                startDate: "",
              });
            }}
            title="Export Filter"
          >
            {/* Modal content */}
            <div className="px-5 py-4">
              <form>
                <div className="space-y-3">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full gap-4 ">
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" flex justify-start gap-8 items-center ">
                        <div className="w-1/4">
                          <label
                            className="block text-sm font-medium mb-1 text-blue-900"
                            htmlFor="interswitchTransactionReference"
                          >
                            Interswitch Reference
                          </label>

                          <input
                            type="checkbox"
                            name="interswitchTransactionReference"
                            className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                            value={
                              exportFilterParams.interswitchTransactionReference
                            }
                            onChange={handleExportFilterChange}
                          />
                        </div>
                        <div className="w-1/4">
                          <label
                            className="block text-sm font-medium mb-1 text-blue-900"
                            htmlFor="ProvidussettlementId"
                          >
                            Providus SettlementId
                          </label>

                          <input
                            type="checkbox"
                            name="settlementIdFromProvidus"
                            className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                            value={exportFilterParams.settlementIdFromProvidus}
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
                          name="type"
                          value={exportFilterParams.type}
                          onChange={handleExportFilterChange}
                          className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                            exportFilterParams.type
                              ? "bg-blue-100"
                              : "bg-transparent"
                          }`}
                        >
                          <option value="">
                            {exportFilterParams.type
                              ? exportFilterParams.type
                              : "Type"}
                          </option>
                          <option value={"DEPOSIT_TO_WALLET"}>Deposit</option>
                          <option value="WITHDRAWAL_FROM_WALLET">
                            Withdrawal
                          </option>
                          <option value="CARD_DEPOSIT">Card Deposit</option>
                          <option value="DEPOSIT_TO_CARD">
                            Deposit To Card
                          </option>
                          <option value="DEBIT_FROM_CARD">
                            Withdrawal From Card
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full gap-4 ">
                    {/* Left: Searchbar */}

                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <label htmlFor="Currency" className="sr-only">
                          Select Type
                        </label>
                        <select
                          name="currency"
                          value={filterParams.currency}
                          onChange={handleExportFilterChange}
                          className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                            exportFilterParams.currency
                              ? "bg-blue-100"
                              : "bg-transparent"
                          }`}
                        >
                          <option value="">
                            {exportFilterParams.currency
                              ? exportFilterParams.currency
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
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <label htmlFor="Currency" className="sr-only">
                          Select Type
                        </label>
                        <select
                          name="status"
                          value={filterParams.status}
                          onChange={handleExportFilterChange}
                          className={`form-input rounded-full w-full px-2 py-1 h-9 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                            exportFilterParams.status
                              ? "bg-blue-100"
                              : "bg-transparent"
                          }`}
                        >
                          <option value="">
                            {exportFilterParams.status
                              ? exportFilterParams.status
                              : "Status"}
                          </option>
                          <option value="PENDING">Pending </option>
                          <option value="SUCCESS">Successful </option>
                          <option value="PROCESSING">Processing </option>
                          <option value="FAILURE">Failed </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between gap-4 items-center">
                    <div className="w-1/2">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="rate"
                      >
                        User ID
                      </label>

                      <input
                        type="text"
                        className="form-textarea w-full px-2 py-1 h-9 border border-blue-950  text-blue-900"
                        value={exportFilterParams.userId}
                        onChange={handleExportFilterChange}
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="rate"
                      >
                        Safelock ID
                      </label>

                      <input
                        type="text"
                        className="form-textarea w-full px-2 py-1 h-9 border border-blue-950  text-blue-900"
                        value={exportFilterParams.safeLockId}
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
                          currency: "",
                          type: "",
                          trxRef: "",
                          interswitchTransactionReference: "",
                          settlementIdFromProvidus: "",
                          transactionId: "",
                          userId: "",
                          status: "",
                          endDate: "",
                          startDate: "",
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
        </main>
      </div>
      {selectedItems && (
        <SingleCardTransactionPanel
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          cardTransactionPanelOpen={cardTransactionPanelOpen}
          setCardTransactionPanelOpen={setCardTransactionPanelOpen}
        />
      )}
      <ModalBlank
        id="report-modal"
        modalOpen={reportModalOpen}
        setModalOpen={setReportModalOpen}
        click={() => {
          setReportModalOpen(false);
          setEmail("");
          setEndDate("");
          setType("");
          setStartDate("");
        }}
        title="Download Report"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="type"
                >
                  Select Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value=" ">Select transaction type</option>
                  <option value="DEPOSIT_TO_WALLET">Deposit</option>
                  <option value="WITHDRAWAL_FROM_WALLET">Withdrawal</option>
                  <option value="CARD_DEPOSIT">Card Deposit</option>
                  <option value="DEPOSIT_TO_CARD">Deposit To Card</option>
                  <option value="DEBIT_FROM_CARD">Withdrawal From Card</option>
                  <option value="SUCCESS">Successful</option>
                  <option value="FAILURE">Failed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="email"
                >
                  Email
                </label>

                <input
                  type="email"
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* start Date */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-blue-900 py-2"
                htmlFor="startdate"
              >
                Start Date
              </label>

              <input
                type="date"
                className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                value={startDate}
                onChange={(event) => handleDateChange(event, "start")}
                required
              />
            </div>
            {/* end date */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-blue-900 py-2"
                htmlFor="enddate"
              >
                End Date
              </label>

              <input
                type="date"
                className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                value={endDate}
                onChange={(event) => handleDateChange(event, "end")}
                required
              />
            </div>
          </form>
        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 w-full">
          <div className="flex flex-wrap justify-between w-full">
            {isLoading ? (
              <div className="flex items-center justify-center mx-auto">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <button
                  className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportModalOpen(false);
                    setEmail("");
                    setEndDate("");
                    setType("");
                    setStartDate("");
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    if (!validateCompanyEmail(email)) {
                      alert("Invalid email address. Must end with wevesti.com");
                    } else {
                      fetchReport();
                    }
                  }}
                  disabled={
                    email !== "" ||
                    startDate !== "" ||
                    endDate !== "" ||
                    type !== ""
                      ? false
                      : true
                  }
                  className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                    email && startDate && endDate && type
                      ? " bg-blue-900 text-white hover:bg-blue-950"
                      : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                  }`}
                >
                  {isLoading ? "working please wait..." : "Download"}
                </button>
              </>
            )}
          </div>
        </div>
      </ModalBlank>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps)(Transactions);
