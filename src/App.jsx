import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./css/style.css";

import "./charts/ChartjsConfig";

import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import routes from "./routes";
import Logon from "./pages/Logon";
import { connect, useDispatch } from "react-redux";
import FoundersCardWaitlist from "./pages/FoundersCardWaitlist";
import PhysicalCardWaitlist from "./pages/PhysicalCardWaitlist";
import ExchangeRates from "./partials/tabcomponents/ExchangeRates";
import Updates from "./pages/Updates";
import UserUpdate from "./pages/UserUpdate";
import PendingAcctNumber from "./pages/PendingAcctNumber";
import PaymentHistories from "./pages/PaymentHistories";
import FboTransactions from "./pages/FboTransactions";
import AdminPanel from "./pages/AdminPanel";
import Referals from "./pages/Referals";
// import RefBonusWithdrawal from "./partials/tabcomponents/RefBonusWithdrawal";
// import Referrers from "./partials/tabcomponents/Referrers";
import Providers from "./partials/tabcomponents/Providers";
import PendingKYC from "./pages/PendingKYC";
import WithdrawalRequests from "./pages/WithdrawalRequests";
import CardTab from "./pages/CardTab";
import ElementUsers from "./pages/ElementUsers";
import IdleTimeout from "./utils/IdleTimer";
import { Logout } from "./redux/auth/auth.actions";
import UpdatePassword from "./pages/UpdatePassword";
import SafelockTabs from "./pages/SafelockTabs";
import RatesAndLimits from "./pages/RatesAndLimits";
import { AdminModal } from "./partials/actions/ModalBlank";
import axios from "axios";
import { message } from "antd";
import Sidebar from "./partials/Sidebar";
import UserDetailsMain from "./pages/UserDetailsMain";
import ElementUserDetailsMain from "./pages/ElementUserDetailsMain";
import ConnectedAccounts from "./pages/ConnectedAccounts";
import ElementDashboard from "./pages/ElementDashboard";
import { UserDetails } from "./pages/UserDetails";
import { UserSafelockDetails } from "./pages/UserSafelockDetails";
import Pathways from "./pages/Pathways";
import PetitionHome from "./pages/PetitionHome";
import STVHome from "./pages/STVHome";
import MigrationFees from "./pages/MigrationFees";
import ElementTransactionsTab from "./pages/ElementTransactionsTab";
import ElementPendingKYC from "./pages/ElementPendingKYC";
import { PetitionFiles } from "./pages/PetitionFiles";
const config = {
  cors: "https://cors-anywhere.herokuapp.com/",
  formUrl:
    "https://docs.google.com/forms/d/1Gvip-jiXP-FK_LXSQLXdbxu781FEzM_f-3f-o0uLlco/formResponse",
};

function App(props) {
  const {
    auth: { user },
  } = props;
  // console.log(user);
  const Role = user?.data?.data?.role?.title;
  // const Role = "finance-admin";

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user ? user.data?.data?.fullName : "",
    role: Role,
    observation: "",
    frontPicture: null,
    thoughts: "",
  });

  var ids = [
    "275674196",
    "500981336",
    "364319452",
    // "1945515386",
    "765373460",
    "713045706",
  ];

  const setInput = (e) => {
    const name = e.target.name;
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  // console.log(Role);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  const handleLogout = () => {
    dispatch(Logout());
  };

  const handleTimeout = () => {
    handleLogout();
  };

  // console.log(user)

  // console.log("Role:", Role);
  //docs.google.com/forms/d/e/1FAIpQLSc0GhXyTMnEHicbmD9HERjBOo6v9ElgvsXEiYhJqlxd-QTRcA/viewform?usp=pp_url&entry.275674196=Nicholas+Bassey&entry.500981336=Super+Admin&entry.364319452=Great+One&entry.713045706=qwertyuiopoiuytretyu

  var submit = async () => {
    const formData = new FormData();
    var list = Object.keys(formData);
    for (var key in formData) {
      const value = Array.isArray(formData[key])
        ? JSON.stringify(formData[key])
        : formData[key];
      // eslint-disable-next-line
      value.label
        ? formData.append(
            // eslint-disable-next-line
            `entry.${
              ids[
                // eslint-disable-next-line
                list.findIndex(function (item) {
                  return item === key;
                })
              ]
            }`,
            value.label
          )
        : formData.append(
            `entry.${
              ids[
                // eslint-disable-next-line
                list.findIndex(function (item) {
                  return item === key;
                })
              ]
            }`,
            value
          );
    }

    await axios({
      url: `${config.formUrl}`,
      method: "post",
      data: formData,
      responseType: "json",
    })
      .then((res) => {
        message.success("Response received. Thank you!");
        setOpen(false);
      })
      .catch((err) => {
        message.success("Response received. Thank you!");
        setOpen(false);
      });
  };

  return (
    <div className="App">
      {user && (
        <>
          <p className="w-full bg-blue-900 h-[50px] text-white flex justify-center items-center gap-5">
            Hello 👋, Do you have any feedback or concerns about the admin
            dashboard?. Kindly click the button to notify us.
            <span>
              <button
                className="border border-white px-6 py-2 rounded-md hover:bg-white  hover:text-blue-900 hover:font-bold"
                onClick={() => setOpen(true)}
              >
                Notify Us
              </button>
            </span>
          </p>

          <IdleTimeout
            timeout={250000}
            warningTime={30000}
            onTimeout={handleTimeout}
          />
        </>
      )}
      <Routes>
        <Route element={<Logon />} path={routes.logon} />
        <Route element={<UpdatePassword />} path={routes.update_password} />
        {user && (
          <>
            <Route
              element={<Dashboard Role={Role} />}
              path={routes.dashboard}
            />
            <Route
              element={<ElementDashboard Role={Role} />}
              path={routes.element_overview}
            />
            <Route element={<Sidebar Role={Role} />} />
            <Route element={<Updates />} path={routes.app_updates} />
            <Route
              element={<PaymentHistories Role={Role} />}
              path={routes.payment_histories}
            />
            <Route element={<Pathways Role={Role} />} path={routes.pathways} />
            <Route
              element={<MigrationFees />}
              path={routes.migration_payment}
            />
            <Route
              element={<PetitionHome Role={Role} />}
              path={routes.petition_submissions}
            />
            <Route
              element={<STVHome Role={Role} />}
              path={routes.stv_payments}
            />
            <Route
              element={<PetitionFiles Role={Role} />}
              path={routes.petition_files}
            />
            {Role === "super-admin" && (
              <>
                <Route
                  element={<FboTransactions />}
                  path={routes.fbo_transactions}
                />
                <Route element={<RatesAndLimits />} path={routes.limits} />
                <Route
                  element={<FoundersCardWaitlist />}
                  path={routes.founders_waitlist}
                />
                <Route element={<AdminPanel />} path={routes.admin_panel} />
              </>
            )}

            {(Role === "super-admin" ||
              Role === "admin" ||
              Role === "fraud-admin" ||
              Role === "finance-admin") && (
              <>
                <Route
                  element={<UserUpdate Role={Role} />}
                  path={routes.user_updates}
                />
                <Route
                  element={<UserDetailsMain Role={Role} />}
                  path={routes.single_user}
                />
                <Route
                  element={<UserDetails Role={Role} />}
                  path={routes.individual_user}
                />
                <Route
                  element={<CardTab Role={Role} user={user} />}
                  path={routes.card_tab}
                />
                <Route element={<ElementUsers />} path={routes.element_users} />
                <Route
                  element={<ElementPendingKYC Role={Role} />}
                  path={routes.element_pending_kyc}
                />
                <Route
                  element={<ElementTransactionsTab Role={Role} />}
                  path={routes.element_transactions}
                />
                <Route
                  element={<ConnectedAccounts />}
                  path={routes.connected_accounts}
                />
                <Route
                  element={<ElementUserDetailsMain Role={Role} />}
                  path={routes.single_elementuser}
                />
                <Route
                  element={<PendingAcctNumber Role={Role} />}
                  path={routes.pendingacct_requests}
                />
                <Route
                  element={<PendingKYC Role={Role} />}
                  path={routes.pending_kyc}
                />
                <Route
                  element={<Providers Role={Role} />}
                  path={routes.providers}
                />
                <Route
                  element={<PhysicalCardWaitlist Role={Role} />}
                  path={routes.physical_waitlist}
                />
                <Route
                  element={<ExchangeRates />}
                  path={routes.exchange_rates}
                />
                <Route
                  element={<FboTransactions />}
                  path={routes.fbo_transactions}
                />

                <Route
                  element={<SafelockTabs Role={Role} />}
                  path={routes.safelock}
                />
                <Route
                  element={<UserSafelockDetails Role={Role} />}
                  path={routes.individual_user_savings_details}
                />
                <Route
                  element={<WithdrawalRequests Role={Role} />}
                  path={routes.withdrawal_requests}
                />
                <Route
                  element={<Referals Role={Role} />}
                  path={routes.referrals}
                />
              </>
            )}
          </>
        )}
        <Route element={<PageNotFound />} path={routes["*"]} />
      </Routes>

      {/* Complaints form */}
      <AdminModal
        id="complaint-modal"
        modalOpen={open}
        setModalOpen={setOpen}
        click={() => {
          setOpen(false);
          setFormData({
            observation: "",
            thoughts: "",
            frontPicture: null,
          });
        }}
        title="FeedBack/Complaints Form"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="userName"
                >
                  Full Name
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  name="fullName"
                  defaultValue={user ? user.data?.data?.fullName : ""}
                  disabled
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="u"
                >
                  Role
                </label>

                <input
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  name="role"
                  defaultValue={Role}
                  required
                  disabled
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="u"
                >
                  What are your observations about the Admin Dashboard?
                </label>

                <textarea
                  type="text"
                  name="observation"
                  rows={5}
                  placeholder="Type here..."
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  value={formData.observation}
                  onChange={setInput}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Upload Evidence / Screenshot of challenges encountered{" "}
                  <span className="text-sm">Max of 10MB</span>
                </label>
                <input
                  type="file"
                  name="frontPicture"
                  placeholder="Upload Image"
                  accept="image/*"
                  // value={formData.frontPicture}
                  onChange={setInput}
                  className={`form-input w-full px-2 h-12 cursor-pointer bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    formData.frontPicture ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="u"
                >
                  Kindly share your thoughts on whatever you feel can make the
                  Admin Dashboard better (based on what you use the Admin
                  Dashboard for)
                </label>

                <textarea
                  type="text"
                  name="thoughts"
                  rows={5}
                  className="form-textarea w-full px-2 py-1 border border-blue-950  text-blue-900"
                  placeholder="Type here"
                  value={formData.thoughts}
                  onChange={setInput}
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap justify-between w-full">
            <button
              className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setFormData({
                  observation: "",
                  thoughts: "",
                  frontPicture: null,
                });
              }}
            >
              Close
            </button>
            <button
              type="submit"
              onClick={() => submit()}
              disabled={
                formData.observation !== "" && formData.thoughts !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                formData.observation && formData.thoughts
                  ? " bg-blue-900 text-white hover:bg-blue-950"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(App);
