import {
  getProfile2,
  getUserWallet,
} from "../actions";
import { useEffect } from "react";
import { useState } from "react";
import { Spin, message, Table } from "antd";
import { toWholeCurrency } from "../helpers";
import { useNavigate, useParams } from "react-router-dom";
import InnerSavingsTab from "./InnerSavingsTab";
// import SingleUserTransactions from "../partials/adminDashboard/usertable/SingleUserTransactions";
// import ModalBlank from "../partials/actions/ModalBlank";

export const UserSafelockDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // console.log(id);
  const [wallets, setWallets] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const userId = id;
  console.log("userId: ", userId);

  const fetchUser = async (userId) => {
    setLoading(true);
    try {
      const response = await getProfile2(userId);
      // console.log("profile: ", response.data);
      setUser(response.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Sorry, Couldn't fetch customer's details. Pls Try again later"
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

  useEffect(() => {
    userId ? fetchUser(userId) : () => ({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    userId ? fetchUserWallets(userId) : () => ({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // const fetchUserSafeLockTransactions = async () => {
  //   try {
  //     (async () => {
  //       setLoading(true);
  //       const response1 = await getIndividualSavingsTransactions(
  //         userId,PageNumber
  //       );
  //       // console.log(response1);
  //       setDataSource(response1.data);
  //       setTotal(response1.pagination.total);
  //       setLoading(false);
  //     })();
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   userId ? fetchUserSafeLockTransactions(userId, PageNumber) : () => ({});

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userId, PageNumber]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center ">
          <Spin />
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
            <form>
              <section>
                <div className="flex justify-between">
                  <h2 className="text-xl leading-snug text-blue-950 font-bold mb-1">
                    {user?.firstName}'s Details
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
                      defaultValue={`${user?.firstName} ${user?.lastName}`}
                      disabled
                    />
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
                        user?.verificationType ? user?.verificationType : "N/A"
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
          </div>

          <section>
            <InnerSavingsTab user={user} userId={userId} />
          </section>
        </>
      )}
    </>
  );
};
