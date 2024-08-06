import {
  Resend2FACode,
  Send2FACode,
  login,
  updatePassword,
} from "../../actions";
import routes from "../../routes";
import AuthTypes from "./auth.types";
import { Modal, message } from "antd";

export const LoginUser = (email, password) => async (dispatch) => {
  dispatch({ type: AuthTypes.LOGIN_USER_START });
  try {
    const loginData = await login(email, password);
    // console.log(loginData);
    localStorage.setItem("token", loginData.data?.token);
    localStorage.setItem("role", loginData.data?.data?.role?.title);
    dispatch({ type: AuthTypes.LOGIN_USER_SUCCESS, payload: loginData });
    if (loginData.data.data.twoFactorAuthentication) {
      dispatch({
        type: AuthTypes.MODAL_OPEN,
      });
    }
  } catch (error) {
    if (!error.response?.data.message) {
      dispatch({ type: AuthTypes.LOGIN_USER_FAILED, payload: error });
      Modal.error({
        title: "Error",
        content: `${error.message}, Please check your internet connection`,
        centered: true,
        okType: "danger",
        onOk: () => {
          console.log("OK");
        },
      });
    } else dispatch({ type: AuthTypes.LOGIN_USER_FAILED, payload: error });
    Modal.error({
      title: "Error",
      content: `${error.response?.data?.message}`,
      centered: true,
      okType: "danger",
      onOk: () => {
        console.log("OK");
      },
    });
  }
};

export const VerifyOtp = (code, adminId, navigate) => async (dispatch) => {
  const Role = localStorage.getItem("role");
  dispatch({ type: AuthTypes.OTP_VERIFICATION_START });
  try {
    const res = await Send2FACode(code, adminId);
    // console.log(res);
    dispatch({ type: AuthTypes.OTP_VERIFICATION_SUCCESS, payload: res });
    // console.log(res);
    if (Role === "legal-officer") {
      navigate(routes.pathways, { replace: true });
    }
    if (Role !== "legal-officer") {
      navigate(routes.dashboard, { replace: true });
    }
  } catch (error) {
    dispatch({ type: AuthTypes.OTP_VERIFICATION_FAILED, payload: error });
    Modal.error({
      title: "Invalid OTP",
      content: `${error.response?.data.message}`,
      centered: true,
      onOk: () => {
        console.log("OK");
      },
    });
  }
};

export const ResendOtp = () => async (dispatch) => {
  dispatch({ type: AuthTypes.OTP_VERIFICATION_START });
  try {
    const res = await Resend2FACode();
    dispatch({ type: AuthTypes.OTP_VERIFICATION_SUCCESS, payload: res });
    message.success(res?.data?.message);
  } catch (error) {
    dispatch({ type: AuthTypes.OTP_VERIFICATION_FAILED, payload: error });
    message.error(`${error.response?.data.message}`);
  }
};

export const Logout = () => async (dispatch) => {
  localStorage.clear();
  dispatch({ type: AuthTypes.LOGOUT_USER });
  window.location.replace(routes.logon);
};

export const UpDatePassword =
  (adminId, password, confirmPassword, navigate) => async (dispatch) => {
    dispatch({ type: AuthTypes.PASSWORD_UPDATE_START });
    try {
      const res = await updatePassword(adminId, password, confirmPassword);
      dispatch({ type: AuthTypes.PASSWORD_UPDATE_SUCCESS, payload: res });
      message.success(res?.message);
      navigate(routes.logon, { replace: true });
    } catch (error) {
      dispatch({ type: AuthTypes.PASSWORD_UPDATE_FAILED, payload: error });
      console.log(error);
      if (error.response?.data.message) {
        Modal.error({
          title: "Error",
          content: `${error.response?.data.message}`,
          centered: true,
          okType: "danger",
          onOk: () => {
            console.log("OK");
          },
        });
      } else
        Modal.error({
          title: "Error",
          content: ` Please check your internet connection`,
          centered: true,
          okType: "danger",
          onOk: () => {
            console.log("OK");
          },
        });
    }
  };
