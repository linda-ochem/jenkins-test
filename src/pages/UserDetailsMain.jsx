import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SingleUserTransactions from "../partials/adminDashboard/usertable/SingleUserTransactions";
import { connect } from "react-redux";
import { toWholeCurrency } from "../helpers";
import routes from "../routes";
import { Image, Modal, Spin, Table, message } from "antd";
import { fetchSingleUser } from "../redux/customers/customers.action";
import ModalBlank, { AdminModal } from "../partials/actions/ModalBlank";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  FreezeAndUnfreeze,
  adminUploadKyc,
  approveKyc,
  approveTermsAndCondition,
  assignProvidusAccountNumber,
  blackListUser,
  connectStripeCreateAccount,
  createTreasuryAccountNumber,
  disApproveKyc,
  getProfile2,
  getUserWallet,
  unblockUser,
  updateDailyTransferLimit,
  updateDailyWithdrawalLimit,
  updateInstantTransferLimit,
  updateInstantWithdrawalLimit,
  updateUserProfiles,
  updateUserWallet,
} from "../actions";
import { KycUpload } from "./CreateCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CurrencyInput } from "../partials/actions/CurrencyInput";
import empty from "../images/empty.svg";
import moment from "moment";

function UserDetailsMain(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state.user?.id;
  const email = location.state.user?.email;
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  //makes the call to fetch the user
  useEffect(() => {
    userId ? fetchSingleUser(userId) : () => {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    userId ? fetchUserWallets(userId) : () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSingleUser = async (userId) => {
    setLoading(true);
    try {
      const response = await getProfile2(userId);
      // console.log("Wallets: ", response);
      setUser(response?.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Sorry, Couldn't fetch customer's wallets. Pls Try again later"
      );
    }
  };

  const fetchUserWallets = async (userId) => {
    try {
      const response = await getUserWallet(userId);
      // console.log("Wallets: ", response);
      setWallets(response);
    } catch (error) {
      message.error(
        "Sorry, Couldn't fetch customer's wallets. Pls Try again later"
      );
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blackListModalOpen, setBlackListModalOpen] = useState(false);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [acctNumberModalOpen, setAcctNumberModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState("pending");
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycApproveModalOpen, setKycApproveModalOpen] = useState(false);
  const [kycDocModalOpen, setKycDocModalOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [debitModalOpen, setDebitModalOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [tcModal, setTCModal] = useState(false);
  const [updateOpen1, setUpdateOpen1] = useState(false);
  const [updateOpen2, setUpdateOpen2] = useState(false);
  const [saModal, setSAModal] = useState(false);
  const [adminActModal, setAdminActModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageNumber, setpageNumber] = useState(1);
  const [frontPicture, setFrontPicture] = useState(null);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [transferCurrency, setTransferCurrency] = useState("");
  const [withdrawalCurrency, setWithdrawalCurrency] = useState("");
  const [transferLimitType, setTransferLimitType] = useState("");
  const [withdrawalLimitType, setWithdrawalLimitType] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [status, setStatus] = useState("");
  const [cardID, setCardID] = useState("");
  const [wallets, setWallets] = useState([]);

  const [acctStatus, setAcctStatus] = useState("pending");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [blacklist, setBlacklist] = useState({
    optionalMsg: "",
    reason: "",
    email: "",
  });
  const [unblock, setUnblock] = useState({
    optionalMsg: "",
    reason: "",
    email: "",
  });
  const [freeze, setFreeze] = useState({
    optionalMsg: "",
    reason: "",
    email: "",
  });
  const [acctNumber, setAcctNumber] = useState({
    accountNumber: "",
    email: "",
  });
  const [deleteUser, setDeleteUser] = useState({
    optionalMsg: "",
    reason: "",
    email: "",
  });
  const [updateValues, setUpdateValues] = useState({
    currency: "NGN",
    amount: 0,
    remark: "",
    action: "increment",
  });
  const [deductValues, setDeductValues] = useState({
    currency: "NGN",
    amount: 0,
    remark: "",
    action: "decrement",
  });

  const handleCredit = async (userId) => {
    Modal.confirm({
      title: " Are you sure you want to credit this user?",
      onOk: async () => {
        try {
          await updateUserWallet(
            userId,
            updateValues.currency,
            updateValues.remark,
            `${parseInt(parseFloat(updateValues.amount) * 100)}`,
            updateValues.action
          );
          message.success(`${email} credited successfully`);
          setCreditModalOpen(false);
          fetchSingleUser(userId);
        } catch (error) {
          message.error(`${error.response.data.message}`);
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
      content: "If you continue you will Credit this user",
    });
  };

  const handleDebit = async (userId) => {
    Modal.confirm({
      title: " Are you sure you want to debit this user?",
      onOk: async () => {
        try {
          await updateUserWallet(
            userId,
            deductValues.currency,
            deductValues.remark,
            `${parseInt(parseFloat(deductValues.amount) * 100)}`,
            deductValues.action
          );
          message.success(`${email} debited successfully`);
          setDebitModalOpen(false);
          fetchSingleUser(userId);
        } catch (error) {
          message.error(`${error.response.data.message}`);
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will debit this user",
    });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setFrontPicture(base64String);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleKycUpload = async (userId) => {
    try {
      await adminUploadKyc(userId, frontPicture);
      message.success(data.message);
      message.success("Kyc Uploaded successfully");
      setOpen(false);
      fetchSingleUser(userId);
    } catch (error) {
      message.error("Could not complete the request");
      setOpen(false);
    }
  };

  const handleTC = async (email) => {
    // console.log(email, cardID);
    Modal.confirm({
      title: " Are you sure you want approve for this user?",
      onOk: async () => {
        try {
          await approveTermsAndCondition({ accountId: cardID });
          message.success(`T & C accepted successfully for ${email} `);
          setTCModal(false);
          window.location.reload();
        } catch (error) {
          message.error("Could not complete the request");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will approve for this user",
    });
  };

  const handleCreateTreasuryAccountNumber = (email) => {
    Modal.confirm({
      title:
        "Are you sure you want to create a treasury account number for this user?",
      onOk: async () => {
        try {
          await createTreasuryAccountNumber(email);
          message.success(
            `Successfully Created Treasury Account for ${email} `
          );
          setSAModal(false);
          window.location.reload();
        } catch (error) {
          message.error("Could not complete the request");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content:
        "If you continue you will create a treasury account number for this user",
    });
  };

  const setBlacklistField = (field, value) =>
    setBlacklist({ ...blacklist, [field]: value });

  const setUnblockField = (field, value) =>
    setUnblock({ ...unblock, [field]: value });

  const setFreezeField = (field, value) =>
    setFreeze({ ...freeze, [field]: value });

  const setAcctNumberField = (field, value) =>
    setAcctNumber({ ...acctNumber, [field]: value });

  const setDeleteField = (field, value) =>
    setDeleteUser({ ...deleteUser, [field]: value });

  const handleBackClick = () => {
    navigate(routes.user_updates);
  };

  const handleBlacklistForm = (customerId) => {
    Modal.confirm({
      title: " Are you sure you want to carry out this action?",
      onOk: async () => {
        try {
          await blackListUser(customerId, blacklist.reason);
          message.success("Action completed successfully");
          setBlacklist({
            optionalMsg: "",
            reason: "",
            email: "",
          });
          setBlackListModalOpen(false);
        } catch (error) {
          message.error("Could not blacklist user");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will blacklist this user",
    });
  };

  const handleUnblockForm = (customerId, email) => {
    Modal.confirm({
      title: " Are you sure you want to unblock this user?",
      onOk: async () => {
        try {
          await unblockUser(customerId, unblock.reason);
          message.success(`${email} Unblocked successfully`);
          setUnblock({
            optionalMsg: "",
            reason: "",
            email: "",
          });
          setUnblockModalOpen(false);
        } catch (error) {
          message.error("Could not unblock user");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will unblock this user",
    });
  };

  const handleFreezeForm = (customerId) => {
    Modal.confirm({
      title: "Are you sure you want to carry out this action?",
      onOk: async () => {
        try {
          await FreezeAndUnfreeze(customerId, freeze.reason);
          message.success("Action completed successfully");
          setFreeze({
            optionalMsg: "",
            reason: "",
            email: "",
          });
          setFreezeModalOpen(false);
        } catch (error) {
          message.error("Could not complete this action");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will freeze or unfreeze this user",
    });
  };

  const handleAcctNumberForm = (requestId, email) => {
    Modal.confirm({
      title:
        " Are you sure you want to assign a providus account number to this user?",
      onOk: async () => {
        try {
          const res = await assignProvidusAccountNumber(
            requestId,
            acctNumber.accountNumber,
            acctStatus
          );
          message.success(`${res.data.message} to ${email} `);
          setAcctNumberModalOpen(false);
        } catch (error) {
          message.error(error.response.data.message);
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

  const handleDeleteForm = (email) => {
    Modal.confirm({
      title: " Are you sure you want to delete this account?",
      onOk: async () => {
        try {
          // await blackListUser(email)
          message.success("User deleted successfully");
          setDeleteModalOpen(false);
        } catch (error) {
          message.error("Error", "Could not blacklist user", "error");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will delete this account",
    });
  };

  const handleChangeName = async () => {
    const customerId = userId;
    const firstName = newFirstName;
    const lastName = newLastName;
    // const phoneNumber= phoneNumber ? phoneNumber : '',

    // console.log(customerId, firstName, lastName);

    try {
      const res = await updateUserProfiles(customerId, firstName, lastName);
      message.success(res.data.message);
      setUpdateOpen(false);
      window.location.reload();
    } catch (error) {
      message.error("Error", "Could not complete request", "error");
    }
  };

  const handleConnectStripeCreateAccount = async (email) => {
    Modal.confirm({
      title: "Are you sure you want to create connected account for this user?",
      onOk: async () => {
        try {
          await connectStripeCreateAccount(email);
          message.success(
            "Successfully Created a Connected Account, Make use of the Connect Onboarding Link"
          );
        } catch (error) {
          message.error("Could not complete request");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content:
        "If you continue you will create a connected account for this user",
    });
  };

  const updateWithdrawalLimit = async (userId) => {
    Modal.confirm({
      title: "Are you sure you want to update withdrawal Limit for this user?",
      onOk: async () => {
        try {
          let res;
          switch (withdrawalLimitType + withdrawalCurrency) {
            case "INSTANTNGN":
              res = await updateInstantWithdrawalLimit(
                userId,
                withdrawalAmount,
                "ngnWithdrawalLimit"
              );
              break;
            case "INSTANTUSD":
              res = await updateInstantWithdrawalLimit(
                userId,
                withdrawalAmount,
                "usdWithdrawalLimit"
              );
              break;
            case "DAILYNGN":
              res = await updateDailyWithdrawalLimit(
                userId,
                withdrawalAmount,
                "ngnDailyLimit"
              );
              break;
            case "DAILYUSD":
              res = await updateDailyWithdrawalLimit(
                userId,
                withdrawalAmount,
                "usdDailyWithdrawalLimit"
              );
              break;
            default:
              return "Invalid Type";
          }
          console.log(res);
          if (res && res.data && res.data.message) {
            message.success(res.data.message);
            setUpdateOpen2(false);
          } else {
            message.error("Unable to update successfully");
          }
        } catch (error) {
          message.error("Unable to update successfully");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will update withdrawal Limit for this user",
    });
  };

  const updateTransferLimit = async (userId) => {
    Modal.confirm({
      title: "Are you sure you want to update transfer Limit for this user?",
      onOk: async () => {
        try {
          let res;
          switch (transferLimitType + transferCurrency) {
            case "INSTANTNGN":
              res = await updateInstantTransferLimit(
                userId,
                transferAmount,
                "ngnTransaferLimit"
              );
              break;
            case "INSTANTUSD":
              res = await updateInstantTransferLimit(
                userId,
                transferAmount,
                "usdTransaferLimit"
              );
              break;
            case "DAILYNGN":
              res = await updateDailyTransferLimit(
                userId,
                transferAmount,
                "ngnDailyTransferLimit"
              );
              break;
            case "DAILYUSD":
              res = await updateDailyTransferLimit(
                userId,
                transferAmount,
                "usdDailyTransferLimit"
              );
              break;
            default:
              res = "Invalid Type";
          }
          console.log(res);
          if (res && res.data && res.data.message) {
            message.success(res.data.message);
            setUpdateOpen1(false);
          } else {
            message.error("Unable to update successfully");
          }
        } catch (error) {
          message.error("Unable to update successfully");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will update transfer Limit for this user",
    });
  };

  const handleApproveKYC = (userId) => {
    Modal.confirm({
      title: " Are you sure you want to approve this document",
      onOk: async () => {
        try {
          const res =
            status === "APPROVE"
              ? await approveKyc(userId)
              : await disApproveKyc(userId);
          // console.log(res);
          message.success(`${res.message} `);
          setKycApproveModalOpen(false);
        } catch (error) {
          message.error(error.response?.data.message);
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

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      fixed: "left",
      render: (text, record, rowIndex) => rowIndex + 1,
      width: 30,
    },
    {
      title: "Name",
      dataIndex: "fullname",
      render: (text, record) => `${user?.firstName} ${user?.lastName}`,
      width: 120,
    },
    {
      title: "Activity",
      dataIndex: "action ",
      render: (text, record) => `${record?.activity}`,
      width: 80,
    },
    {
      title: "Activity By",
      dataIndex: "action ",
      render: (text, record) => `${record.admin?.fullName}`,
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
  ];

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

        {loading ? (
          <Spin />
        ) : (
          <>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
              <form>
                <section>
                  <div className="flex justify-between">
                    <h2 className="text-xl leading-snug text-blue-950 font-bold mb-1">
                      User Details
                    </h2>
                    <h3
                      className="font-semibold text-blue-950 cursor-pointer flex"
                      onClick={() => handleBackClick()}
                    >
                      <svg
                        className="shrink-0 w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-950 font-bold"
                          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                        />
                      </svg>
                      Back
                    </h3>
                  </div>

                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/2 relative">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="fullname"
                      >
                        Fullname
                      </label>
                      <input
                        type="text"
                        className="form-input w-full"
                        defaultValue={user?.firstName + " " + user?.lastName}
                        disabled
                      />
                      {(props.Role === "admin" ||
                        props.Role === "fraud-admin" ||
                        props.Role === "super-admin") && (
                        <div className="absolute bottom-1 right-0 ">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setUpdateOpen(true);
                            }}
                            className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
                          >
                            Update Name
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="sm:w-1/2 relative">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="virtualCard"
                      >
                        GlobalGeng Virtual Dollar Card
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.hasVirtualCard}
                        id="virtualCard"
                        className="form-input w-full"
                        disabled
                      />
                      {user?.hasVirtualCard === "false" ? (
                        <div className="absolute bottom-1 right-0">
                          <Link
                            to={routes.card_transactions}
                            className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
                          >
                            Create card
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/2">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="email"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-input w-full"
                        defaultValue={user?.email}
                        disabled
                      />
                    </div>
                    <div className="sm:w-1/2 relative">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="physicalCard"
                      >
                        GlobalGeng Physical Naira Card
                      </label>
                      <input
                        type="text"
                        placeholder="Nil"
                        className="form-input w-full px-2"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/2">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.username}
                        className="form-input w-full"
                        disabled
                      />
                    </div>
                    <div className="sm:w-1/2 relative">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="identification"
                      >
                        KYC Level
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.kycLevel}
                        className="form-input w-full px-2"
                        disabled
                      />

                      {user?.kycLevel === "Level1" &&
                      user?.kycDocumentStatus === "PENDING" ? (
                        <div className="absolute bottom-1 right-0 ">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setKycApproveModalOpen(true);
                            }}
                            className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
                          >
                            Approve Lv2 KYC
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      {user?.kycLevel === "Level1" &&
                      (user?.kycDocumentStatus === "DISAPPROVED" ||
                        !user?.kycDocumentStatus) ? (
                        <div className="absolute bottom-1 right-0">
                          <KycUpload
                            setOpen={setOpen}
                            open={open}
                            handleUpload={handleUpload}
                            frontPicture={frontPicture}
                            setFrontPicture={setFrontPicture}
                            onClick={(e) => {
                              e.preventDefault();
                              handleKycUpload(user?.id);
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {user?.kycLevel === "Level2" &&
                      (user?.KycPictureURL === "DISAPPROVED" ||
                        !user?.kycDocumentStatus) ? (
                        <div className="absolute bottom-1 right-0">
                          <KycUpload
                            setOpen={setOpen}
                            open={open}
                            handleUpload={handleUpload()}
                            frontPicture={frontPicture}
                            setFrontPicture={setFrontPicture}
                            onClick={(e) => {
                              e.preventDefault();
                              handleKycUpload(user?.id);
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {(user?.KycPictureURL && user?.kycLevel === "Level2") ||
                      user?.kycLevel === "Level3" ? (
                        <div className="absolute bottom-1 right-0 ">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setKycDocModalOpen(true);
                            }}
                            className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
                          >
                            See KYC Doc
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/2">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="username"
                      >
                        User Identification Type
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user?.verificationType
                            ? user?.verificationType
                            : "N/A"
                        }
                        className="form-input w-full"
                        disabled
                      />
                    </div>

                    <div className="sm:w-1/2 relative">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="identification"
                      >
                        Verified KYC Status
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.verifiedKyc}
                        className="form-input w-full px-2"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/2 relative">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="accountnumber"
                      >
                        Providus Account Number
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user?.providusAccountNumber
                            ? user?.providusAccountNumber
                            : "Not Assigned"
                        }
                        className="form-input w-full px-2"
                        disabled
                      />
                      {/* {console.log(props.Role)} */}
                      {!user?.providusAccountNumber &&
                      (props.Role === "admin" ||
                        props.Role === "fraud-admin") ? (
                        <div className="absolute bottom-1 right-0">
                          <button
                            onClick={(e) => {
                              navigate(routes.pendingacct_requests);
                            }}
                            className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
                          >
                            Assign Account Number
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {user?.phoneNumberNew ? (
                      <div className="sm:w-1/2">
                        <label
                          className="block text-blue-950 text-sm font-semibold mb-1"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phoneNumber"
                          defaultValue={
                            user?.phoneNumberNew?.code +
                            "" +
                            user?.phoneNumberNew?.number
                          }
                          className="form-input w-full"
                          disabled
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    {user?.phoneNumber !== "false" ? (
                      <div className="sm:w-1/2">
                        <label
                          className="block text-blue-950 text-sm font-semibold mb-1"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phoneNumber"
                          defaultValue={user?.phoneNumber}
                          className="form-input w-full"
                          disabled
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    {user?.blacklisted && (
                      <div className="sm:w-1/2">
                        <label
                          className="block text-blue-950 text-sm font-semibold mb-1"
                          htmlFor="blacklisted"
                        >
                          Blacklisted Status
                        </label>
                        <input
                          type="text"
                          defaultValue={"This User is currently blacklisted"}
                          className="form-input w-full"
                          disabled
                        />
                      </div>
                    )}
                    <div className="sm:w-1/2">
                      <label
                        className="block text-blue-950 text-sm font-semibold mb-1"
                        htmlFor="createdon"
                      >
                        Account Created On
                      </label>
                      <input
                        type="text"
                        defaultValue={moment(user?.createdAt).format("ll")}
                        className="form-input w-full"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    {/* {console.log(wallets)} */}
                    {wallets?.length > 0
                      ? wallets?.map((item, index) => (
                          <div key={index} className="sm:w-1/2">
                            <label
                              className="block text-blue-950 text-sm font-semibold mb-1"
                              htmlFor="nairabalance"
                            >
                              User Balance({item.currency})
                            </label>
                            <input
                              type="text"
                              defaultValue={toWholeCurrency(item.balance)}
                              className="form-input w-full"
                              disabled
                            />
                          </div>
                        ))
                      : ""}
                  </div>
                </section>
              </form>
              {(props.Role === "super-admin" ||
                props.Role === "fraud-admin" ||
                props.Role === "admin" ||
                props.Role === "finance-admin") && (
                <>
                  <section>
                    <div className=" flex justify-around sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
                      {(props.Role === "super-admin" ||
                        props.Role === "fraud-admin" ||
                        props.Role === "finance-admin") && (
                        <>
                          {!user?.blacklisted ? (
                            <div>
                              <div
                                className="border p-5 rounded-md border-slate-400 cursor-pointer"
                                onClick={() => {
                                  setBlackListModalOpen(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="shrink w-full h-10"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-950 font-semibold"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                              </div>
                              <p className="font-semibold text-blue-950 text-sm">
                                {`Blacklist ${user?.firstName}`}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <div
                                className="border p-5 rounded-md border-slate-400 cursor-pointer"
                                onClick={() => {
                                  setUnblockModalOpen(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="shrink w-full h-10"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-950 font-semibold"
                                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-950 font-semibold"
                                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                                  />
                                </svg>
                              </div>
                              <p className="font-semibold text-blue-950 text-sm">
                                {`Unblock ${user?.firstName}`}
                              </p>
                            </div>
                          )}
                          <div>
                            <div
                              className="border p-5 rounded-md border-slate-400 cursor-pointer"
                              onClick={() => {
                                setFreezeModalOpen(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="shrink-0 w-full h-10"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-950 font-semibold"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-blue-950 text-sm">
                              {user?.freeze
                                ? `Unfreeze ${user?.firstName}`
                                : `Freeze ${user?.firstName}`}
                            </p>
                          </div>
                        </>
                      )}

                      {(props.Role === "super-admin" ||
                        props.Role === "finance-admin") && (
                        <>
                          <div>
                            <div
                              className="border p-5 rounded-md border-slate-400 cursor-pointer"
                              onClick={() => {
                                setDebitModalOpen(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="shrink-0 w-full h-10"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-950 font-semibold"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-blue-950 text-sm">
                              Debit {user?.firstName}
                            </p>
                          </div>

                          <div>
                            <div
                              className="border p-5 rounded-md border-slate-400 cursor-pointer"
                              onClick={() => {
                                setCreditModalOpen(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="shrink-0 w-full h-10"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-950 font-semibold"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-blue-950 text-sm">
                              Credit {user?.firstName}
                            </p>
                          </div>
                        </>
                      )}
                      <div>
                        <div
                          className="border p-5 rounded-md border-slate-400 cursor-pointer"
                          onClick={() => {
                            setAdminActModal(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="shrink-0 w-full h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-950 font-semibold"
                              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-blue-950 text-sm">
                          Admin Activities
                        </p>
                      </div>
                      {props.Role === "super-admin" ||
                      props.Role === "fraud-admin" ||
                      props.Role === "admin" ? (
                        <div>
                          <div
                            className="border p-5 rounded-md border-slate-400 cursor-pointer"
                            onClick={() => {
                              setDeleteModalOpen(true);
                            }}
                          >
                            <svg
                              className=" shrink-0 w-full h-10"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-950 ml-2"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </div>
                          <p className="font-semibold text-blue-950 text-sm">
                            {`Delete ${user?.firstName}`}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </section>
                  <section>
                    <div className=" flex justify-around sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
                      {/* Update transfer Limit */}
                      {(props.Role === "super-admin" ||
                        props.Role === "fraud-admin" ||
                        props.Role === "finance-admin" ||
                        props.Role === "admin") && (
                        <>
                          <div>
                            <div
                              className="border p-5 rounded-md border-slate-400 cursor-pointer"
                              onClick={() => {
                                setUpdateOpen1(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="shrink-0 w-full h-10"
                              >
                                <path
                                  className="text-blue-950 font-semibold"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-blue-950 text-sm">
                              Update Transfer Limit
                            </p>
                          </div>
                          {/* Update Withdrawal Limit */}
                          <div>
                            <div
                              className="border p-5 rounded-md border-slate-400 cursor-pointer"
                              onClick={() => {
                                setUpdateOpen2(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="shrink-0 w-full h-10"
                              >
                                <path
                                  className="text-blue-950 font-semibold"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-blue-950 text-sm">
                              Update Withdrawal Limit
                            </p>
                          </div>
                        </>
                      )}

                      {/* {accept stripe} */}
                      <div>
                        <div
                          className="border p-5 rounded-md border-slate-400 cursor-pointer"
                          onClick={() => {
                            setTCModal(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="shrink-0 w-full h-10"
                          >
                            <path
                              className="text-blue-950 font-semibold"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-blue-950 text-sm">
                          Accept Stripe T & C
                        </p>
                      </div>
                      {/* Create Connected Account */}
                      <div>
                        <div
                          className="border p-5 rounded-md border-slate-400 cursor-pointer"
                          onClick={() => {
                            handleConnectStripeCreateAccount(user?.email);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="shrink-0 w-full h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-950 font-semibold"
                              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-blue-950 text-sm">
                          Create Connected Account
                        </p>
                      </div>

                      {/* Create Treasury Account */}
                      <div>
                        <div
                          className="border p-5 rounded-md border-slate-400 cursor-pointer"
                          onClick={() => {
                            setSAModal(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="shrink-0 w-full h-10"
                          >
                            <path
                              className="text-blue-950 font-semibold"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-blue-950 text-sm">
                          Create Treasury Account number
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
            <section>
              <SingleUserTransactions user={user} userId={userId} />
            </section>
          </>
        )}
      </div>

      {/* blacklist user modal */}
      <ModalBlank
        id="blacklist-modal"
        modalOpen={blackListModalOpen}
        setModalOpen={setBlackListModalOpen}
        click={() => {
          setBlackListModalOpen(false);
        }}
        title={`Blacklist ${user?.firstName}`}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="blreason"
                >
                  Select Reason
                </label>
                <select
                  id="blreason"
                  value={blacklist?.reason}
                  onChange={(e) => setBlacklistField("reason", e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value=" ">Select a reason</option>
                  <option>Unusual Activity Patterns</option>
                  <option>Fraudulent Activity</option>
                  <option>Payment Issues </option>
                  <option>Violation of terms and conditions</option>
                  <option>High Risk Behaviour</option>
                  <option>Security concerns</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="optionalMsg"
                >
                  More Information (Optional)
                </label>
                <textarea
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  rows="5"
                  placeholder="Enter more Information"
                  value={blacklist?.optionalMsg}
                  onChange={(e) =>
                    setBlacklistField("optionalMsg", e.target.value)
                  }
                  required
                ></textarea>
              </div>
              <div className="">
                <input
                  type="text"
                  defaultValue={user?.email}
                  className="form-textarea w-full px-2 py-1 border-0  text-blue-900"
                  hidden
                />
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
                setBlackListModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleBlacklistForm(user?.id)}
              disabled={blacklist?.reason !== "" ? false : true}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                blacklist?.reason
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Blacklist {user?.firstName}
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Unblock user modal */}
      <ModalBlank
        id="unblock-modal"
        modalOpen={unblockModalOpen}
        setModalOpen={setUnblockModalOpen}
        click={() => {
          setUnblockModalOpen(false);
        }}
        title={`Unblock ${user?.firstName}`}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="blreason"
                >
                  Select Reason
                </label>
                <select
                  id="blockreason"
                  value={unblock?.reason}
                  onChange={(e) => setUnblockField("reason", e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value=" ">Select a reason</option>
                  <option>Issues resolved</option>
                  <option>Temporary resolution</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="optionalMsg"
                >
                  More Information (Optional)
                </label>
                <textarea
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  rows="5"
                  placeholder="Enter more Information"
                  value={unblock?.optionalMsg}
                  onChange={(e) =>
                    setUnblockField("optionalMsg", e.target.value)
                  }
                  required
                ></textarea>
              </div>
              <div className="">
                <input
                  type="text"
                  defaultValue={user?.email}
                  className="form-textarea w-full px-2 py-1 border-0  text-blue-900"
                  hidden
                />
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
                setUnblockModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleUnblockForm(user?.id, user?.email)}
              disabled={unblock.reason !== "" ? false : true}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                unblock.reason
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Unblock {user?.firstName}
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Freeze and Unfreeze user modal */}
      <ModalBlank
        id="freeze-modal"
        modalOpen={freezeModalOpen}
        setModalOpen={setFreezeModalOpen}
        click={() => {
          setFreezeModalOpen(false);
          setFreeze({
            optionalMsg: "",
            reason: "",
            email: "",
          });
        }}
        title={`${
          user?.freeze
            ? `Unfreeze ${user?.firstName}`
            : `Freeze ${user?.firstName}`
        }`}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="blreason"
                >
                  Select Reason
                </label>
                <select
                  id="blreason"
                  value={freeze.reason}
                  onChange={(e) => setFreezeField("reason", e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  {user?.freeze ? (
                    <>
                      <option>-- Select a reason--</option>
                      <option>Issues resolved</option>
                    </>
                  ) : (
                    <>
                      <option>-- Select a reason--</option>
                      <option>Unusual Activity Patterns</option>
                      <option>Fraudulent Activity</option>
                      <option>Payment Issues </option>
                      <option>Violation of terms and conditions</option>
                      <option>High Risk Behaviour</option>
                      <option>Security concerns</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="optionalMsg"
                >
                  More Information (Optional)
                </label>
                <textarea
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  rows="5"
                  placeholder="Enter more Information"
                  value={freeze.optionalMsg}
                  onChange={(e) =>
                    setFreezeField("optionalMsg", e.target.value)
                  }
                  required
                ></textarea>
              </div>
              <div className="">
                <input
                  type="text"
                  defaultValue={user?.email}
                  className="form-textarea w-full px-2 py-1 border-0  text-blue-900"
                  hidden
                />
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
                setFreezeModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleFreezeForm(user?.id)}
              disabled={freeze.reason !== "" ? false : true}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                freeze.reason
                  ? " bg-blue-800 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col  my-auto"
              }`}
            >
              {user?.freeze
                ? `Unfreeze ${user?.firstName}`
                : `Freeze ${user?.firstName}`}
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* assign acct number modal */}

      <ModalBlank
        id="acct-modal"
        modalOpen={acctNumberModalOpen}
        setModalOpen={(arg) => {
          return setAcctNumberModalOpen(arg);
        }}
        click={() => {
          setAcctNumberModalOpen(false);
          setAcctNumber("");
          setStatus("pending");
        }}
        title="Assign Account Number"
      >
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
                    props?.user?.firstName + " " + props?.user?.lastName
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
                  defaultValue={props?.user?.email}
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
                  value={acctStatus}
                  onChange={(e) => setAcctStatus(e.target.value)}
                  className="form-select h-12 w-full px-2 py-1  text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value="">---Select Status below ----</option>
                  <option value="assigned">Assign</option>
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>

              {acctStatus === "assigned" && (
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
                    value={acctNumber.accountNumber}
                    onChange={(e) =>
                      setAcctNumberField("accountNumber", e.target.value)
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
                setAcctNumber("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleAcctNumberForm(user?.id)}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                acctStatus || acctNumber.accountNumber
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Assign
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Delete user modal */}
      <ModalBlank
        id="delete-modal"
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        title="Delete Account"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="blreason"
                >
                  Select Reason
                </label>
                <select
                  id="blreason"
                  value={deleteUser.reason}
                  onChange={(e) => setDeleteField("reason", e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value=" ">Select a reason</option>
                  <option>Unusual Activity Patterns</option>
                  <option>Fraudulent Activity</option>
                  <option>Payment Issues </option>
                  <option>Violation of terms and conditions</option>
                  <option>High Risk Behaviour</option>
                  <option>Security concerns</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="optionalMsg"
                >
                  More Information
                </label>
                <textarea
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  rows="5"
                  placeholder="Enter more Information"
                  value={deleteUser.optionalMsg}
                  onChange={(e) =>
                    setDeleteField("optionalMsg", e.target.value)
                  }
                  required
                ></textarea>
              </div>
              <div className="">
                <input
                  type="text"
                  defaultValue={user?.email}
                  className="form-textarea w-full px-2 py-1 border-0  text-blue-900"
                  hidden
                />
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
                setDeleteModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleDeleteForm(user?.email)}
              disabled={
                deleteUser.reason !== "" && deleteUser.optionalMsg !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                deleteUser.reason && deleteUser.optionalMsg
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col  my-auto"
              }`}
            >
              Delete {user?.firstName}'s Account
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Credit user modal */}
      <ModalBlank
        id="credit-modal"
        modalOpen={creditModalOpen}
        setModalOpen={setCreditModalOpen}
        click={() => {
          setCreditModalOpen(false);
          setUpdateValues({
            currency: "NGN",
            amount: 0,
            remark: "",
          });
        }}
        title={`Credit ${user?.firstName}'s Wallet`}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <CurrencyInput
                values={updateValues}
                setValues={setUpdateValues}
              />
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="remark"
                >
                  Remark
                </label>
                <textarea
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  rows="5"
                  placeholder="Enter more Information"
                  value={updateValues.remark}
                  onChange={(e) =>
                    setUpdateValues({
                      ...updateValues,
                      remark: e.target.value,
                    })
                  }
                  required
                ></textarea>
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
                setCreditModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleCredit(user?.id)}
              disabled={
                updateValues.remark !== "" && updateValues.amount !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                updateValues.remark && updateValues.amount
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Credit {user?.firstName}'s Wallet
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* debit user modal */}
      <ModalBlank
        id="debit-modal"
        modalOpen={debitModalOpen}
        setModalOpen={setDebitModalOpen}
        click={() => {
          setDebitModalOpen(false);
          setDeductValues({
            currency: "NGN",
            amount: 0,
            remark: "",
          });
        }}
        title={`Debit ${user?.firstName}'s Wallet`}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <CurrencyInput
                values={deductValues}
                setValues={setDeductValues}
              />
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="remark"
                >
                  Remark
                </label>
                <textarea
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  rows="5"
                  placeholder="Enter more Information"
                  value={deductValues.remark}
                  onChange={(e) =>
                    setDeductValues({
                      ...deductValues,
                      remark: e.target.value,
                    })
                  }
                  required
                ></textarea>
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
                setDebitModalOpen(false);
                setDeductValues({
                  currency: "NGN",
                  amount: 0,
                  remark: "",
                });
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleDebit(user?.id)}
              disabled={
                deductValues.remark !== "" && deductValues.amount !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                deductValues.remark && deductValues.amount
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Debit {user?.firstName}'s Wallet
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Update User Modal */}
      <ModalBlank
        title="Update User's Name"
        modalOpen={updateOpen}
        setModalOpen={setUpdateOpen}
        click={() => {
          setUpdateOpen(false);
          setNewFirstName("");
          setNewLastName("");
        }}
      >
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="userName"
                >
                  First Name
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="u"
                >
                  Last Name
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              {/* <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="u"
                >
                  Last Name
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div> */}
            </div>
          </form>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap justify-between w-full">
            <button
              className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setUpdateOpen(false);
                setNewFirstName("");
                setNewLastName("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleChangeName(user?.id)}
              disabled={
                newFirstName !== "" && newLastName !== "" ? false : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                newFirstName && newLastName
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Update Name
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* transfer limit modal */}
      <ModalBlank
        id="transferlimit-modal"
        modalOpen={updateOpen1}
        setModalOpen={setUpdateOpen1}
        click={() => {
          setUpdateOpen1(false);
          setTransferAmount("");
          setTransferCurrency("");
          setTransferLimitType("");
        }}
        title="Update Transfer Limit"
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
                  Transfer Limit
                </label>

                <select
                  value={transferLimitType}
                  onChange={(e) => setTransferLimitType(e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value="">---Select Limit Type---</option>
                  <option value="INSTANT">Instant Limit</option>
                  <option value="DAILY">Daily Limit</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="currency"
                >
                  Currency
                </label>
                <select
                  value={transferCurrency}
                  onChange={(e) => setTransferCurrency(e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value="">---Select Currency---</option>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  {/* <option value="GHS">GHS</option>
                  <option value="GHS">GBP</option>
                  <option value="ZMW">ZMW</option> */}
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="optionalMsg"
                >
                  Transfer Amount
                </label>
                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  onChange={(e) => {
                    setTransferAmount(e.target.value);
                  }}
                  id="transferAmount"
                  name="transferAmount"
                  value={transferAmount}
                  required
                ></input>
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
                setUpdateOpen1(false);
                setTransferAmount("");
                setTransferCurrency("");
                setTransferLimitType("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => updateTransferLimit(user?.id)}
              disabled={
                transferLimitType !== "" &&
                transferCurrency !== "" &&
                transferAmount !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                transferLimitType && transferCurrency && transferAmount
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Update Transfer Limit
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* withdrawal limit modal */}
      <ModalBlank
        id="transferlimit-modal"
        modalOpen={updateOpen2}
        setModalOpen={setUpdateOpen2}
        click={() => {
          setUpdateOpen1(false);
          setWithdrawalAmount("");
          setWithdrawalCurrency("");
          setWithdrawalLimitType("");
        }}
        title="Update Withdrawal Limit"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="currency"
                >
                  Transfer Limit
                </label>

                <select
                  value={withdrawalLimitType}
                  onChange={(e) => setWithdrawalLimitType(e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value="">---Select Limit Type---</option>
                  <option value="INSTANT">Instant Limit</option>
                  <option value="DAILY">Daily Limit</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="currency"
                >
                  Currency
                </label>
                <select
                  value={withdrawalCurrency}
                  onChange={(e) => setWithdrawalCurrency(e.target.value)}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value="">---Select Currency---</option>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  {/* <option value="GHS">GHS</option>
                  <option value="GHS">GBP</option>
                  <option value="ZMW">ZMW</option> */}
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="optionalMsg"
                >
                  Withdrawal Amount
                </label>
                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  onChange={(e) => {
                    setWithdrawalAmount(e.target.value);
                  }}
                  id="withdrawalAmount"
                  name="withdrawalAmount"
                  value={withdrawalAmount}
                  required
                ></input>
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
                setUpdateOpen2(false);
                setWithdrawalAmount("");
                setWithdrawalCurrency("");
                setWithdrawalLimitType("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => updateWithdrawalLimit(user?.id)}
              disabled={
                withdrawalLimitType !== "" &&
                withdrawalCurrency !== "" &&
                withdrawalAmount !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                withdrawalLimitType && withdrawalCurrency && withdrawalAmount
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Update Withdrawal Limit
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Kyc Approval Modal */}
      <ModalBlank
        id="kyc-modal"
        modalOpen={kycApproveModalOpen}
        setModalOpen={setKycApproveModalOpen}
        click={() => {
          setStatus("");
          setKycApproveModalOpen(false);
        }}
        title="Approve Level 2 KYC"
      >
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <Image
                  style={{ maxWidth: "100%" }}
                  src={user?.KycPictureURL}
                  fallback={empty}
                />
              </div>
            </div>
            {user?.KycPictureURL ? (
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
                setStatus("");
                setKycApproveModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleApproveKYC(user?.id)}
              disabled={status !== "" ? false : true}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                status
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              {status ? status : "Lv 2 KYC"}
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Kyc Document Modal */}
      <ModalBlank
        id="kyc-modal"
        modalOpen={kycDocModalOpen}
        setModalOpen={setKycDocModalOpen}
        click={() => {
          setKycDocModalOpen(false);
        }}
        title="View KYC Document"
      >
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <Image
                  style={{ maxWidth: "100%" }}
                  src={user?.KycPictureURL}
                  fallback={empty}
                />
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
                setKycDocModalOpen(false);
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* accept stripe T & C modal */}
      <ModalBlank
        title="Approve T & C."
        id="tc-modal"
        click={() => {
          setCardID("");
          setTCModal(false);
        }}
        modalOpen={tcModal}
        setModalOpen={setTCModal}
      >
        <div className="px-5 py-4">
          {/* <form> */}
          <div className="space-y-3">
            <div>
              <label
                className="block text-sm font-medium mb-1 text-blue-900"
                htmlFor="optionalMsg"
              >
                Account ID
              </label>
              <input
                className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                value={cardID}
                placeholder="Enter card ID."
                type="email"
                id="email-address"
                name="amount"
                required
                onChange={(e) => setCardID(e.target.value)}
              />
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-1 py-4 w-full">
            <div className="flex flex-wrap justify-between w-full">
              <button
                className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardID("");
                  setTCModal(false);
                }}
              >
                Go Back
              </button>
              <button
                type="submit"
                onClick={() => handleTC(user?.email)}
                disabled={cardID !== "" ? false : true}
                className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                  cardID
                    ? " bg-blue-900 text-white hover:bg-blue-950"
                    : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
                }`}
              >
                Approve
              </button>
            </div>
          </div>
          {/* </form> */}
        </div>
      </ModalBlank>

      {/* Create stripe account Number */}
      <ModalBlank
        title="Stripe treasury Account Number"
        id="SAN-modal"
        modalOpen={saModal}
        setModalOpen={setSAModal}
        click={() => {
          setSAModal(false);
        }}
      >
        <div className="px-5 py-4">
          {/* <form> */}
          <div className="space-y-3">
            <div>
              <label
                className="block text-sm font-medium mb-1 text-blue-900"
                htmlFor="optionalMsg"
              >
                Account Email
              </label>
              <input
                className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                defaultValue={user?.email}
                disabled
                placeholder="Enter card ID."
                type="email"
                id="email-address"
                name="amount"
                required
              ></input>
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-1 py-4 w-full">
            <div className="flex flex-wrap justify-between w-full">
              <button
                className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
                onClick={(e) => {
                  e.stopPropagation();
                  setSAModal(false);
                }}
              >
                Go Back
              </button>
              <button
                type="submit"
                onClick={() => handleCreateTreasuryAccountNumber(user?.email)}
                className="btn-sm border-blue-600 h-16 w-1/2 flex flex-col
                   bg-blue-900 text-white hover:bg-blue-950"
              >
                Approve
              </button>
            </div>
          </div>
          {/* </form> */}
        </div>
      </ModalBlank>

      {/* Admin Activities modal */}
      <AdminModal
        title={`Admin Activities on ${user?.firstName}'s Account.`}
        id="admin-modal"
        modalOpen={adminActModal}
        setModalOpen={setAdminActModal}
        click={() => {
          setAdminActModal(false);
        }}
      >
        <div className="px-5 py-4">
          <Table
            // loading={customers?.loading}
            columns={columns}
            dataSource={user?.lockActivities}
            rowkey={(record) => record.id}
            pagination={{
              current: pageNumber,
              total: user?.lockActivities?.length,
              pageSize: 10,
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
      </AdminModal>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  fetchSingleUser: (userId) => {
    dispatch(fetchSingleUser(userId));
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  customers: state.customers,
  admin: state.admin,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsMain);
