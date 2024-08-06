import React, { useEffect, useRef } from "react";

import logo from "../../favi.svg";
import moment from "moment";
import { toWholeCurrency } from "../../helpers";

function SingleCardTransactionPanel({
  cardTransactionPanelOpen,
  setCardTransactionPanelOpen,
  selectedItems,
}) {
  const closeBtn = useRef(null);
  const panelContent = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !cardTransactionPanelOpen ||
        panelContent.current.contains(target) ||
        closeBtn.current.contains(target)
      )
        return;
      setCardTransactionPanelOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!cardTransactionPanelOpen || keyCode !== 27) return;
      setCardTransactionPanelOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const statusColor = (status) => {
    switch (status) {
      case "SUCCESS":
      case "success":
      case "Success":
        return "bg-emerald-100 text-emerald-600";
      case "FAILED":
      case "failed":
      case "Failed":
        return "bg-rose-100 text-rose-500";
      case "FAILURE":
      case "failure":
      case "Failure":
        return "bg-rose-100 text-rose-500";
      case "PENDING":
      case "pending":
      case "Pending":
        return "bg-slate-200 text-slate-600";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  const amountColor = (type) => {
    switch (type) {
      case "WITHDRAWAL_FROM_WALLET":
        return " text-rose-800";
      case "DEPOSIT_TO_WALLET":
        return "text-emerald-600";
      case "BILL_PAYMENT":
        return " text-rose-800";
      case "DEBIT_FROM_WALLET":
        return "text-rose-800";
      case "NEW_CARD_CREATION":
        return "text-rose-800";
      default:
        return " text-slate-500";
    }
  };

  const getSign = (type) => {
    switch (type) {
      case "WITHDRAWAL_FROM_WALLET":
        return " - ";
      case "DEPOSIT_TO_WALLET":
        return " + ";
      case "BILL_PAYMENT":
        return " - ";
      case "DEBIT_FROM_WALLET":
        return " - ";
      case "NEW_CARD_CREATION":
        return " - ";
      default:
        return " ";
    }
  };

  return (
    <div
      ref={panelContent}
      className={`fixed inset-0 sm:left-auto z-20 shadow-xl transition-transform duration-200 ease-in-out ${
        cardTransactionPanelOpen ? "translate-x-" : "translate-x-full"
      }`}
    >
      <div className="sticky top-16 bg-slate-50 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-l border-slate-200 w-full sm:w-[390px] h-[calc(100vh-64px)]">
        <button
          ref={closeBtn}
          onClick={() => setCardTransactionPanelOpen(false)}
          className="absolute top-0 right-0 mt-6 mr-6 group p-2"
        >
          <svg
            className="w-4 h-4 fill-slate-400 group-hover:fill-slate-600 pointer-events-none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m7.95 6.536 4.242-4.243a1 1 0 1 1 1.415 1.414L9.364 7.95l4.243 4.242a1 1 0 1 1-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 0 1-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 0 1 1.414-1.414L7.95 6.536Z" />
          </svg>
        </button>
        <div className="py-8 px-4 lg:px-8">
          <div className="max-w-sm mx-auto lg:max-w-none">
            <div className="text-blue-950 font-semibold text-center mb-1">
              Transaction Details
            </div>
            <div className="text-sm text-center italic text-blue-950">
              {selectedItems?.date
                ? selectedItems?.date
                : moment(selectedItems?.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
            </div>
            {/* Details */}
            <div className="drop-shadow-lg mt-12">
              {/* Top */}
              <div className="bg-white rounded-t-xl px-5 pb-2.5 text-center">
                <div className="mb-3 text-center">
                  <img
                    className="inline-flex w-12 h-12 rounded-full -mt-6"
                    src={logo}
                    width="48"
                    height="48"
                    alt="Vesti logo"
                  />
                </div>
                <div
                  className={`text-2xl font-semibold mb-1 ${amountColor(
                    selectedItems?.type
                  )}`}
                >
                  {getSign(selectedItems?.type)}
                  {toWholeCurrency(selectedItems?.amount)}
                </div>
                <div className="text-sm font-medium text-blue-950 mb-3">
                  Vesti Technologies
                </div>
                <div
                  className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(
                    selectedItems?.status
                      ? selectedItems?.status
                      : selectedItems?.trxStatus
                  )}`}
                >
                  {selectedItems?.status
                    ? selectedItems?.status
                    : selectedItems?.trxStatus}
                </div>
              </div>
              {/* Divider */}
              <div
                className="flex justify-between items-center"
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                </svg>
                <div className="grow w-full h-5 bg-white flex flex-col justify-center">
                  <div className="h-px w-full border-t border-dashed border-slate-200" />
                </div>
                <svg
                  className="w-5 h-5 fill-white rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                </svg>
              </div>
              {/* Bottom */}
              <div className="bg-white rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                <div className="flex justify-between space-x-1">
                  <span className="italic  text-blue-950">Description:</span>
                  <span className="font-medium text-blue-950 text-right break-all">
                    {selectedItems?.description
                      ? selectedItems?.description
                      : "description not available"}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic text-blue-950">Balance:</span>
                  <span className="font-medium text-blue-950 text-right">
                    {selectedItems?.currentBalance
                      ? selectedItems?.currency?.split("_")[0] +
                        toWholeCurrency(
                          selectedItems?.currentBalance
                        ).toString()
                      : "Not available"}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic text-blue-950">Charges:</span>
                  <span className="font-medium text-blue-950 text-right">
                    {toWholeCurrency(selectedItems.charges)}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Type</span>
                  <span className="font-medium text-blue-950 text-right">
                    {selectedItems?.type
                      ? selectedItems.type
                      : selectedItems.category}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Username</span>
                  <span className="font-medium text-blue-950 text-right">
                    {selectedItems?.user?.username}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">User ID</span>
                  <span className="font-medium text-blue-950 text-right">
                    {selectedItems?.user?.id
                      ? selectedItems?.user?.id
                      : selectedItems?.userId}
                  </span>
                </div>
                {selectedItems?.trxRef ? (
                  <div className="flex justify-between space-x-1">
                    <span className="italic text-blue-950">
                      Transaction ID:
                    </span>
                    <span className="font-medium text-blue-950 text-right">
                      {selectedItems?.trxRef}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {selectedItems?.transactionIDFromFlutterwave ? (
                  <div className="flex justify-between space-x-1">
                    <span className="italic text-blue-950">
                      Flutterwave ID:
                    </span>
                    <span className="font-medium text-blue-950 text-right">
                      {selectedItems?.transactionIDFromFlutterwave
                        ? selectedItems.transactionIDFromFlutterwave
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {selectedItems?.receiverName ? (
                  <div className="flex justify-between space-x-1">
                    <span className="italic text-blue-950">Recepient:</span>
                    <span className="font-medium text-blue-950 text-right">
                      {selectedItems?.receiverName
                        ? selectedItems.receiverName
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <div className="flex justify-between space-x-1">
                  <span className="italic  text-blue-950">Source:</span>
                  <span className="font-medium text-blue-950 text-right">
                    Vesti Wallet
                  </span>
                </div>
              </div>
            </div>
            {/* Download / Report */}
            <div className="flex items-center space-x-3 mt-6">
              <div className="w-1/2">
                <button className="btn w-full border-slate-200 hover:border-slate-300 text-blue-950">
                  <svg
                    className="w-4 h-4 fill-current text-blue-950 shrink-0 rotate-180"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 4c-.3 0-.5.1-.7.3L1.6 10 3 11.4l4-4V16h2V7.4l4 4 1.4-1.4-5.7-5.7C8.5 4.1 8.3 4 8 4ZM1 2h14V0H1v2Z" />
                  </svg>
                  <span className="ml-2">Download</span>
                </button>
              </div>
              <div className="w-1/2">
                <button className="btn w-full border-slate-200 hover:border-slate-300 text-rose-800">
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.001 3h2v4h-2V3Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM15 16a1 1 0 0 1-.6-.2L10.667 13H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1ZM2 11h9a1 1 0 0 1 .6.2L14 13V2H2v9Z" />
                  </svg>
                  <span className="ml-2">Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleCardTransactionPanel;
