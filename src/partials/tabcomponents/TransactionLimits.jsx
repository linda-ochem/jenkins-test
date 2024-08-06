import React, { useState } from "react";
import { AppUpdateCard } from "../adminDashboard/adminAnalytics/DashboardCard";
import ModalBasic from "../actions/ModalBasic";
import { updateNairaLimit } from "../../actions";
import { message } from "antd";
import { connect } from "react-redux";

const TransactionLimits = () => {
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitCurrency, setLimitCurrency] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const openLimitModal = (e) => {
    e.stopPropagation();
    setLimitModalOpen(true);
  };

  const handleSubmitLimit = async (e) => {
    e.preventDefault();
    const data = { limitAmount, limitCurrency };
    // console.log(data);
    // message.success("New Limit Updated Successfully!");
    try {
      setLoading(true);
      let data;
      switch (limitCurrency) {
        case "NGN":
          data = await updateNairaLimit({
            limitAmountInCent: limitAmount * 100,
          });
          setLimitModalOpen(false);
          break;
        case "USD":
          message.info("Coming soon.");
          setLimitModalOpen(false);
          break;
        default:
          setLoading(false);
          message.error("invalid currency type");
          setLimitModalOpen(false);
          break;
      }
      setLoading(false);
      message.success(data.data.message);
      setLimitModalOpen(false);
    } catch (error) {
      message.error("Unsuccessful, Please try again!");
      setLimitModalOpen(false);
    }
  };

  return (
    <div>
      <main>
        {/* Cards */}
        <div className="grid grid-cols-12 gap-6 py-8">
          <AppUpdateCard
            title="Withdrawal Limits"
            linkName="Update Limits"
            handleClick={openLimitModal}
          />
        </div>
      </main>

      {/* Limit Modal */}
      <ModalBasic
        id="limit-modal"
        modalOpen={limitModalOpen}
        setModalOpen={setLimitModalOpen}
        title="Update Withdrawal Limits"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form onSubmit={handleSubmitLimit}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-900">
                  Currency
                </label>
                <select
                  className="w-full rounded text-blue-900 border border-blue-900 hover:border-blue-900"
                  onChange={(e) => {
                    setLimitCurrency(e.target.value);
                  }}
                  value={limitCurrency}
                >
                  <option value="">Select Currency</option>
                  <option value="NGN">NAIRA</option>
                  <option value="USD">USD</option>
                  <option value="GHS">GHS</option>
                  <option value="GBP">GBP</option>
                  <option value="ZMW">ZMW</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="country"
                >
                  Limit Amount
                </label>
                <input
                  name="limitAmount"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  className="form-input w-full px-2 py-1 h-12 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900"
                  type="text"
                  required
                />
              </div>
            </div>
          </form>
        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 w-full">
          <div className="flex flex-wrap justify-between w-full">
            <button
              className="btn-sm font-semibold border-blue-600 rounded hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setTopicModalOpen(false);
                setLimitCurrency("");
                setLimitAmount("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleSubmitLimit}
              loading={loading}
              disabled={
                (limitCurrency !== "" && limitAmount !== "") || loading
                  ? false
                  : true
              }
              className={`btn-sm rounded font-semibold text-white h-16 w-1/2 ${
                limitAmount && limitCurrency
                  ? " bg-blue-950 hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update Limit
            </button>
          </div>
        </div>
      </ModalBasic>
    </div>
  );
};

const mapStatesToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStatesToProps)(TransactionLimits);
