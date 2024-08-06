import adminTypes from "./admin.types";

const INITIAL_STATE = {
  totals: null,
  loading: false,
  error: null,
  isModalOpen: false,
  virtualtransactions: null,
  physicalwaitlist: null,
  virtualwaitlist: null,
  globalgeng: null,
  allcards: null,
  allcountries: null,
  founders: null,
  pendingacctreq: null,
  withdrawalreq: null,
  transactions: null,
  billspaymentTransactions: null,
  conctAccts: null,
  petitions: null,
  stv: null,
};

const adminReducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case adminTypes.FETCH_TOTALS_START:
    case adminTypes.VIRTUAL_CARD_WAITLIST_START:
    case adminTypes.GLOBALGENG_CARD_START:
    case adminTypes.CARD_TRANSACTIONS_START:
    case adminTypes.GET_TRANSACTIONS_START:
    case adminTypes.GET_BILLS_TRANSACTIONS_START:
    case adminTypes.FETCH_COUNTRIES_START:
    case adminTypes.FOUNDERS_CARD_USERS_START:
    case adminTypes.FETCH_ALL_PENDING_ACCT_REQ_START:
    case adminTypes.FETCH_ALL_PETITION_REQ_START:
    case adminTypes.FETCH_ALL_STV_REQ_START:
    case adminTypes.FETCH_ALL_WITHDRWL_REQ_START:
    case adminTypes.GET_CONNECTED_ACCOUNT_START:
      return {
        ...state,
        loading: true,
      };

    case adminTypes.GET_CONNECTED_ACCOUNT_SUCCESS:
      return {
        ...state,
        conctAccts: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FETCH_TOTALS_SUCCESS:
      return {
        ...state,
        totals: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FETCH_ALL_PENDING_ACCT_REQ_SUCCESS:
      return {
        ...state,
        pendingacctreq: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FETCH_ALL_PETITION_REQ_SUCCESS:
      return {
        ...state,
        petitions: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FETCH_ALL_STV_REQ_SUCCESS:
      return {
        ...state,
        stv: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FETCH_ALL_WITHDRWL_REQ_SUCCESS:
      return {
        ...state,
        withdrawalreq: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FOUNDERS_CARD_USERS_SUCCESS:
      return {
        ...state,
        founders: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.GET_BILLS_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        billspaymentTransactions: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        allcountries: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.VIRTUAL_CARD_WAITLIST_SUCCESS:
      return {
        ...state,
        virtualwaitlist: action.payload,
        loading: false,
        error: null,
      };
    case adminTypes.GLOBALGENG_CARD_SUCCESS:
      return {
        ...state,
        globalgeng: action.payload,
        loading: false,
        error: null,
      };

    case adminTypes.FETCH_TOTALS_FAILED:
    case adminTypes.VIRTUAL_CARD_WAITLIST_FAILED:
    case adminTypes.GLOBALGENG_CARD_FAILED:
    case adminTypes.CARD_TRANSACTIONS_FAILED:
    case adminTypes.GET_TRANSACTIONS_FAILED:
    case adminTypes.GET_BILLS_TRANSACTIONS_FAILED:
    case adminTypes.FETCH_COUNTRIES_FAILED:
    case adminTypes.FOUNDERS_CARD_USERS_FAILED:
    case adminTypes.FETCH_ALL_PENDING_ACCT_REQ_FAILED:
    case adminTypes.FETCH_ALL_PETITION_REQ_FAILED:
    case adminTypes.FETCH_ALL_STV_REQ_FAILED:
    case adminTypes.FETCH_ALL_WITHDRWL_REQ_FAILED:
    case adminTypes.GET_CONNECTED_ACCOUNT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case adminTypes.SEARCH_CARD_TRANSACTION_START:
      return {
        ...state,
        loading: true,
      };
    case adminTypes.SEARCH_CARD_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        virtualtransactions: action.payload,
        error: null,
      };
    case adminTypes.SEARCH_CARD_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        virtualtransactions: null,
        error: action.payload,
      };

    case adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_START:
      return {
        ...state,
        loading: true,
        verification: null,
      };
    case adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        virtualtransactions: action.payload,
      };
    case adminTypes.CARD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        allcards: action.payload,
      };
    case adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default adminReducer;
