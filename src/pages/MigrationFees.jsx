import React, { useEffect, useState } from "react";

import SearchForm from "../partials/actions/SearchForm";
import { connect, useDispatch } from "react-redux";
import { toWholeCurrency } from "../helpers";
import { Table, Tag, message } from "antd";
import { searchUser } from "../redux/customers/customers.action";
import moment from "moment";
import {
  adminRecordMerchantTransaction,
  adminStartSubscription,
  getMerchantPayments,
} from "../actions";
import ModalBlank from "../partials/actions/ModalBlank";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useNavigate } from "react-router-dom";

function MigrationFees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState("");
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [frequency, setFrequency] = useState("");
  const [walletToCharge, setWalletToCharge] = useState("");
  const [merchantType, setMerchantType] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchUser(searchTerm, pageNumber));
  };

  const fetchMigrationFeeTransaction = async () => {
    try {
      setLoading(true);
      const response1 = await getMerchantPayments(pageNumber);
      // console.log(response1);
      setDataSource(response1.data?.data);
      setTotal(response1.data?.pagination.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrationFeeTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const handleNameClick = (record) => {
    navigate(`/${record?.userId}`, {
      state: { user: record },
    });
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 70,
    },
    {
      title: "User Name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <div
            onClick={() => {
              handleNameClick(record);
            }}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record.user?.firstName + " " + record.user?.lastName}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "User Email",
      dataIndex: "email",
      render: (text, record) => {
        return record.user?.email;
      },
      width: 200,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency",
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
      width: 120,
    },
    {
      title: "Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.updatedAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (tag) => {
        const color = tag.includes("PENDING")
          ? "#f39c0a"
          : tag.includes("SUCCESS")
          ? "#117439"
          : "#921616";
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
    },
  ];

  const handleSub = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminStartSubscription({
        frequency,
        plan,
        walletToCharge,
        email,
      });
      message.success(data.message);
      window.location.reload();
    } catch (error) {
      message.error("Unable to create subscription for this user.");
    }
  };

  const handleMerchantRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminRecordMerchantTransaction({
        amount,
        type: merchantType,
        currency: walletToCharge,
        email,
      });
      message.success(data.message);
      setRecordModalOpen(false);
      window.location.reload();
    } catch (error) {
      setAlertMessage(error.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          title="Migration Fees"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main>
          {/* Content */}
          <div className="mt-10">
            <div className="relative">
              <div className="px-4 sm:px-6 lg:px-2 w-full mx-auto">
                {/* <div className="px-4 sm:px-6 lg:px-2 w-full max-w-9xl mx-auto"> */}
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Migration Fees Payment
                    </h1>
                  </div>
                </div>
                <div className="sm:flex sm:justify-end sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                  <div className=" sm:block flex flex-wrap items-center -m-1.5">
                    <div className="m-1.5">
                      <button
                        className="btn border-slate-200 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer"
                        onClick={() => setSubModalOpen(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-slate-500 shrink-0 hover:text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hover:text-white"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        <span className="ml-2">Subscribe a user</span>
                      </button>
                    </div>
                    <div className="m-1.5">
                      <button
                        className="btn border-slate-200 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer"
                        onClick={() => setRecordModalOpen(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-slate-500 shrink-0 hover:text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        <span className="ml-2">Record a migration payment</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                    {/* Left: Searchbar */}
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for user transaction"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                          onSubmit={handleSearch}
                        />
                      </div>
                    </div>

                    {/* Right: filter Actions */}
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                      {/* <DropdownFull
                          options={options}
                          align="right"
                        /> */}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Migration Fee Transactions{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
                      </h2>
                    </header>

                    {/* Table */}
                    <div className="table-auto w-full">
                      <Table
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        rowkey="id"
                        pagination={{
                          current: pageNumber,
                          pageSize: 10,
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
            </div>
          </div>
        </main>
      </div>
      {/* sub modal */}
      <ModalBlank
        id="sub-modal"
        modalOpen={subModalOpen}
        setModalOpen={setSubModalOpen}
        click={() => {
          setSubModalOpen(false);
          setEmail("");
          setPlan("");
          setFrequency("");
          setWalletToCharge("");
        }}
        title="Subscription Setup"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    email ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              <div>
                <label htmlFor="providusAccountNumber" className="sr-only">
                  Select Subscription Plan
                </label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  // className="rounded w-full mb-3 focus:outline-none"
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    plan ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value=" ">Select an option</option>
                  <option value="BASIC_USER">Economy Class</option>
                  <option value="EXCLUSIVE_USER">Business Class</option>
                  <option value="PLATINUM_USER">First Class</option>
                </select>
              </div>
              <div>
                <label htmlFor="providusAccountNumber" className="sr-only">
                  Select Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  // className="rounded w-full mb-3"
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    frequency ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value=" ">Select an option</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly </option>
                </select>
              </div>
              <div>
                <label htmlFor="walletToCharge" className="sr-only">
                  Select Wallet To Be Charged
                </label>
                <select
                  value={walletToCharge}
                  onChange={(e) => setWalletToCharge(e.target.value)}
                  // className="rounded w-full"
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    walletToCharge ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value=" ">Select an option</option>
                  <option value="NGN_KOBO">Naira Wallet</option>
                  <option value="USD_CENTS">USD Wallet</option>
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
                setSubModalOpen(false);
                setEmail("");
                setPlan("");
                setFrequency("");
                setWalletToCharge("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleSub}
              disabled={
                email !== "" &&
                frequency !== "" &&
                plan !== "" &&
                walletToCharge !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                email && frequency && walletToCharge && plan
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Subscribe User
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* rec modal */}
      <ModalBlank
        id="record-modal"
        modalOpen={recordModalOpen}
        setModalOpen={setRecordModalOpen}
        click={() => {
          setRecordModalOpen(false);
          setEmail("");
          setAmount("");
          setMerchantType("");
          setCurrency("");
        }}
        title="Record Migration Payment"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    email ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              <div>
                <label htmlFor="providusAccountNumber" className="sr-only">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    amount ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              <div>
                <label htmlFor="providusAccountNumber" className="sr-only">
                  Select Type
                </label>
                <select
                  value={merchantType}
                  onChange={(e) => setMerchantType(e.target.value)}
                  // className="rounded w-full mb-3"
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    merchantType ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="WES">WES</option>
                  <option value="WESEXPEDITED">WES Expedited</option>
                  <option value="UKSTUDENTVISA">UK Student VISA</option>
                  <option value="PRIORITY">Priority</option>
                  <option value="IHSUK">IHSUK</option>
                  <option value="USVISADS160">US VISA ADS 160</option>
                  <option value="APPLICATIONFEES">Application Fees</option>
                  <option value="TUITIONFEES">Tuition Fees</option>
                  <option value="NMCUK">NMCUK</option>
                  <option value="WESECA">WESECA</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TEF">TEF</option>
                  <option value="UKSKILLEDWORKERVISA">
                    UK Silled Worker VISA
                  </option>
                  <option value="EDUCATIONPATHWAY">Education Pathway</option>
                </select>
              </div>

              <div>
                <label htmlFor="currency" className="sr-only">
                  Select Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  // className="rounded w-full"
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    currency ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="NGN_KOBO">Naira</option>
                  <option value="USD_CENTS">USD</option>
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
                setRecordModalOpen(false);
                setEmail("");
                setAmount("");
                setMerchantType("");
                setCurrency("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleMerchantRecordSubmit}
              disabled={
                email !== "" &&
                amount !== "" &&
                currency !== "" &&
                merchantType !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                email && amount && currency && merchantType
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Record Transaction
            </button>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MigrationFees);
