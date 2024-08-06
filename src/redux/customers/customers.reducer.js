import customersTypes from "./customers.types";

const INITIAL_STATE = {
  singleCustomer: null,
  customers: null,
  loading: false,
  error: null,
  isModalOpen: false,
  singleusertransactions: null,
};

const customerReducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case customersTypes.FETCH_USER_START:
    case customersTypes.FETCH_USERS_START:
    case customersTypes.FETCH_USER_TRANSACTIONS_START:
      return {
        ...state,
        loading: true,
      };
    case customersTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        customers: action.payload,
        loading: false,
        error: null,
      };
    case customersTypes.FETCH_USER_SUCCESS:
      return {
        ...state,
        singleCustomer: action.payload,
        loading: false,
        error: null,
      };
    case customersTypes.FETCH_USERS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        customers: null,
      };
    case customersTypes.FETCH_USER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        singleCustomer: null,
      };
    case customersTypes.SHOW_MODAL:
      return {
        ...state,
        isModalOpen: true,
      };

    case customersTypes.SEARCH_USER_START:
      return {
        ...state,
        loading: true,
      };
    case customersTypes.SEARCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: action.payload,
        error: null,
      };
    case customersTypes.SEARCH_USER_FAILED:
      return {
        ...state,
        loading: false,
        // singleuser: null,
        customers: null,
        error: action.payload,
      };
    case customersTypes.FETCH_USER_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        singleusertransactions: action.payload,
        error: null,
      };
    case customersTypes.FETCH_USER_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        singleusertransactions: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default customerReducer;
