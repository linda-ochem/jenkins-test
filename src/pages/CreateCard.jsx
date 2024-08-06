import React, { useState } from "react";
import ModalBlank from "../partials/actions/ModalBlank";
import { Modal, message } from "antd";
import { createCardHolderADMINTemporary } from "../actions";
import { ExclamationCircleFilled } from "@ant-design/icons";

export const CreateFoundersCard = () => {
  const [open, setOpen] = useState(false);

  const [userfirstName, setUserfirstName] = useState("");
  const [userlastName, setUserlastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [limit, setLimit] = useState("");
  const [cardTypes, setCardTypes] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [billingAddressLine1, setBillingAddress] = useState("");
  const [billingAddressCity, setBillingAddressCity] = useState("");
  const [billingAddressState, setBillingAddressState] = useState("");
  const [billingAddressPostalCode, setBillingAddressPostalCode] = useState("");

  const handleCreateCard = async () => {
    Modal.confirm({
      title: " Are you sure you want to create this card?",
      onOk: async () => {
        try {
          let approval = localStorage.getItem("firstName");
          const { data } = await createCardHolderADMINTemporary(
            cardPin,
            businessName,
            userfirstName,
            userlastName,
            email,
            limit,
            cardTypes,
            phoneNumber,
            approval,
            billingAddressLine1,
            billingAddressCity,
            billingAddressState,
            billingAddressPostalCode
          );
          message.success(data.message);
          setOpen(false);
          window.location.reload();
        } catch (error) {
          message.error("Could not complete the request");
          // console.log(error);
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
      content: "If you continue you will create a card",
    });
  };

  return (
    <div>
      <div className="m-1.5">
        <button
          className="btn border-slate-200 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <svg
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
          </svg>
          <span className="ml-2">Create Founders' Card</span>
        </button>
      </div>

      {/* create card modal */}
      <ModalBlank
        id="cardcreate-modal"
        modalOpen={open}
        setModalOpen={setOpen}
        Click={(e) => {
          e.stopPropagation();
          setOpen(false);
          setCardTypes("");
          setBillingAddress("");
          setBillingAddressCity("");
        }}
        title="Create Founders' Card"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label htmlFor="providusAccountNumber" className="sr-only">
                  Select Type
                </label>
                <select
                  value={cardTypes}
                  onChange={(e) => setCardTypes(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    cardTypes ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="Physical">Physical Card</option>
                  <option value="Virtual">Virtual Card</option>
                </select>
              </div>
              {cardTypes === "Physical" ? (
                <>
                  <div className="flex justify-between gap-5">
                    <div className="w-full">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Enter Billing Address"
                        value={billingAddressLine1}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressLine1 ? "bg-blue-100" : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address City
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Enter Billing Address City"
                        value={billingAddressCity}
                        onChange={(e) => setBillingAddressCity(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressCity ? "bg-blue-100" : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between gap-5">
                    <div className="w-full">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address State
                      </label>
                      <input
                        type="text"
                        name="billingAddressState"
                        placeholder="Enter Billing Address State"
                        value={billingAddressState}
                        onChange={(e) => setBillingAddressState(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressState ? "bg-blue-100" : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address Postal Code
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Enter Billing Address"
                        value={billingAddressPostalCode}
                        onChange={(e) =>
                          setBillingAddressPostalCode(e.target.value)
                        }
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressPostalCode
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="flex justify-between gap-5">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="cardtype"
                  >
                    User's Firstname
                  </label>
                  <input
                    type="text"
                    name="userFirstName"
                    placeholder="First Name"
                    value={userfirstName}
                    onChange={(e) => setUserfirstName(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      userfirstName ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="currentrate"
                  >
                    User's Lastname
                  </label>
                  <input
                    type="text"
                    name="userLastName"
                    placeholder="Last Name"
                    value={userlastName}
                    onChange={(e) => setUserlastName(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      userlastName ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between gap-5">
                <div className="w-full">
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
                </div>

                <div className="w-full">
                  <label
                    htmlFor="providusAccountNumber"
                    className="block text-sm font-medium mb-1 text-blue-900"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter Amount"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      businessName ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between gap-5">
                <div className="w-full">
                  <label
                    htmlFor="providusAccountNumber"
                    className="block text-sm font-medium mb-1 text-blue-900"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter Amount"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      phoneNumber ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="providusAccountNumber"
                    className="block text-sm font-medium mb-1 text-blue-900"
                  >
                    Card PIN
                  </label>
                  <input
                    type="text"
                    name="cardPin"
                    placeholder="Enter Card PIN"
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      cardPin ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="providusAccountNumber"
                  className="block text-sm font-medium mb-1 text-blue-900"
                >
                  Limit
                </label>
                <input
                  type="text"
                  name="limit"
                  placeholder="Set Limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    limit ? "bg-blue-100" : "bg-transparent"
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
          <div className="flex flex-wrap justify-between w-full gap-5">
            <button
              className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleCreateCard()}
              disabled={
                email !== "" &&
                userlastName !== "" &&
                userfirstName !== "" &&
                cardPin !== "" &&
                cardTypes !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                email && cardPin && userfirstName && userlastName && cardTypes
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Create Card
            </button>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

export const CreateCheckbookCard = () => {
  const [open, setOpen] = useState(false);

  const [userfirstName, setUserfirstName] = useState("");
  const [userlastName, setUserlastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [limit, setLimit] = useState("");
  const [cardTypes, setCardTypes] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [billingAddressLine1, setBillingAddress] = useState("");
  const [billingAddressCity, setBillingAddressCity] = useState("");
  const [billingAddressState, setBillingAddressState] = useState("");
  const [billingAddressPostalCode, setBillingAddressPostalCode] = useState("");

  const handleCreateCard = async () => {
    Modal.confirm({
      title: " Are you sure you want to create a checkbook card?",
      onOk: async () => {
        try {
          let approval = localStorage.getItem("firstName");
          const { data } = await createCardHolderADMINTemporary(
            cardPin,
            businessName,
            userfirstName,
            userlastName,
            email,
            limit,
            cardTypes,
            phoneNumber,
            approval,
            billingAddressLine1,
            billingAddressCity,
            billingAddressState,
            billingAddressPostalCode
          );
          message.success(data.message);
          setOpen(false);
          window.location.reload();
        } catch (error) {
          message.error("Could not complete the request");
          setOpen(false);
          // console.log(error);
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
      content: "If you continue you will create a card",
    });
  };

  return (
    <div>
      <div className="m-1.5">
        <button
          className="btn border-slate-200 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <svg
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
          </svg>
          <span className="ml-2">Create Founders' Card</span>
        </button>
      </div>

      {/* create card modal */}
      <ModalBlank
        id="cardcreate-modal"
        modalOpen={open}
        setModalOpen={setOpen}
        title="Create Card"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label htmlFor="providusAccountNumber" className="sr-only">
                  Select Type
                </label>
                <select
                  value={cardTypes}
                  onChange={(e) => setCardTypes(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    cardTypes ? "bg-blue-100" : "bg-transparent"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="Physical">Physical Card</option>
                  <option value="Virtual">Virtual Card</option>
                </select>
              </div>
              {cardTypes === "Physical" ? (
                <>
                  <div className="flex justify-between ">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Enter Billing Address"
                        value={billingAddressLine1}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressLine1 ? "bg-blue-100" : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address City
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Enter Billing Address City"
                        value={billingAddressCity}
                        onChange={(e) => setBillingAddressCity(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressCity ? "bg-blue-100" : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between ">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address State
                      </label>
                      <input
                        type="text"
                        name="billingAddressState"
                        placeholder="Enter Billing Address State"
                        value={billingAddressState}
                        onChange={(e) => setBillingAddressState(e.target.value)}
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressState ? "bg-blue-100" : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 text-blue-900"
                        htmlFor="currentrate"
                      >
                        Billing Address Postal Code
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Enter Billing Address"
                        value={billingAddressPostalCode}
                        onChange={(e) =>
                          setBillingAddressPostalCode(e.target.value)
                        }
                        className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                          billingAddressPostalCode
                            ? "bg-blue-100"
                            : "bg-transparent"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="flex justify-between ">
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="cardtype"
                  >
                    User's Firstname
                  </label>
                  <input
                    type="text"
                    name="userFirstName"
                    placeholder="First Name"
                    value={userfirstName}
                    onChange={(e) => setUserfirstName(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      userfirstName ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1 text-blue-900"
                    htmlFor="currentrate"
                  >
                    User's Lastname
                  </label>
                  <input
                    type="text"
                    name="userLastName"
                    placeholder="Last Name"
                    value={userlastName}
                    onChange={(e) => setUserlastName(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      userlastName ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between ">
                <div>
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
                </div>

                <div>
                  <label
                    htmlFor="providusAccountNumber"
                    className="block text-sm font-medium mb-1 text-blue-900"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter Amount"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      businessName ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between ">
                <div>
                  <label
                    htmlFor="providusAccountNumber"
                    className="block text-sm font-medium mb-1 text-blue-900"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter Amount"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      phoneNumber ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="providusAccountNumber"
                    className="block text-sm font-medium mb-1 text-blue-900"
                  >
                    Card PIN
                  </label>
                  <input
                    type="text"
                    name="cardPin"
                    placeholder="Enter Card PIN"
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value)}
                    className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                      cardPin ? "bg-blue-100" : "bg-transparent"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="providusAccountNumber"
                  className="block text-sm font-medium mb-1 text-blue-900"
                >
                  Limit
                </label>
                <input
                  type="text"
                  name="limit"
                  placeholder="Set Limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    limit ? "bg-blue-100" : "bg-transparent"
                  }`}
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
              className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={() => handleCreateCard()}
              disabled={
                email !== "" &&
                userlastName !== "" &&
                userfirstName !== "" &&
                cardPin !== "" &&
                cardTypes !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                email && cardPin && userfirstName && userlastName && cardTypes
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Create Card
            </button>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

export const KycUpload = (props) => {
  // console.log("KycUpload", props);

  // const handleUpload = (e) => {
  //   const file = e.target.files[0];

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const base64String = reader.result;
  //     setFrontPicture(base64String);
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  // console.log(frontPicture);

  return (
    <div>
      <div>
        <button
          className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
          onClick={(e) => {
            e.preventDefault();
            props.setOpen(true);
          }}
        >
          <span className="ml-2">Upload KYC Image</span>
        </button>
      </div>

      {/* Upload Image modal */}
      <ModalBlank
        id="uploadimage-modal"
        modalOpen={props.open}
        setModalOpen={props.setOpen}
        title="Upload KYC Image"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <div className="space-y-3">
            <div className="flex justify-between ">
              <div className="w-full">
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  KYC Image
                </label>
                <input
                  type="file"
                  name="frontPicture"
                  placeholder="Upload Image"
                  accept="image/*"
                  onChange={props.handleUpload}
                  className={`form-input w-full h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    props.frontPicture ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 w-full">
          <div className="flex flex-wrap justify-between w-full">
            <button
              className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.preventDefault();
                props.setOpen(false);
              }}
            >
              Close
            </button>
            <button
              onClick={props.onClick}
              disabled={props.frontPicture === null}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                props.frontPicture
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

export const KycApprove = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div>
        <button
          className="btn bg-blue-100 border-blue-900 py-1 hover:border-white hover:text-white hover:bg-blue-900 text-slate-600 cursor-pointer mr-5"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <span className="ml-2">Upload KYC Image</span>
        </button>
      </div>

      {/* Limit Modal */}
      <ModalBasic
        id="kycapprove-modal"
        modalOpen={open}
        setModalOpen={setOpen}
        title="Approve KYC "
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
                  <option value="NAIRA_KOBO">NAIRA_KOBO</option>
                  <option value="USD_CENT">USD_CENT</option>
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
                  type="number"
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
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleSubmitLimit}
              // loading={loading}
              disabled={
                limitCurrency !== "" && limitAmount !== "" ? false : true
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
