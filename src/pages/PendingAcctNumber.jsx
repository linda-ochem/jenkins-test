import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
// import SearchForm from "../partials/actions/SearchForm";
// import Pagination from "../components/PaginationDisplay";
import { connect, useDispatch } from "react-redux";
import routes from "../routes";
import { Modal, Table, message } from "antd";
// import { searchUser } from "../redux/customers/customers.action";
import { getAllPendingAcctRequest } from "../redux/admin/admin.actions";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ModalBlank from "../partials/actions/ModalBlank";
import { ExclamationCircleFilled, EditOutlined } from "@ant-design/icons";
import { assignProvidusAccountNumber } from "../actions";
import SearchForm from "../partials/actions/SearchForm";

function PendingAcctNumber(props) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [acctNumberModalOpen, setAcctNumberModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providusAccountNumber, setProvidusAccountNumber] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState("");
  const [newStatus, setNewStatus] = useState("pending");

  const dataSource = props.admin?.pendingacctreq?.data.data;
  const total = props.admin?.pendingacctreq?.data?.pagination.total;
  const navigate = useNavigate();

  const handleRowClick = (user) => {
    setAcctNumberModalOpen(true);
    setSelectedUser(user);
  };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/${record.userId}`, {
      state: { user: record },
    });
  };

  //makes the call to fetch all pending acct requests
  useEffect(() => {
    dispatch(getAllPendingAcctRequest(pageNumber, newStatus, searchTerm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, newStatus, searchTerm]);

  const handleAcctNumberForm = (requestId, accountNumber, email) => {
    Modal.confirm({
      title:
        "Are you sure you want to assign a providus account number to this user?",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await assignProvidusAccountNumber(
            requestId,
            accountNumber,
            status
          );
          console.log(res);
          if (res.data) {
            message.success(`${res.data.message} to ${email}`);
            setLoading(false);
            setAcctNumberModalOpen(false);
            dispatch(getAllPendingAcctRequest(pageNumber, newStatus));
            setSelectedUser(null);
            setProvidusAccountNumber("");
            setStatus("pending");
          }
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
      content:
        "If you continue you will assign a providus account number to this user",
    });
  };

  const goBack = () => {
    navigate(routes.user_updates);
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
      title: "Name",
      dataIndex: "name",
      width: 200,
      render: (text, record) => {
        return (
          <div
            onClick={() => {
              handleNameClick(record);
            }}
            style={{ cursor: "pointer", color: "#080675" }}
          >
            {record.user?.firstName} {record.user?.lastName}
          </div>
        );
      },
    },
    {
      title: "Email Address",
      render: (text, record) => {
        return record.user.email;
      },
      width: 200,
    },
    {
      title: "KYC Level",
      render: (text, record) => {
        return record.user.kycLevel;
      },
      width: 120,
    },
    {
      title: "Date",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD").format("ll");
      },
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
    },
    (props.Role === "super-admin" || props.Role === "admin") && {
      title: "Action ",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <>
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => handleRowClick(record)}
            />
          </>
        );
      },
      width: 150,
    },
  ].filter(Boolean);

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
          <div className="px-4 sm:px-6 lg:px-8 py-4 w-full mx-auto">
            {/* <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-9xl mx-auto"> */}
            {/* Dashboard actions */}

            {/* Content */}
            <div className="">
              <div className="relative">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Pending Account Number Requests
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
                    <div className="mb-4 sm:mb-0 w-full">
                      <div className=" hidden sm:block w-full ">
                        <SearchForm
                          placeholder="Search for user "
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                          // onSubmit={handleSearch}
                        />
                      </div>
                    </div>
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1 sr-only"
                          htmlFor="status"
                        >
                          Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                        >
                          <option value="">{newStatus}</option>
                          <option value="pending">Pending</option>
                          <option value="assigned">Assigned</option>
                          <option value="unassigned">Unassigned</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-auto w-full">
                    <header className="px-5 py-4">
                      <h2 className="font-semibold text-blue-900">
                        Pendng Requests{" "}
                        <span className="text-slate-400 font-medium">
                          {total?.toLocaleString()}
                        </span>
                      </h2>
                    </header>
                    <Table
                      loading={props.admin.loading}
                      columns={columns}
                      dataSource={dataSource}
                      rowKey="id"
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

        <ModalBlank
          id="acct-modal"
          modalOpen={acctNumberModalOpen}
          setModalOpen={(arg) => {
            setSelectedUser(null);
            return setAcctNumberModalOpen(arg);
          }}
          click={() => {
            setAcctNumberModalOpen(false);
            setSelectedUser(null);
            setProvidusAccountNumber("");
            setStatus("pending");
          }}
          title="Assign Account Number"
        >
          {selectedUser && (
            <>
              {/* {console.log(selectedUser)} */}
              <div className="px-5 py-4">
                <form>
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="userName"
                      >
                        User's Name
                      </label>

                      <input
                        className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                        defaultValue={
                          selectedUser?.user?.firstName +
                          " " +
                          selectedUser?.user?.lastName
                        }
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="u"
                      >
                        User's Email
                      </label>

                      <input
                        className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                        defaultValue={selectedUser?.user?.email}
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="status"
                      >
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-select h-12 w-full px-2 py-1  text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                      >
                        <option value="">{selectedUser.status}</option>
                        <option value="assigned">Assign</option>
                        <option value="unassigned">Unassigned</option>
                        {/* <option value="pending">Pending</option> */}
                      </select>
                    </div>

                    {status === "assigned" && (
                      <div>
                        <label
                          className="block text-sm font-medium mb-1 text-blue-900"
                          htmlFor="optionalMsg"
                        >
                          Input Assigned Account Number
                        </label>
                        <input
                          className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                          placeholder="Enter acct number"
                          value={providusAccountNumber}
                          onChange={(e) =>
                            setProvidusAccountNumber(e.target.value)
                          }
                          required
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="px-5 py-4 w-full">
                <div className="flex flex-wrap justify-between w-full">
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAcctNumberModalOpen(false);
                      setSelectedUser(null);
                      setProvidusAccountNumber("");
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    onClick={() =>
                      handleAcctNumberForm(
                        selectedUser?.id,
                        providusAccountNumber,
                        selectedUser?.email
                      )
                    }
                    // disabled={
                    //   (status === "assigned" && providusAccountNumber === "")
                    // }
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      providusAccountNumber || status
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

export default connect(mapStateToProps)(PendingAcctNumber);
