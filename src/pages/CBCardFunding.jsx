import React, { useState } from "react";
import ModalBlank from "../partials/actions/ModalBlank";
import { Modal, message } from "antd";
import { FundTyCard, virtualCardDebit } from "../actions";
import { ExclamationCircleFilled } from "@ant-design/icons";

const CBCardFunding = (props) => {
  // console.log(props)
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState("");
  // const [email, setEmail] = useState("");
  // const [description, setDescription] = useState("");
  const [cardActionType, setCardActionType] = useState("");

  const handlefund = async () => {
    Modal.confirm({
      title: " Are you sure you want to fund this card?",
      onOk: async () => {
        // console.log("Type : ", cardActionType);
        try {
          const res = await FundTyCard(props.cardId, amount * 100);
          // console.log(res);
          message.success(res.data?.message);
          setAmount("");
          setCardActionType("");
          setOpen(false);
        } catch (error) {
          message.error(`${error.response?.data?.message}`);
          setOpen(false);
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
      content: "If you continue you will Fund this user's card",
    });
  };

  // const handlefund = async () => {
  //   Modal.confirm({
  //     title: " Are you sure you want to fund this card?",
  //     onOk: async () => {
  //       console.log("Type : ", cardActionType);
  //       let amountInCent = amount * 100;
  //       let fundingDescription = description;
  //       try {
  //         const res = await FundCBCard(amountInCent, email, fundingDescription);
  //         console.log(res);
  //         message.success("Card funded successfully");
  //         setOpen(false);
  //       } catch (error) {
  //         message.error(`${error.response?.data?.message}`);
  //         setOpen(false);
  //       }
  //     },
  //     onCancel: () => {
  //       console.log("cancelled");
  //     },
  //     okText: "Yes",
  //     okButtonProps: {
  //       style: {
  //         backgroundColor: "#1E3A8A",
  //       },
  //     },
  //     cancelText: "No",
  //     icon: <ExclamationCircleFilled />,
  //     content: "If you continue you will Fund this user's card",
  //   });
  // };

  const handleLiquidate = async () => {
    Modal.confirm({
      title: " Are you sure you want to debit this card?",
      onOk: async () => {
        // console.log("type : ", cardActionType);
        try {
          const { data } = await virtualCardDebit(props.cardId, amount * 100);
          message.success(data.message);
          setAmount("");
          setCardActionType("");
          setOpen(faalse);
        } catch (error) {
          message.error(`${error.response?.data?.message}`);
          setOpen(false);
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
      content: "If you continue you will debit this user's card",
    });
  };

  return (
    <div>
      <div className="m-1.5">
        <button
          className="btn border-slate-200 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-slate-500 shrink-0 hover:text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              className="hover:text-white"
            />
          </svg> */}
          <span className="ml-2">Fund/Debit Card</span>
        </button>
      </div>

      {/* fund card modal */}
      <ModalBlank
        id="cardfund-modal"
        modalOpen={open}
        setModalOpen={setOpen}
        click={() => {
          setOpen(false);
          setAmount("");
        }}
        title={cardActionType === "LiquidateCard" ? "Debit Card" : "Fund Card"}
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label htmlFor="fundVirtualcard" className="sr-only">
                  Select Type
                </label>
                <select
                  value={cardActionType}
                  onChange={(e) => setCardActionType(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    cardActionType ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="fund">Fund Card</option>
                  <option value="LiquidateCard">Debit Card</option>
                </select>
              </div>
              {/* <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    email ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div> */}

              <div>
                <label
                  htmlFor="providusAccountNumber"
                  className="block text-sm font-medium mb-1 text-blue-900"
                >
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    amount ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              {/* <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    description ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div> */}
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
                setAmount("");
                // setEmail("");
                // setDescription("");
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={cardActionType === "fund" ? handlefund : handleLiquidate}
              disabled={
                // email !== "" &&
                amount !== "" &&
                // description !== "" &&
                cardActionType !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                amount && cardActionType
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col my-auto"
              }`}
            >
              {cardActionType === "LiquidateCard" ? "Debit Card" : "Fund Card"}
            </button>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

export default CBCardFunding;
