import AuthTypes from "./auth.types";

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null,
  isModalOpen: false,
  verification: null,
  update: null,
};

const authReducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case AuthTypes.LOGIN_USER_START:
    case AuthTypes.PASSWORD_UPDATE_START:
      return {
        ...state,
        loading: true,
      };

    case AuthTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case AuthTypes.PASSWORD_UPDATE_SUCCESS:
      return {
        ...state,
        update: action.payload,
        loading: false,
        error: null,
      };

    case AuthTypes.LOGIN_USER_FAILED:
    case AuthTypes.PASSWORD_UPDATE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case AuthTypes.LOGOUT_USER:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        verification: null,
        isModalOpen: false,
      };
    case AuthTypes.MODAL_OPEN:
      return {
        ...state,
        isModalOpen: true,
      };
    case AuthTypes.MODAL_CLOSE:
      return {
        ...state,
        isModalOpen: false,
      };
    case AuthTypes.OTP_VERIFICATION_START:
      return {
        ...state,
        loading: true,
        verification: null,
      };
    case AuthTypes.OTP_VERIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        verification: action.payload,
      };
    case AuthTypes.OTP_VERIFICATION_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
