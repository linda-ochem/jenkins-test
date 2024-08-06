import React, { useEffect, useState } from "react";

import SearchForm from "../../partials/actions/SearchForm";
import { Image, Modal, Spin, Table, message } from "antd";
import moment from "moment";
import {
  adminCreateRole,
  getAdminRoles,
  getAllAdminAccount,
  sendAdminInvite,
  updateAdminRole,
} from "../../actions";
import ModalBlank from "../actions/ModalBlank";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

function AdminAccounts() {
  // const [searchTerm, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [Open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [roleId, setRoleId] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [status, setStatus] = useState("");

  const handleRowClick = (user) => {
    setUpdateOpen(true);
    setSelectedAdmin(user);
  };

  const fetchAdmins = async () => {
    try {
      (async () => {
        setLoading(true);
        const res = await getAllAdminAccount(pageNumber);
        // console.log(res.data?.data);
        setDataSource(res.data?.data);
        setTotal(res.data?.pagination?.total);
        setLoading(false);
      })();
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch Admins, Pls try again");
    }
  };

  const updateRole = async (selectedAdmin) => {
    const data = {
      roleId,
      adminId: selectedAdmin.id,
      status,
    };
    // console.log(data);
    try {
      (async () => {
        setLoading(true);
        const res = await updateAdminRole(data);
        message.success(res.data?.message);
        setLoading(false);
        setUpdateOpen(false);
        fetchAdmins();
      })();
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch Admins, Pls try again");
    }
  };

  const fetchRoles = async () => {
    try {
      (async () => {
        setLoading(true);
        const res = await getAdminRoles();
        // console.log(res);
        setOptions(res.data?.data);
        setTotal(res.data?.length);
        setLoading(false);
      })();
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch Admins, Pls try again");
    }
  };

  const validateCompanyEmail = (email) => {
    const regex = /.*@wevesti.com$/;
    return regex.test(email);
  };

  const SendInvite = async () => {
    const data = {
      email,
      roleId,
    };

    setIsLoading(true);

    try {
      const res = await sendAdminInvite(data);
      console.log(res);
      message.success(res?.data?.message);
      setInviteModalOpen(false);
    } catch (error) {
      // console.error("Error sending admin invite:", error);
      message.error("Unable to send admin invite, Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async () => {
    setIsLoading(true);
    const data = {
      title: roleTitle,
    };
    try {
      const res = await adminCreateRole(data);
      // console.log(res);
      message.success(res?.data?.message);
      setOpen(false);
    } catch (error) {
      // console.error("Error sending admin invite:", error);
      message.error(error.data?.response?.message);
      // message.error("Unable to add role, Please try again");
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const deleteAdmin = async (record) => {
    if (record?.status === "blocked" || record?.status === "") {
      alert("User had been removed from the list");
    }
    if (record?.status !== "") {
      setIsLoading(true);
      Modal.confirm({
        title: `Are you sure you want to delete ${record?.fullName} from the admin list?`,
        onOk: async () => {
          try {
            const res = await deleteAdmin(record?.id);
            // console.log(res);
            setIsLoading(false);
            message.success(`${record?.fullName} removed successfully`);
          } catch (error) {
            // message.error(error.data?.response?.message);
            message.error(`Unable to remove ${record?.fullName}`);
          } finally {
            setIsLoading(false);
            // window.location.reload();
          }
        },
        onCancel: () => {
          console.log("cancelled");
        },
        okText: "Yes",
        okButtonProps: {
          style: {
            backgroundColor: "#1E3A8A",
          },
        },
        cancelText: "No",
        icon: <ExclamationCircleFilled />,
        content: `If you continue you will delete ${record?.fullName} from the admin list`,
      });
    }
  };

  useEffect(() => {
    fetchAdmins(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      dataIndex: "fullname",
      render: (text, record) => `${record.fullName}`,
      width: 200,
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "name",
      render: (text, record) => (
        <span>
          <Image
            src={record.profilePicture}
            alt={text}
            width={50}
            height={50}
            style={{ borderRadius: "20px" }}
          />
          {text}
        </span>
      ),
      width: 100,
    },
    {
      title: "email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Invited By",
      dataIndex: "invitedBy",
      width: 200,
    },
    {
      title: "Admin Type",
      dataIndex: "adminType",
      render: (text, record) => `${record.role?.title}`,
      width: 200,
    },
    {
      title: "Admin Status",
      dataIndex: "status",
      render: (text, record) => `${record.status}`,
      width: 100,
    },
    {
      title: "Time Created",
      index: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt, "YYYY-MM-DD HH:mm:ss").format("lll");
      },
      width: 120,
    },
    {
      title: "Edit Admin Role ",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex justify-around items-center gap-4">
            <EditOutlined
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => handleRowClick(record)}
            />
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => deleteAdmin(record)}
            />
          </div>
        );
      },
      width: 150,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* Content */}
          <div className="mt-10">
            <div className="relative">
              <div className="px-4 sm:px-6 lg:px-2 w-full  mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl md:text-xl text-blue-900 font-bold">
                      Admin Accounts
                    </h1>
                  </div>
                </div>

                <div className="border p-5">
                  <div className="sm:flex sm:justify-between sm:items-center mb-4 pb-4 md:mb-2 w-full ">
                    {/* Left: Searchbar */}
                    {/* <div className="mb-4 sm:mb-0 w-full">
                        <div className=" hidden sm:block w-full ">
                          <SearchForm
                            placeholder="Search for user transaction"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchTerm}
                          />
                        </div>
                      </div> */}

                    {/* Right: filter Actions */}
                    <div className="grid grid-flow-col sm:auto-cols-max justify-between sm:justify-end gap-2">
                      <button
                        className="bg-blue-900 rounded flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                        onClick={() => setOpen(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>

                        <span className="text-white">Create Role</span>
                      </button>
                      <button
                        className="bg-blue-900 rounded flex justify-between items-center gap-4 text-[16px] h-12 px-5  w-full"
                        onClick={() => setInviteModalOpen(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            className=" text-white"
                          />
                        </svg>
                        <span className="text-white">Invite Admin</span>
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-auto w-full">
                    <Table
                      loading={loading}
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

        {/* invite admin */}
        <ModalBlank
          id="report-modal"
          modalOpen={inviteModalOpen}
          setModalOpen={setInviteModalOpen}
          click={() => {
            setInviteModalOpen(false);
            setEmail("");
            setRoleId("");
          }}
          title="Invite an Admin"
        >
          {/* Modal content */}
          <div className="px-5 py-4">
            <form>
              <div className="space-y-3">
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
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="currency"
                  >
                    Roles
                  </label>

                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                  >
                    <option value="">---Select Role---</option>
                    {options?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>
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
                      setInviteModalOpen(false);
                      setEmail("");
                      setRoleId("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      if (!validateCompanyEmail(email)) {
                        alert(
                          "Invalid email address. Must end with wevesti.com"
                        );
                      } else {
                        SendInvite();
                      }
                    }}
                    disabled={email !== "" || roleId !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      email && roleId
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                    }`}
                  >
                    {isLoading ? "Sending Invite..." : "Invite"}
                  </button>
                </>
              )}
            </div>
          </div>
        </ModalBlank>

        {/* change admin role */}
        <ModalBlank
          id="report-modal"
          modalOpen={updateOpen}
          setModalOpen={setUpdateOpen}
          click={() => {
            setUpdateOpen(false);
            setRoleId("");
          }}
          title="Edit Admin Role"
        >
          {/* Modal content */}
          <div className="px-5 py-4">
            <form>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="email"
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    defaultValue={selectedAdmin?.fullName}
                    required
                    disabled
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="currency"
                  >
                    Roles
                  </label>

                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                  >
                    <option value="">---Select Role---</option>
                    {options?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="currency"
                  >
                    Roles
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                  >
                    <option value="">{selectedAdmin?.status}</option>
                    <option value="blocked">Blocked</option>
                    <option value="accepted">Unblock</option>
                  </select>
                </div>
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
                      setUpdateOpen(false);
                      setRoleId("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      updateRole(selectedAdmin);
                    }}
                    disabled={roleId !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      roleId
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                    }`}
                  >
                    {isLoading ? "Changing Role..." : "Change Role"}
                  </button>
                </>
              )}
            </div>
          </div>
        </ModalBlank>

        {/* add roles */}
        <ModalBlank
          id="report-modal"
          modalOpen={Open}
          setModalOpen={setOpen}
          click={() => {
            setOpen(false);
            setEmail("");
            setRoleId("");
          }}
          title="Create Role"
        >
          {/* Modal content */}
          <div className="px-5 py-4">
            <form>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="email"
                  >
                    Role Title (e.g super-admin)
                  </label>

                  <input
                    type="text"
                    className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    required
                  />
                </div>
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
                      setOpen(false);
                      setEmail("");
                      setRoleId("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      createRole();
                    }}
                    disabled={roleTitle !== "" ? false : true}
                    className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                      roleTitle
                        ? " bg-blue-900 text-white hover:bg-blue-950"
                        : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                    }`}
                  >
                    {isLoading ? "Creating Role..." : "Create Role"}
                  </button>
                </>
              )}
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  );
}

export default AdminAccounts;
