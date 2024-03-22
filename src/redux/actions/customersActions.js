import axios from "../../services/axios";
import {
  FETCH_ACTIVITY_FAILED,
  FETCH_ACTIVITY_SUCCESS,
  SEARCH_CUSTOMERS_FAILED,
  SEARCH_CUSTOMERS_SUCCESS,
  SET_CUSTOMERS_LOADING,
} from "../constants";

export const searchCustomers = (email) => {
  return (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });
    axios({
      url: `/profile/v1/profiles?skip=0&limit=20&email=${email}`,
      method: "get",
    })
      .then((resp) =>
        dispatch({ type: SEARCH_CUSTOMERS_SUCCESS, payload: resp })
      )
      .catch((e) => {
        console.log("SEARCH_CUSTOMERS_FAILED", e);
        dispatch({ type: SEARCH_CUSTOMERS_FAILED });
      })
      .finally(() => dispatch({ type: SET_CUSTOMERS_LOADING, payload: false }));
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
