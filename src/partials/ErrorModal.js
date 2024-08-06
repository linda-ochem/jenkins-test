import { Modal } from "antd";
import React from "react";
import { connect } from "react-redux";

const ErrorModal = ({ isModalOpen }) => {
  return (
    <div>
      <Modal
        open={isModalOpen}
        onCancel={!isModalOpen}
        onOk={() => {
          dispatch(Logout);
        }}
      >
        <div className="">
          <p>Session Timeout</p>
          <p>Your session expired, Please log in again</p>
        </div>
      </Modal>
    </div>
  );
};

const mapStatesToProps = (state) => ({
    isModalOpen: state.isModalOpen,
})

export default connect(mapStatesToProps)(ErrorModal);
