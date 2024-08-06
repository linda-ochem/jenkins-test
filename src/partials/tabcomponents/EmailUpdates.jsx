import React, { useState } from "react";
import { AppUpdateCard } from "../adminDashboard/adminAnalytics/DashboardCard";
import { Modal, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ModalBlank from "../actions/ModalBlank";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../../utils/constants";
import {
  AdminSpecificEmailsToUser,
  sendBulkMail,
  sendPushNotification,
  sendSAMailingForm,
} from "../../actions";

const EmailUpdates = () => {
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [saModalOpen, setSaModalOpen] = useState(false);
  const [specificModalOpen, setSpecificModalOpen] = useState(false);
  const [pushNotification, setPushNotification] = useState({
    subject: "",
    confirmPushMsg: "",
  });
  const setPushField = (field, value) =>
    setPushNotification({ ...pushNotification, [field]: value });

  const [bulkTitle, setBulkTitle] = useState("");
  const [saMailTitle, setSaMailTitle] = useState("");

  const [userMailingFormEmail, setUserMailingFormEmail] = useState("");
  const [userMailingFormTitle, setUserMailingFormTitle] = useState("");
  const [value, setValue] = useState("");

  const openSAModal = (e) => {
    e.stopPropagation();
    setSaModalOpen(true);
  };
  const openBulkModal = (e) => {
    e.stopPropagation();
    setBulkModalOpen(true);
  };
  const openPushModal = (e) => {
    e.stopPropagation();
    setPushModalOpen(true);
  };
  const openEmailModal = (e) => {
    e.stopPropagation();
    setSpecificModalOpen(true);
  };

  const handleBulkForm = () => {
    const bulkMail = {
      confirmEmailMsg: value,
      subject: bulkTitle,
    };
    Modal.confirm({
      title: " Are you sure you want to continue?",
      onOk: async () => {
        try {
          console.log(bulkMail);
          await sendBulkMail(bulkMail);
          message.success("Success", "Info sent successfully", "success");
          setBulkTitle("");
          setValue("");
          setBulkModalOpen(false);
        } catch (error) {
          message.error("Error", "Could not send successfully", "error");
          console.log(error);
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will send bulk emails",
    });
  };

  const handleSAMailingForm = () => {
    const mailingForm = {
      confirmEmailMsg: value,
      subject: saMailTitle,
    };
    Modal.confirm({
      title: " Are you sure you want to continue?",
      onOk: async () => {
        try {
          console.log(mailingForm);
          await sendSAMailingForm(mailingForm);
          message.success("Success", "Info sent successfully", "success");
          setSaMailTitle("");
          setValue("");
          setSaModalOpen(false);
        } catch (error) {
          message.error("Error", "Could not send successfully", "error");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will send bulk emails",
    });
  };

  const handlePushForm = () => {
    Modal.confirm({
      title: " Are you sure you want to continue?",
      onOk: async () => {
        try {
          console.log(pushNotification);
          await sendPushNotification(pushNotification);
          message.success("Success", "Info sent successfully", "success");
          setPushNotification("");
          setPushModalOpen(false);
        } catch (error) {
          message.error("Error", "Could not send successfully", "error");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: "If you continue you will push notifications to all users",
    });
  };

  const handleSpecificEmailSubmit = async (e) => {
    e.preventDefault();
    let email = userMailingFormEmail;
    let title = userMailingFormTitle;
    let body = value;
    console.log("email, body, title", email, body, title);
    Modal.confirm({
      title: " Are you sure you want to continue?",
      onOk: async () => {
        try {
          await AdminSpecificEmailsToUser(email, title, body);
          message.success("Success", "Mail sent successfully", "success");
          setUserMailingFormEmail("");
          setUserMailingFormTitle("");
          setValue("");
          setSpecificModalOpen(false);
        } catch (error) {
          message.error("Error", "Could not send successfully", "error");
        }
      },
      onCancel: () => {
        console.log("cancelled");
      },
      okText: "Yes",
      cancelText: "No",
      icon: <ExclamationCircleFilled />,
      content: `If you continue you will send a mail to ${userMailingFormEmail}`,
    });
  };

  return (
    <div>
      <main>
        {/* Cards */}
        <div className="grid grid-cols-12 gap-6 py-8">
          <AppUpdateCard
            title="Bulk Email Broadcast"
            description="This information will be mailed to all users on the Vesti app"
            linkName="Send Email"
            handleClick={openBulkModal}
          />
          <AppUpdateCard
            title="Bulk Email by SA"
            description="This information will be mailed to all users in SA's mailing list."
            linkName="Send Email"
            handleClick={openSAModal}
          />
          <AppUpdateCard
            title="Push Notification"
            description="This information entered here would be sent as a push notification
              to all users."
            linkName="Send Email"
            handleClick={openPushModal}
          />
          <AppUpdateCard
            title="Email Specific.User"
            description="This allows an admin to send email to specifis users by their email."
            linkName="Send Email"
            handleClick={openEmailModal}
          />
        </div>
      </main>
      {/* bulk email modal */}
      <ModalBlank
        id="bulk-modal"
        modalOpen={bulkModalOpen}
        setModalOpen={setBulkModalOpen}
        title="Bulk Email Broadcast"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Email Title
                </label>
                <input
                  type="text"
                  name="subject"
                  value={bulkTitle}
                  onChange={(e) => setBulkTitle(e.target.value)}
                  // onChange={(e) => setBulkField("subject", e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    bulkTitle ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="description"
                >
                  Email Content
                </label>
                <ReactQuill
                  theme="snow"
                  className=" w-full py-1 bg-blue-100 border border-blue-900 h-100 text-blue-900"
                  onChange={setValue}
                  value={value}
                  modules={modules}
                  formats={formats}
                  readOnly={false}
                  preserveWhitespace
                  placeholder="Write mail here..."
                />
              </div>
            </div>
          </form>
        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 ">
          <div className="flex flex-wrap justify-between w-full gap-8">
            <button
              className="btn-sm border-blue-600 hover:border-blue-900 text-blue-900 h-16 w-5/12"
              onClick={(e) => {
                e.stopPropagation();
                setBulkModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleBulkForm}
              disabled={bulkTitle !== "" && value !== "" ? false : true}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                bulkTitle && value
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Send Email
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* SA email modal */}
      <ModalBlank
        id="SA-modal"
        modalOpen={saModalOpen}
        setModalOpen={setSaModalOpen}
        title="Bulk Email By SA"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Notification Title
                </label>
                <input
                  type="text"
                  name="saMailTitle"
                  value={saMailTitle}
                  onChange={(e) => setSaMailTitle(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    saMailTitle ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="description"
                >
                  Notification Content
                </label>
                <ReactQuill
                  theme="snow"
                  className=" w-full py-1 bg-blue-100 border border-blue-900 h-100 text-blue-900"
                  onChange={setValue}
                  value={value}
                  modules={modules}
                  formats={formats}
                  readOnly={false}
                  preserveWhitespace
                  placeholder="Type mail content here..."
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
                setPushModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleSAMailingForm}
              disabled={saMailTitle !== "" && value !== "" ? false : true}
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                saMailTitle && value
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Send Mail
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* Push notification Modal */}
      <ModalBlank
        id="push-modal"
        modalOpen={pushModalOpen}
        setModalOpen={setPushModalOpen}
        title="Push Notification"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Notification Title
                </label>
                <input
                  type="text"
                  name="subject"
                  value={pushNotification.subject}
                  onChange={(e) => setPushField("subject", e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    pushNotification.subject ? "bg-blue-100" : "bg-transparent"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="description"
                >
                  Notification Content
                </label>
                <textarea
                  name="confirmPushMsg"
                  className="form-textarea w-full px-2 py-1 bg-blue-100 border-0  text-blue-900"
                  rows="10"
                  placeholder="Type notification content here"
                  value={pushNotification.confirmPushMsg}
                  onChange={(e) =>
                    setPushField("confirmPushMsg", e.target.value)
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
                setSaModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handlePushForm}
              disabled={
                pushNotification.subject !== "" &&
                pushNotification.confirmPushMsg !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                pushNotification.subject && pushNotification.confirmPushMsg
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Send Notification
            </button>
          </div>
        </div>
      </ModalBlank>

      {/* specific user modal */}
      <ModalBlank
        id="specific-modal"
        modalOpen={specificModalOpen}
        setModalOpen={setSpecificModalOpen}
        title="Email Specific user"
      >
        {/* Modal content */}
        <div className="px-5 py-4">
          <form>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  User's Email
                </label>
                <input
                  id="email"
                  name="email"
                  className="form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900"
                  type="text"
                  value={userMailingFormEmail}
                  onChange={(e) => setUserMailingFormEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="currentrate"
                >
                  Email Title
                </label>
                <input
                  name="userMailingFormTitle"
                  value={userMailingFormTitle}
                  onChange={(e) => setUserMailingFormTitle(e.target.value)}
                  className={`form-input w-full px-2 py-1 h-12 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent border-blue-900 hover:border-blue-900 ${
                    userMailingFormTitle ? "bg-blue-100" : "bg-transparent"
                  }`}
                  type="text"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1 text-blue-900"
                  htmlFor="description"
                >
                  Notification Content
                </label>
                <ReactQuill
                  theme="snow"
                  className=" w-full py-1 bg-blue-100 border border-blue-900 h-100 text-blue-900"
                  onChange={setValue}
                  value={value}
                  modules={modules}
                  formats={formats}
                  readOnly={false}
                  preserveWhitespace
                  placeholder="Type mail content here..."
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
                setSpecificModalOpen(false);
              }}
            >
              Go Back
            </button>
            <button
              type="submit"
              onClick={handleSpecificEmailSubmit}
              disabled={
                value !== "" &&
                userMailingFormEmail !== "" &&
                userMailingFormTitle !== ""
                  ? false
                  : true
              }
              className={`btn-sm border-blue-600 h-16 w-1/2 flex flex-col ${
                value && userMailingFormEmail && userMailingFormTitle
                  ? " bg-blue-950 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed flex flex-col mx-auto my-auto"
              }`}
            >
              Send Mail
            </button>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

export default EmailUpdates;
