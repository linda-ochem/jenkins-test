import React, { useEffect, useState } from "react";
import { AppUpdateCard } from "../adminDashboard/adminAnalytics/DashboardCard";
import ModalBasic from "../actions/ModalBasic";
import { getAllRates2, setExchangeRate } from "../../actions";
import { Spin, message } from "antd";
import { toWholeCurrency } from "../../helpers";

const ExchangeRates = () => {
  // const navigate = useNavigate();
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialRate, setInitialRate] = useState(0);
  const [Currencies, setCurrencies] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [newSelectedCurrency, setNewSelectedCurrency] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const handleCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    setSelectedCurrency(selectedCurrency);
  };

  useEffect(() => {
    setSelectedValue(Currencies[selectedCurrency] || "");
  }, [selectedCurrency, Currencies]);

  // const goBack = () => {
  //   navigate(routes.app_updates);
  // };

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await getAllRates2();
      // console.log(res)
      setCurrencies(res.data.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Unable to fetch Rates. Pls, Try again");
    }
  };

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (e, currency) => {
    e.stopPropagation();
    setNewSelectedCurrency(currency);
    setRateModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = initialRate * 100;
    const value = selectedCurrency;
    setRateModalOpen(false);
    setLoading(true);

    // Assuming setExchangeRate returns a promise
    setExchangeRate(value, amount)
      .then((res) => {
        console.log(res);
        setLoading(false);
        message.success("Exchange Rate Updated Successfully!");
        // setInitialRate("");
        // setSelectedCurrency("");
        fetchRates();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        message.error("Exchange Rate not updated!");
      });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 px-8 py-3">
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
          </div> */}
          {loading && (
            <div className="flex items-center justify-center h-screen">
              <Spin />
            </div>
          )}
          {Currencies ? (
            <>
              <div className="grid grid-cols-12 gap-6 py-8 px-8">
                <AppUpdateCard
                  title="WALLET NAIRA TO USD"
                  rate={`₦${toWholeCurrency(Currencies.usdNaira)} - $1`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "usdNaira")}
                />
                <AppUpdateCard
                  title="WALLET USD TO NAIRA"
                  rate={`$1 - ₦${toWholeCurrency(Currencies.nairaUsd)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "nairaUsd")}
                />
                <AppUpdateCard
                  title="NAIRA TO USD CARD RATE"
                  rate={`₦${toWholeCurrency(Currencies.monoCardRate)} - $1`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "monoCardRate")}
                />
                <AppUpdateCard
                  title="MERCHANT RATE (₦)"
                  rate={`₦${toWholeCurrency(Currencies.usdMerchant)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "usdMerchant")}
                />
                <AppUpdateCard
                  title="MERCHANT RATE (GH¢)"
                  rate={`GH¢${toWholeCurrency(Currencies.ghsToUsdMerchant)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "ghsToUsdMerchant")}
                />
                <AppUpdateCard
                  title="WALLET KWACHA TO USD"
                  rate={`ZMW${toWholeCurrency(Currencies.zmwToUsd)} - $1`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "zmwToUsd")}
                />
                <AppUpdateCard
                  title="MERCHANT RATE (ZMW)"
                  rate={`ZMW${toWholeCurrency(Currencies.zmwToUsdMerchant)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "zmwToUsdMerchant")}
                />
                <AppUpdateCard
                  title="CARD RATE (ZMW)"
                  rate={`ZMW${toWholeCurrency(Currencies.zmwCardRate)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "zmwCardRate")}
                />
                <AppUpdateCard
                  title="WALLET USD TO CEDIS"
                  rate={`$1 -  GH¢${toWholeCurrency(Currencies.usdToGhs)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "usdToGhs")}
                />
                <AppUpdateCard
                  title="WALLET CEDIS TO USD"
                  rate={`GH¢${toWholeCurrency(Currencies.ghsToUsd)} - $1`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "ghsToUsd")}
                />
                <AppUpdateCard
                  title="WALLET GBP TO USD"
                  rate={`£${toWholeCurrency(Currencies.gbpToUsd)} - $1`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "gbpToUsd")}
                />
                {/* <AppUpdateCard
                  title="WALLET EUR TO USD"
                  rate={`€${toWholeCurrency(Currencies.euroUsd)} - $1`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "euroUsd")}
                /> */}
                <AppUpdateCard
                  title="WALLET EUR TO NAIRA"
                  rate={`€1 - ₦${toWholeCurrency(Currencies.euroNaira)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "euroNaira")}
                />
                <AppUpdateCard
                  title="WALLET GBP TO NAIRA"
                  rate={`£1 - ₦${toWholeCurrency(Currencies.poundNaira)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "poundNaira")}
                />
                <AppUpdateCard
                  title="CARD RATE (GBP)"
                  rate={`£1 - ₦${toWholeCurrency(Currencies.gbpCardRate)}`}
                  linkName="Update Rate"
                  handleClick={(e) => openModal(e, "gbpCardRate")}
                />
              </div>
            </>
          ) : (
            ""
          )}
        </main>
      </div>
      <ModalBasic
        id="rate-modal"
        modalOpen={rateModalOpen}
        setModalOpen={setRateModalOpen}
        title="Update Exchange Rate"
        click={() => {
          setSelectedCurrency("");
          setRateModalOpen(false);
        }}
      >
        <div className="px-5 py-4">
          <form action="">
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="rateguide"
                >
                  Select Conversion Type
                </label>
                <select
                  id="rateguide"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  className="form-select h-12 w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-md border-blue-900 hover:border-blue-900 "
                >
                  <option value="">-- Select --</option>
                  {newSelectedCurrency === "nairaUsd" && (
                    <option value="usdNaira">WALLET NAIRA TO USD</option>
                  )}
                  {newSelectedCurrency === "usdMerchant" && (
                    <option value="usdMerchant">MERCHANT RATE (₦)</option>
                  )}
                  {newSelectedCurrency === "usdNaira" && (
                    <option value="nairaUsd">WALLET USD TO NAIRA</option>
                  )}
                  {newSelectedCurrency === "monoCardRate" && (
                    <option value="monoCardRate">NAIRA TO USD CARD RATE</option>
                  )}
                  {newSelectedCurrency === "ghsToUsdMerchant" && (
                    <option value="ghsToUsdMerchant">
                      MERCHANT RATE (GH¢)
                    </option>
                  )}
                  {newSelectedCurrency === "zmwToUsdMerchant" && (
                    <option value="zmwToUsdMerchant">
                      MERCHANT RATE (ZMW)
                    </option>
                  )}
                  {newSelectedCurrency === "zmwCardRate" && (
                    <option value="zmwCardRate">CARD RATE (ZMW)</option>
                  )}
                  {newSelectedCurrency === "usdToGhs" && (
                    <option value="usdToGhs">WALLET USD TO CEDIS</option>
                  )}
                  {newSelectedCurrency === "ghsToUsd" && (
                    <option value="ghsToUsd">WALLET CEDIS TO USD</option>
                  )}
                  {newSelectedCurrency === "poundUsd" && (
                    <option value="poundUsd">WALLET GBP TO USD</option>
                  )}
                  {/* {newSelectedCurrency === "euroUsd" && (
                    <option value="euroUsd">WALLET EUR TO USD</option>
                  )} */}
                  {newSelectedCurrency === "euroNaira" && (
                    <option value="euroNaira">WALLET EUR TO NAIRA</option>
                  )}
                  {newSelectedCurrency === "gbpNaira" && (
                    <option value="gbpNaira">WALLET GBP TO NAIRA</option>
                  )}
                  {newSelectedCurrency === "gbpCardRate" && (
                    <option value="gbpCardRate">CARD RATE (GBP)</option>
                  )}

                  {/* {Object.keys(Currencies).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))} */}
                </select>
              </div>
              {selectedCurrency && (
                <p className=" w-full py-2 bg-blue-100 text-center font-semibold text-blue-900 border-blue-900 hover:border-blue-900">
                  Current Exchange Rate :{`${toWholeCurrency(selectedValue)}`}
                </p>
              )}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="newrate"
                >
                  New Exchange Rate
                </label>
                <input
                  id="newRate"
                  name="newRate"
                  value={initialRate}
                  onChange={(e) => setInitialRate(e.target.value)}
                  className={`form-input border border-blue-900 hover:border-blue-900 w-full px-2 py-1 h-12 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                    initialRate ? "bg-blue-100" : "bg-transparent"
                  }`}
                  type="text"
                  required
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
                setInitialRate("");
                setSelectedCurrency("");
                setRateModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              onClick={handleSubmit}
              className="btn-sm bg-blue-950 hover:bg-blue-900 text-white h-16 w-1/2"
            >
              Update Rate
            </button>
          </div>
        </div>
      </ModalBasic>
    </div>
  );
};

export default ExchangeRates;
