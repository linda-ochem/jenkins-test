import { useState, useEffect } from "react";
import logo from "../images/Vesti logo.svg";
import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { UpDatePassword } from "../redux/auth/auth.actions";
import authTypes from "../redux/auth/auth.types";

const UpdatePassword = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authData, setAuthData] = useState({
    password: "",
    confirmPassword: "",
  });
  const setField = (field, data) => setAuthData({ ...authData, [field]: data });

  const adminId = id;

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
    const { password, confirmPassword } = authData;
    e.preventDefault();
    props.UpDatePassword(adminId, password, confirmPassword, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src={logo} alt="Workflow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            Update your password
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
                  setField("password", e.target.value);
                }}
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-800 focus:border-blue-800 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Password
              </label>
              <input
                onChange={(e) => {
                  setField("confirmPassword", e.target.value);
                }}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-800 focus:border-blue-800 focus:z-10 sm:text-sm"
                placeholder="confirmPassword"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
              {props.auth.loading ? <Spin className="opt_spinner" /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  UpDatePassword: (adminId, password, confirmPassword, navigate) =>
    dispatch(UpDatePassword(adminId, password, confirmPassword, navigate)),
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
