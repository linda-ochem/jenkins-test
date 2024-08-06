import {
  AllFoundersCardUsers,
  fetchBulkSum,
  fetchBulkSumElement,
  fetchDailyBalance,
  fetchDailyBalanceElement,
  getAllConnected,
  getAllGlobalGengCards,
  getAllGlobalGengCards2,
  getAllPendingAccountRequests,
  getAllVirtualCardWaitlist,
  getAllWithdrawalRequests,
  getBillsPaymentTransactions2,
  getCountry,
  getPetitionRequests,
  getSTVRequests,
  getTransactions,
  getTransactions2,
  getVirtualCardConversion,
} from "../../actions";
import adminTypes from "./admin.types";

export const getAllTotalsElement = (currency) => async (dispatch) => {
  dispatch({ type: adminTypes.FETCH_TOTALS_START });
  try {
    const transactions = await fetchBulkSumElement(currency);
    dispatch({ type: adminTypes.FETCH_TOTALS_SUCCESS, payload: transactions });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.FETCH_TOTALS_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.FETCH_TOTALS_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getAllDailyTotalsElement =
  (currency, duration) => async (dispatch) => {
    dispatch({ type: adminTypes.FETCH_TOTALS_START });
    try {
      const { startDate, endDate } = calculateDates(duration);
      const transactions = await fetchDailyBalanceElement(
        currency,
        startDate,
        endDate
      );
      dispatch({
        type: adminTypes.FETCH_TOTALS_SUCCESS,
        payload: transactions,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.FETCH_TOTALS_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.FETCH_TOTALS_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllTotals = (currency) => async (dispatch) => {
  dispatch({ type: adminTypes.FETCH_TOTALS_START });
  try {
    const transactions = await fetchBulkSum(currency);
    dispatch({ type: adminTypes.FETCH_TOTALS_SUCCESS, payload: transactions });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.FETCH_TOTALS_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.FETCH_TOTALS_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getAllDailyTotals = (currency, duration) => async (dispatch) => {
  dispatch({ type: adminTypes.FETCH_TOTALS_START });
  try {
    const { startDate, endDate } = calculateDates(duration);
    const transactions = await fetchDailyBalance(currency, startDate, endDate);
    dispatch({ type: adminTypes.FETCH_TOTALS_SUCCESS, payload: transactions });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.FETCH_TOTALS_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.FETCH_TOTALS_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export function calculateDates(duration) {
  const currentDate = new Date();
  let startDate, endDate;

  switch (duration) {
    case "1month":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      );
      break;
    case "2weeks":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 14
      );
      break;
    case "1week":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      );
      break;
    default:
      throw new Error("Invalid duration");
  }

  endDate = currentDate;

  return { startDate, endDate };
}

export const getTotalVirtualCardTransactions = (page) => async (dispatch) => {
  dispatch({ type: adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_START });
  try {
    const virtualtransactions = await getVirtualCardConversion(page);
    dispatch({
      type: adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_SUCCESS,
      payload: virtualtransactions,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.TOTAL_VIRTUAL_CARD_TRANSACTIONS_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getVirtualCardWaitlist = (page) => async (dispatch) => {
  dispatch({ type: adminTypes.VIRTUAL_CARD_WAITLIST_START });
  try {
    const virtualtransactions = await getAllVirtualCardWaitlist(page);
    dispatch({
      type: adminTypes.VIRTUAL_CARD_WAITLIST_SUCCESS,
      payload: virtualtransactions,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.VIRTUAL_CARD_WAITLIST_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.VIRTUAL_CARD_WAITLIST_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getAllFoundersCardUsers = () => async (dispatch) => {
  dispatch({ type: adminTypes.FOUNDERS_CARD_USERS_START });
  try {
    const founders = await AllFoundersCardUsers();
    dispatch({
      type: adminTypes.FOUNDERS_CARD_USERS_SUCCESS,
      payload: founders,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.FOUNDERS_CARD_USERS_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.FOUNDERS_CARD_USERS_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getGlobalgeng = (pageNumber) => async (dispatch) => {
  dispatch({ type: adminTypes.GLOBALGENG_CARD_START });
  try {
    const virtualtransactions = await getAllGlobalGengCards(pageNumber);
    dispatch({
      type: adminTypes.GLOBALGENG_CARD_SUCCESS,
      payload: virtualtransactions,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.GLOBALGENG_CARD_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.GLOBALGENG_CARD_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getGlobalgeng2 =
  (
    pageNumber,
    status,
    physicalCardId,
    // userId,
    deliveryType,
    searchQuery,
    endDate,
    startDate,
    email
  ) =>
  async (dispatch) => {
    dispatch({ type: adminTypes.GLOBALGENG_CARD_START });
    try {
      const virtualtransactions = await getAllGlobalGengCards2(
        pageNumber,
        status,
        physicalCardId,
        // userId,
        deliveryType,
        searchQuery,
        endDate,
        startDate,
        email
      );
      dispatch({
        type: adminTypes.GLOBALGENG_CARD_SUCCESS,
        payload: virtualtransactions,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.GLOBALGENG_CARD_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.GLOBALGENG_CARD_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getConnectedAllAccounts = (pageNumber) => async (dispatch) => {
  dispatch({ type: adminTypes.GET_CONNECTED_ACCOUNT_START });
  try {
    const res = await getAllConnected(pageNumber);
    dispatch({
      type: adminTypes.GET_CONNECTED_ACCOUNT_SUCCESS,
      payload: res,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.GLOBALGENG_CARD_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.GET_CONNECTED_ACCOUNT_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getAllPendingAcctRequest =
  (page, status, search) => async (dispatch) => {
    dispatch({ type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_START });
    try {
      const res = await getAllPendingAccountRequests(page, status, search);
      dispatch({
        type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_SUCCESS,
        payload: res,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllPetitionsRequests =
  (page, visaType, status, search, paymentStatus, reviewStatus) =>
  async (dispatch) => {
    dispatch({ type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_START });
    try {
      const res = await getPetitionRequests(
        page,
        visaType,
        status,
        search,
        paymentStatus,
        reviewStatus
      );
      dispatch({
        type: adminTypes.FETCH_ALL_PETITION_REQ_SUCCESS,
        payload: res,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.FETCH_ALL_PETITION_REQ_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.FETCH_ALL_PETITION_REQ_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllSTVRequests =
  (page, visaType, status, search, paymentStatus, reviewStatus) =>
  async (dispatch) => {
    dispatch({ type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_START });
    try {
      const res = await getSTVRequests(
        page,
        visaType,
        status,
        search,
        paymentStatus,
        reviewStatus
      );
      dispatch({
        type: adminTypes.FETCH_ALL_STV_REQ_SUCCESS,
        payload: res,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.FETCH_ALL_STV_REQ_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.FETCH_ALL_STV_REQ_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllWithdrawalRequest =
  (
    page,
    status,
    search,
    userId,
    currency,
    accountNumber,
    trxRef,
    endDate,
    startDate
  ) =>
  async (dispatch) => {
    dispatch({ type: adminTypes.FETCH_ALL_WITHDRWL_REQ_START });
    try {
      const res = await getAllWithdrawalRequests(
        page,
        status,
        search,
        userId,
        currency,
        accountNumber,
        trxRef,
        endDate,
        startDate
      );
      dispatch({
        type: adminTypes.FETCH_ALL_WITHDRWL_REQ_SUCCESS,
        payload: res,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.FETCH_ALL_WITHDRWL_REQ_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.FETCH_ALL_PENDING_ACCT_REQ_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllCardTransactions = (page) => async (dispatch) => {
  dispatch({ type: adminTypes.CARD_TRANSACTIONS_START });
  try {
    const allcards = await getTransactions(page);
    dispatch({
      type: adminTypes.CARD_TRANSACTIONS_SUCCESS,
      payload: allcards,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.CARD_TRANSACTIONS_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.CARD_TRANSACTIONS_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const getAllTransactions =
  (page, type, searchQuery, startDate, endDate, currency, status) =>
  async (dispatch) => {
    dispatch({ type: adminTypes.GET_TRANSACTIONS_START });
    try {
      const transactions = await getTransactions2(
        page,
        type,
        searchQuery,
        startDate,
        endDate,
        currency,
        status
      );
      dispatch({
        type: adminTypes.GET_TRANSACTIONS_SUCCESS,
        payload: transactions,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.GET_TRANSACTIONS_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.GET_TRANSACTIONS_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllBillsPaymentTransactions =
  (page, type, searchQuery) => async (dispatch) => {
    dispatch({ type: adminTypes.GET_BILLS_TRANSACTIONS_START });
    try {
      const billspaymentTransactions = await getBillsPaymentTransactions2(
        page,
        type,
        searchQuery
      );
      dispatch({
        type: adminTypes.GET_BILLS_TRANSACTIONS_SUCCESS,
        payload: billspaymentTransactions,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: adminTypes.GET_BILLS_TRANSACTIONS_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: adminTypes.GET_BILLS_TRANSACTIONS_FAILED,
          paylaod: error.message,
        });
      }
    }
  };

export const getAllCountries = () => async (dispatch) => {
  dispatch({ type: adminTypes.FETCH_COUNTRIES_START });
  try {
    const allcards = await getCountry();
    dispatch({
      type: adminTypes.FETCH_COUNTRIES_SUCCESS,
      payload: allcards,
    });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: adminTypes.FETCH_COUNTRIES_FAILED,
        paylaod: "No internet connection",
      });
    } else {
      dispatch({
        type: adminTypes.FETCH_COUNTRIES_FAILED,
        paylaod: error.message,
      });
    }
  }
};

export const searchCardTransaction = (identifier) => async (dispatch) => {
  dispatch({ type: adminTypes.SEARCH_CARD_TRANSACTION_START });
  try {
    const res = await searchUserProfile(identifier);
    dispatch({
      type: adminTypes.SEARCH_CARD_TRANSACTION_SUCCESS,
      payload: res,
    });
  } catch (error) {
    if (error.response?.data) {
      dispatch({
        type: adminTypes.SEARCH_CARD_TRANSACTION_FAILED,
        payload: error,
      });
      Modal.error({
        title: "Error",
        content: `${error.response?.data.message}`,
        centered: true,
        onOk: () => {
          console.log("OK");
        },
      });
    } else {
      dispatch({
        type: adminTypes.SEARCH_CARD_TRANSACTION_FAILED,
        payload: error,
      });
      Modal.error({
        title: "Ooops!",
        content:
          "Unable to fetch user profiles at this time. Please check your network and try again",
        centered: true,
        onOk: () => {
          console.log("OK");
        },
      });
    }
  }
};
