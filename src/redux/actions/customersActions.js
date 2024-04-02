import axios from "../../services/axios";
import { ApiCustomers } from "../api/customersApi";
import {
  FETCH_ACTIVITY_FAILED,
  FETCH_ACTIVITY_SUCCESS,
  GET_ORDERS_FAILED,
  GET_ORDERS_SUCCESS,
  GET_PAYMENTS_FAILED,
  GET_PAYMENTS_SUCCESS,
  SEARCH_CUSTOMERS_FAILED,
  SEARCH_CUSTOMERS_SUCCESS,
  SET_CUSTOMERS_LOADING,
} from "../constants";

export const searchCustomers = (query, type) => {
  return async (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });
    try {
      const result =
        type === "paramX"
          ? await ApiCustomers.searchByParamX(query)
          : await ApiCustomers.searchByEmailOrName(type, query);

      dispatch(
        type === "paramX"
          ? searchCustomers(result?.Email, "email")
          : { type: SEARCH_CUSTOMERS_SUCCESS, payload: result ?? [] }
      );
    } catch (e) {
      console.log("SEARCH_CUSTOMERS_FAILED", e);
      dispatch({ type: SEARCH_CUSTOMERS_FAILED });
    } finally {
      dispatch({ type: SET_CUSTOMERS_LOADING, payload: false });
    }
  };
};

export const fetchActivity = (limit, counter) => {
  return (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });
    axios({
      url: `/pay/payments/activities?limit=${limit}&skip=${counter}`,
      method: "get",
    })
      .then((resp) =>
        dispatch({
          type: FETCH_ACTIVITY_SUCCESS,
          payload: {
            list: resp.data,
            totalCount: resp.totalCount,
          },
        })
      )
      .catch((e) => {
        console.log("FETCH_ACTIVITY_FAILED", e);
        dispatch({ type: FETCH_ACTIVITY_FAILED });
      })
      .finally(() => dispatch({ type: SET_CUSTOMERS_LOADING, payload: false }));
  };
};

export const getCustomerOrders = (email) => {
  return (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });
    axios({
      url: `/pay/v2/orders?email=${email}&limit=200`,
      method: "get",
    })
      .then((resp) =>
        dispatch({
          type: GET_ORDERS_SUCCESS,
          payload: resp.data,
        })
      )
      .catch((e) => {
        console.log("GET_ORDERS_FAILED", e);
        dispatch({ type: GET_ORDERS_FAILED });
      })
      .finally(() => dispatch({ type: SET_CUSTOMERS_LOADING, payload: false }));
  };
};

export const getCustomerPayments = (email) => {
  return (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });
    axios({
      url: `pay/payments/all/${email}`,
      method: "get",
    })
      .then((resp) =>
        dispatch({
          type: GET_PAYMENTS_SUCCESS,
          payload: resp.data,
        })
      )
      .catch((e) => {
        console.log("GET_PAYMENTS_FAILED", e);
        dispatch({ type: GET_PAYMENTS_FAILED });
      })
      .finally(() => dispatch({ type: SET_CUSTOMERS_LOADING, payload: false }));
  };
};
