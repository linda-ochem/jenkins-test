import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import { connect, useDispatch } from "react-redux";
import { Table, Tag, message } from "antd";
import { searchUser } from "../redux/customers/customers.action";
import { getGlobalgeng2 } from "../redux/admin/admin.actions";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { updateGlobalGengCard } from "../actions";
import ModalBlank from "../partials/actions/ModalBlank";
import GGDropdown from "../partials/actions/GGDropdown";
import { UserDetails } from "./UserDetails";
import { EditOutlined } from "@ant-design/icons";

function PhysicalCardWaitlist(props) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cardStatus, setCardStatus] = useState("");
  const [trxnType, setTrxnType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cardTempPin, setCardTempPin] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [physicalCardId, setPhysicalCardId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const dataSource = props.admin?.globalgeng?.data;
  const totalItems = props.admin?.globalgeng?.pagination?.total;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchUser(searchQuery, page));
  };

  const options = [
    {
      id: 0,
      transactionStatus: "PENDING",
    },
    {
      id: 1,
      transactionStatus: "PROCESSING",
    },
    {
      id: 2,
      transactionStatus: "READY-FOR-DELIVERY",
    },
    {
      id: 3,
      transactionStatus: "DELIVERED",
    },
    {
      id: 4,
      transactionStatus: "DISAPPROVED",
    },
  ];

  const handleClick = (newUserId, status) => {
    // e.stopPropagation();
    setNewUserId(newUserId.userId);
    setPhysicalCardId(newUserId.id);
    setCardStatus(status);
    setOpen(true);
  };

  // console.log(dataSource);
  // console.log(newUserId);
  // console.log(physicalCardId);

  //makes the call to fetch all globalgeng cards
  useEffect(() => {
    dispatch(
      getGlobalgeng2(
        pageNumber,
        transactionStatus,
        searchQuery,
        endDate,
        startDate,
        physicalCardId
        // state
        // userId,
        // email
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageNumber,
    transactionStatus,
    searchQuery,
    endDate,
    startDate,
    physicalCardId,
    // state,
    // userId,
    // email,
  ]);

  const goBack = () => {
    navigate(-1);
    // navigate(routes.card_transactions);
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
      dataIndex: "fullName",
      fixed: "left",
      width: 200,
      render: (text, record) => {
        return (
          <div
            onClick={() => handleNameClick(record)}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record.user?.firstName + " " + record.user?.lastName}
          </div>
        );
      },
    },
    {
      title: "Other Name",
      dataIndex: "otherName",
      width: 200,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text, record) => {
        return record.user?.email;
      },
      width: 200,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => {
        if (
          record.user?.phoneNumber === "false" &&
          record.user?.phoneNumberNew
        ) {
          const { code, local } = record.user?.phoneNumberNew;
          return `${code} ${local}`;
        } else {
          return record.user?.phoneNumber;
        }
      },
      width: 200,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 250,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 180,
    },
    {
      title: "City",
      dataIndex: "city",
      width: 150,
    },
    {
      title: "Postal Code",
      dataIndex: "postalCode",
      width: 150,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      width: 200,
    },
    {
      title: "Delivery type",
      dataIndex: "deliveryType",
      width: 150,
    },
    {
      title: "Account Number",
      dataIndex: "providusAccountNumber",
      render: (text, record) => {
        return record.user?.providusAccountNumber
          ? record.user?.providusAccountNumber
          : "N/A";
      },
      width: 150,
    },
    {
      title: "Date requested",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD, HH:mm:ss a").format("lll");
      },
      width: 200,
    },
    {
      title: "Status",
      // fixed: "right",
      dataIndex: "status",
      width: 120,
      render: (tag, record) => {
        const color = tag.includes("DELIVERED")
          ? "#117439"
          : tag.includes("DISAPPROVED")
          ? "#921616"
          : "#f39c0a";
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
    },
  ];

  {
    (props.Role === "super-admin" ||
      props.Role === "fraud-admin" ||
      props.Role === "admin") &&
      columns.push({
        title: "Action ",
        dataIndex: "action",
        render: (text, record) => {
          return (
            <>
              <EditOutlined
                style={{ color: "green", cursor: "pointer" }}
                onClick={() => handleClick(record)}
              />
            </>
          );
        },
        width: 150,
      });
  }

  // const handleNameClick = (user) => {
  //   setSelectedUserId(user?.userId);
  //   // console.log("Selected RowData ::", selectedUserId);
  // };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  const handleUpdate = async () => {
    // e.preventDefault();
    try {
      const res = await updateGlobalGengCard(
        physicalCardId,
        cardStatus,
        cardTempPin
      );
      message.success(res.data.message);
      window.location.reload();
    } catch (error) {
      message.error("Unable to create subscription for this user.");
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
          title="Cards"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-10 w-full mx-auto">
            <div className="relative">
              <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                    GlobalGeng Physical Naira Card Waitlist
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
                        placeholder="Search for user request"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        onSubmit={handleSearch}
                      />
                    </div>
                  </div>
                  {/* Right: filter Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <GGDropdown
                      options={options}
                      selected={options.findIndex(
                        (option) =>
                          option.transactionStatus === transactionStatus
                      )}
                      setSelected={setTransactionStatus}
                      align="right"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <header className="px-5 py-4">
                    <h2 className="font-semibold text-blue-900">
                      Total Requests{" "}
                      <span className="text-slate-400 font-medium">
                        {totalItems?.toLocaleString()}
                      </span>
                    </h2>
                  </header>
                  <Table
                    loading={props.admin?.loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowkey="id"
                    pagination={{
                      current: pageNumber,
                      total: totalItems,
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
              {/* physical card update modal */}
              <ModalBlank
                id="ggcardupdate-modal"
                modalOpen={open}
                setModalOpen={setOpen}
                title="Update Globalgeng Card Status"
                click={() => {
                  setOpen(false);
                  setPhysicalCardId("");
                }}
              >
                {/* Modal content */}
                <div className="px-5 py-4">
                  <form>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="providusAccountNumber"
                          className="sr-only"
                        >
                          Select Type
                        </label>
                        <select
                          value={cardStatus}
                          onChange={(e) => setTrxnType(e.target.value)}
                          className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                            cardStatus ? "bg-blue-100" : "bg-transparent"
                          }`}
                        >
                          <option value="">Select an option</option>
                          <option value="Status Based">Status Based</option>
                          <option value="Temp Pin">Temp Pin</option>
                        </select>
                      </div>
                      {trxnType === "Status Based" && (
                        <div>
                          <label
                            htmlFor="providusAccountNumber"
                            className="sr-only"
                          >
                            Select Status
                          </label>
                          <select
                            value={cardStatus}
                            onChange={(e) => setCardStatus(e.target.value)}
                            className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                              cardStatus ? "bg-blue-100" : "bg-transparent"
                            }`}
                          >
                            <option value="">Select an option</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="READY-FOR-DELIVERY">Ready</option>ß
                            <option value="DELIVERED">Delivered</option>
                            <option value="DISAPPROVED">Disapproved</option>
                            <option value="NOAPPLICATION">
                              No Application
                            </option>
                          </select>
                        </div>
                      )}
                      {cardStatus === "DELIVERED" || trxnType === "Temp Pin" ? (
                        <div>
                          <label
                            className="block text-sm font-medium mb-1 text-blue-900"
                            htmlFor="currentrate"
                          >
                            Temporary Card Pin
                          </label>
                          <input
                            type="text"
                            name="cardTempPin"
                            placeholder="Enter Temporary Pin"
                            value={cardTempPin}
                            onChange={(e) => setCardTempPin(e.target.value)}
                            className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                              cardTempPin ? "bg-blue-100" : "bg-transparent"
                            }`}
                            required
                          />
                        </div>
                      ) : (
                        ""
                      )}
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
                        setPhysicalCardId("");
                      }}
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleUpdate}
                      // disabled={
                      //   cardStatus !== "" || (trxnType !== "" && !cardTempPin) ? false : true
                      // }
                      className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                        cardStatus || (trxnType && cardTempPin)
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

export default connect(mapStateToProps)(PhysicalCardWaitlist);
