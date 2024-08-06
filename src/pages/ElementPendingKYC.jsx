import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchForm from "../partials/actions/SearchForm";
import { connect } from "react-redux";
import routes from "../routes";
import { Image, Modal, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import ModalBlank from "../partials/actions/ModalBlank";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  approveElementKyc,
  disApproveElementKyc,
  getElementPendingKYC,
} from "../actions";
import empty from "../images/empty.svg";
import { EditOutlined } from "@ant-design/icons";

function ElementPendingKYC(props) {
  console.log(props);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setsearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("pending");
  const [Reason, setReason] = useState("");

  const navigate = useNavigate();
  // console.log(props);

  const handleRowClick = (user) => {
    setOpen(true);
    setSelectedUser(user);
  };

  const fetchPendingKyc = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await getElementPendingKYC(pageNumber);
      console.log(response);
      setDataSource(response?.data);
      setTotal(response.pagination?.total);
      // console.log(response?.pagination?.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  //make the call to fetch all pending Kyc requests
  useEffect(() => {
    fetchPendingKyc(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchQuery]);

  const handleApproveKYC = (userId, email) => {
    Modal.confirm({
      title: " Are you sure you want to approve this document",
      onOk: async () => {
        try {
          const res =
            status === "APPROVE"
              ? await approveElementKyc(userId)
              : await disApproveElementKyc(userId, Reason);
          message.success(`Action successful for ${email} `);
          window.location.reload();
          setOpen(false);
        } catch (error) {
          message.error(error.response?.data.message);
          setOpen(false);
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will approve this KYC document",
    });
  };

  const goBack = () => {
    navigate(routes.user_updates);
  };

  const handleNameClick = (record) => {
    // Redirect to UserDetails component with the record data
    navigate(`/elementuserdetails/${record.id}`, {
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
      dataIndex: "fullName",
      render: (text, record) => (
        <div
          onClick={() => handleNameClick(record)}
          style={{ cursor: "Pointer", color: "#1E3A8A" }}
        >
          {`${record.firstName} ${record.lastName}`}
        </div>
      ),
      fixed: "left",
      width: 200,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "KYC Level",
      dataIndex: "kycLevel",
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
  ].filter(Boolean);

  // conditions to show for approvals
  {
    (props.Role === "super-admin" ||
      props.Role === "finance-admin" ||
      props.Role === "fraud-admin" ||
      props.Role === "admin") &&
      columns.push({
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
      });
  }

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
          <div className="px-4 sm:px-6 lg:px-8 py-4 w-full  mx-auto">
            {/* Dashboard actions */}

            {/* Content */}
            <div className="">
              <div className="relative">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-baseline mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Element Pending KYC Requests
                    </h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
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
                          onChange={(e) => setsearchQuery(e.target.value)}
                          value={searchQuery}
                        />
                      </div>
                    </div>

                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
                  </div>

                  <header className="px-5 py-4">
                    <h2 className="font-semibold text-slate-800">
                      Requests{" "}
                      <span className="text-slate-400 font-medium">
                        {/* {userList?.length} */}
                        {total?.toLocaleString()}
                      </span>
                    </h2>
                  </header>

                  {/* Table */}
                  <Table
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowkey={(record) => record.id}
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
          id="kyc-modal"
          modalOpen={open}
          setModalOpen={setOpen}
          click={() => {
            setOpen(false);
            setSelectedUser(null);
            setStatus("");
          }}
          title="Approve Level 2 KYC"
        >
          {selectedUser && (
            <>
              <div className="px-5 py-4">
                <form>
                  <div className="space-y-3">
                    <div>
                      <Image
                        style={{ maxWidth: "100%" }}
                        src={selectedUser.elementKycPictureURL}
                        fallback={empty}
                      />
                    </div>
                  </div>
                  {selectedUser.KycPictureURL ? (
                    <>
                      <div className="mt-3">
                        <label htmlFor="approval" className="sr-only">
                          Select Action
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                            status ? "bg-blue-100" : "bg-transparent"
                          }`}
                        >
                          <option value="">Select an action</option>
                          <option value="APPROVE">Approve</option>
                          <option value="DISAPPROVE">Decline</option>
                        </select>
                      </div>
                      {status === "DISAPPROVE" && (
                        <div className="mt-3">
                          <label
                            className="block text-sm font-medium mb-1 text-blue-900"
                            htmlFor="optionalMsg"
                          >
                            Reason
                          </label>
                          <input
                            className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                            onChange={(e) => {
                              setReason(e.target.value);
                            }}
                            id="Reason"
                            name="Reason"
                            value={Reason}
                            required
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </form>
              </div>

              <div className="px-5 py-4 w-full">
                <div className="flex flex-wrap justify-between w-full">
                  <button
                    className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      setSelectedUser(null);
                      setStatus("");
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    onClick={() =>
                      handleApproveKYC(selectedUser.id, selectedUser.email)
                    }
                    disabled={status !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      status
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col  my-auto"
                    }`}
                  >
                    {status ? status : "Lv 2 KYC"}
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

export default connect(mapStateToProps)(ElementPendingKYC);
