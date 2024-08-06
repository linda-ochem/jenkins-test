import { message } from "antd";
import {
  getElementProfiles2,
  getProfile2,
  // getProfiles,
  getProfiles2,
  getSingleTransactions2,
  getTransactionHistory,
  searchAnyUser,
} from "../../actions";
import customersTypes from "./customers.types";

export const fetchAllUsers =
  (page, searchQuery, userId) => async (dispatch) => {
    dispatch({ type: customersTypes.FETCH_USERS_START });
    try {
      // const res = await getProfiles(page, searchTerm);
      const res = await getProfiles2(page, searchQuery, userId);
      dispatch({ type: customersTypes.FETCH_USERS_SUCCESS, payload: res });
      // console.log(res);
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: customersTypes.FETCH_USERS_FAILED,
          paylaod: "No internet connection",
        });
        message.error("Pls check your network");
      } else {
        dispatch({
          type: customersTypes.FETCH_USERS_FAILED,
          paylaod: error.response,
        });
      }
    }
  };

export const fetchSingleUser = (userId) => async (dispatch) => {
  dispatch({ type: customersTypes.FETCH_USER_START });
  try {
    const res = await getProfile2(userId);
    console.log(res);
    dispatch({ type: customersTypes.FETCH_USER_SUCCESS, payload: res });
  } catch (error) {
    if (error.message === "Network Error") {
      dispatch({
        type: customersTypes.FETCH_USER_FAILED,
        paylaod: "No internet connection",
      });
      message.error("Pls check your network");
    } else {
      dispatch({
        type: customersTypes.FETCH_USER_FAILED,
        paylaod: error.response,
      });
    }
  }
};

export const fetchAllElementUsers =
  (page, searchQuery, userId) => async (dispatch) => {
    dispatch({ type: customersTypes.FETCH_USERS_START });
    try {
      const res = await getElementProfiles2(page, searchQuery, userId);
      console.log(res);
      dispatch({ type: customersTypes.FETCH_USERS_SUCCESS, payload: res });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: customersTypes.FETCH_USERS_FAILED,
          paylaod: "No internet connection",
        });
        message.error("Pls check your network");
      } else {
        dispatch({
          type: customersTypes.FETCH_USERS_FAILED,
          paylaod: error.response,
        });
      }
    }
  };

export const searchUser = (page, searchQuery) => async (dispatch) => {
  dispatch({ type: customersTypes.SEARCH_USER_START });
  try {
    const res = await searchAnyUser(page, searchQuery);
    dispatch({ type: customersTypes.SEARCH_USER_SUCCESS, payload: res });
  } catch (error) {
    if (error.response?.data) {
      dispatch({ type: customersTypes.SEARCH_USER_FAILED, payload: error });
      message.error(error.response?.data.message);
    } else {
      dispatch({ type: customersTypes.SEARCH_USER_FAILED, payload: error });
    }
  }
};

export const getSingleUserTransactions =
  (userId, page, searchQuery) => async (dispatch) => {
    dispatch({ type: customersTypes.FETCH_USER_TRANSACTIONS_START });
    try {
      const transactions = await getSingleTransactions2(
        userId,
        page,
        searchQuery
      );
      dispatch({
        type: customersTypes.FETCH_USER_TRANSACTIONS_SUCCESS,
        payload: transactions,
      });
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({
          type: customersTypes.FETCH_USER_TRANSACTIONS_FAILED,
          paylaod: "No internet connection",
        });
      } else {
        dispatch({
          type: customersTypes.FETCH_USER_TRANSACTIONS_FAILED,
          paylaod: error.message,
        });
      }
    }
  };
