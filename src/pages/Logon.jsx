import { useState, useEffect } from "react";
import logo from "../images/Vesti logo.svg";
import { Modal, Spin } from "antd";
import PinInput from "react-pin-input";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { LoginUser, VerifyOtp, ResendOtp } from "../redux/auth/auth.actions";
import authTypes from "../redux/auth/auth.types";

const Logon = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const adminId = useSelector((state) => state.auth?.user?.data?.data?.id);
  // console.log(adminId);

  const setField = (field, data) => setAuthData({ ...authData, [field]: data });

  useEffect(() => {
    window.addEventListener(
      "beforeunload",
      dispatch({ type: authTypes.MODAL_CLOSE })
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        dispatch({ type: authTypes.MODAL_CLOSE })
      );
    };
  }, []);

  // console.log(props);

  const closeModal = () => {
    dispatch({ type: authTypes.MODAL_CLOSE });
  };

  const handleSubmit = async (e) => {
    const { email, password } = authData;
    e.preventDefault();
    props.LoginUser(email, password, navigate);
  };

  const Send2FACodeFunction = async (value) => {
    props.VerifyOtp(value, adminId, navigate);
  };

  const Resend2FACodeFunction = async () => {
    props.ResendOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src={logo} alt="Workflow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            Sign in to your account
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          action="#"
          method="POST"
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                onChange={(e) => {
                  setField("email", e.target.value);
                }}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-800 focus:border-blue-800 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                onChange={(e) => {
                  setField("password", e.target.value);
                }}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-800 focus:border-blue-800 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
              {props.auth.loading ? (
                <Spin className="opt_spinner" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
      {props.auth.isModalOpen && (
        <Modal
          title=""
          open={props.auth.isModalOpen}
          onCancel={closeModal}
          // onCancel={() => {}}
          footer={false}
          className="modal_style rounded-md"
          maskClosable={false}
        >
          <h6 className="otp_header text-center text-emerald-900 font-semibold">
            Just One More Step.
          </h6>
          <p className="otp_text text-center text-emerald-900">
            2FA OTP has been sent to {props.auth.user.data.data.email}.
          </p>
          <div className="flex justify-center flex-row">
            <div className="flex justify-center flex-col">
              <PinInput
                length={6}
                initialValue=""
                secret
                onChange={(value, index) => {}}
                type="numeric"
                inputMode="number"
                style={{ padding: "6px" }}
                inputStyle={{ borderColor: "green" }}
                inputFocusStyle={{ borderColor: "green" }}
                onComplete={(value, index) => {
                  Send2FACodeFunction(value);
                }}
                autoSelect={true}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              />
              <div className="flex text-center justify-center">
                {props.auth.loading ? <Spin className="opt_spinner" /> : ""}
              </div>
            </div>
          </div>
          <p
            className="text-center font-semibold text-blue-900  cursor-pointer"
            onClick={Resend2FACodeFunction}
          >
            Didn't get the OTP ?{" "}
            <span className=" font-bold text-green-600">Resend OTP</span>
          </p>
        </Modal>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  LoginUser: (data, navigate) => dispatch(LoginUser(data, navigate)),
  VerifyOtp: (value, adminId, navigate) =>
    dispatch(VerifyOtp(value, adminId, navigate)),
  ResendOtp: () => dispatch(ResendOtp()),
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, mapDispatchToProps)(Logon);
