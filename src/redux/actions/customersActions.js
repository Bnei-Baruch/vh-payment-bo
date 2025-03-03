import _ from "lodash";

import { ApiCustomers } from "../api/customersApi";
import {
  FETCH_ACTIVITY_FAILED,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_SPECIALS_FAILED,
  FETCH_SPECIALS_SUCCESS,
  GET_CURRENT_PAYMENT_FAILED,
  GET_CURRENT_PAYMENT_SUCCESS,
  GET_ORDERS_FAILED,
  GET_ORDERS_SUCCESS,
  GET_PAYMENTS_FAILED,
  GET_PAYMENTS_SUCCESS,
  SAVE_MERGE_DETAILS,
  SEARCH_CUSTOMERS_FAILED,
  SEARCH_CUSTOMERS_SUCCESS,
  SET_CUSTOMERS_LOADING,
} from "../constants";
import { ACTIVE_DUE } from "../../constants/specials";

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
  return async (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });

    try {
      const activity = await ApiCustomers.getActivity(limit, counter);

      dispatch({
        type: FETCH_ACTIVITY_SUCCESS,
        payload: {
          list: activity.data,
          totalCount: activity.totalCount,
        },
      });
    } catch (e) {
      console.log("FETCH_ACTIVITY_FAILED", e);
      dispatch({ type: FETCH_ACTIVITY_FAILED });
    } finally {
      dispatch({ type: SET_CUSTOMERS_LOADING, payload: false });
    }
  };
};

export const getCustomerOrders = (email) => {
  return async (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });

    try {
      const orders = await ApiCustomers.getOrders(email);

      dispatch({
        type: GET_ORDERS_SUCCESS,
        payload: orders.data,
      });
    } catch (e) {
      console.log("GET_ORDERS_FAILED", e);
      dispatch({ type: GET_ORDERS_FAILED });
    } finally {
      dispatch({ type: SET_CUSTOMERS_LOADING, payload: false });
    }
  };
};

export const getCustomerPayments = (email) => {
  return async (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });

    try {
      const payments = await ApiCustomers.getPayments(email);
      dispatch({
        type: GET_PAYMENTS_SUCCESS,
        payload: payments.data,
      });
    } catch (e) {
      console.log("GET_PAYMENTS_FAILED", e);
      dispatch({ type: GET_PAYMENTS_FAILED });
    } finally {
      dispatch({ type: SET_CUSTOMERS_LOADING, payload: false });
    }
  };
};

export const cancelMembership = (id, callback) => {
  return async (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });

    try {
      await ApiCustomers.cancelMembership(id);

      callback();
    } catch (e) {
      console.log("Cancel Membership failed", e);
    } finally {
      dispatch({ type: SET_CUSTOMERS_LOADING, payload: false });
    }
  };
};

export const getAccountForMerge = (keycloak_id) => {
  return async (dispatch) => {
    dispatch({ type: SAVE_MERGE_DETAILS, payload: { loading: true } });
    try {
      const fromAccount = await ApiCustomers.getCustomerDetails(keycloak_id);

      dispatch({
        type: SAVE_MERGE_DETAILS,
        payload: { fromAccount, loading: false },
      });
    } catch (e) {
      console.log("Failed to get account for merge", e);
      dispatch({
        type: SAVE_MERGE_DETAILS,
        payload: { fromAccount: null, loading: false },
      });
    }
  };
};

export const offlinePayment = (payload, callback) => {
  return async () => {
    try {
      await ApiCustomers.offlinePayment(payload);

      callback();
    } catch (e) {
      console.log("Offline payment failed", e);
    }
  };
};

export const fetchSpecials = () => {
  return async (dispatch) => {
    dispatch({ type: SET_CUSTOMERS_LOADING, payload: true });

    try {
      const specials = await ApiCustomers.getSpecials();
      dispatch({
        type: FETCH_SPECIALS_SUCCESS,
        payload: {
          list: specials.data ?? [],
          totalCount: specials.totalCount,
        },
      });
    } catch (e) {
      console.log("FETCH_SPECIALS_FAILED", e);
      dispatch({ type: FETCH_SPECIALS_FAILED });
    } finally {
      dispatch({ type: SET_CUSTOMERS_LOADING, payload: false });
    }
  };
};

export const addSpecialEntry = (payload, callback) => {
  return async (dispatch) => {
    try {
      await ApiCustomers.addSpecialEntry(payload);

      dispatch(fetchSpecials());
      callback();
    } catch (e) {
      console.log("Create new entry failed", e);
    }
  };
};

export const removeSpecialEntry = (id, callback) => {
  return async (dispatch) => {
    try {
      await ApiCustomers.removeSpecialEntry(id);

      dispatch(fetchSpecials());
      callback();
    } catch (e) {
      console.log("Failed to delete entry", e);
    }
  };
};

export const searchSpecials = (query, type) => {
  return async (dispatch) => {
    try {
      if (!query.length) {
        dispatch(fetchSpecials());
        return;
      }

      const result = await ApiCustomers.searchSpecials(type, query);

      dispatch({
        type: FETCH_SPECIALS_SUCCESS,
        payload: { list: result?.data ?? [] },
      });
    } catch (e) {
      console.log("Search failed", e);
      dispatch({ type: FETCH_SPECIALS_FAILED });
    }
  };
};

export const mergeAccounts = (
  source_keycloak_id,
  destination_keycloak_id,
  onSuccess,
  onFailed
) => {
  return async (dispatch) => {
    dispatch({ type: SAVE_MERGE_DETAILS, payload: { loading: true } });
    try {
      await ApiCustomers.mergeAccounts({
        source_keycloak_id,
        destination_keycloak_id,
      });

      onSuccess();
    } catch (e) {
      console.log("Failed to merge accounts", e);
      onFailed();
    } finally {
      dispatch({
        type: SAVE_MERGE_DETAILS,
        payload: { loading: false },
      });
    }
  };
};

export const updateCustomerInfo = (payload, keycloakId, onSuccess) => {
  return async () => {
    try {
      await ApiCustomers.updatePersonalInfo(payload, keycloakId);

      onSuccess();
    } catch (e) {
      console.log("Failed to update customer info", e);
    }
  };
};

export const getMembershipInfo = (keycloakId) => {
  return async (dispatch) => {
    try {
      const info = await ApiCustomers.fetchMembershipInfo(keycloakId);

      if (!info?.data?.active) {
        dispatch({ type: GET_CURRENT_PAYMENT_FAILED });
        return;
      }

      const activeDue = getActiveDue(info?.data?.details);

      dispatch({
        type: GET_CURRENT_PAYMENT_SUCCESS,
        payload: { ...info.data, activeDue },
      });
    } catch (e) {
      console.log("Failed to fetch membership info", e);
      dispatch({ type: GET_CURRENT_PAYMENT_FAILED });
    }
  };
};

export const updateOfflinePayment = (payload, callback) => {
  return async () => {
    try {
      await ApiCustomers.updateOfflinePayment(payload);

      callback();
    } catch (e) {
      console.log("Failed to update online payment", e);
    }
  };
};

const getActiveDue = (details) => {
  const { payment, special, help_haver } = details;

  if (payment?.payment_type === "offline") {
    return ACTIVE_DUE.OFFLINE_PAYMENT;
  }

  if (!_.isEmpty(payment) && payment?.payment_type !== "offline") {
    return ACTIVE_DUE.REGULAR;
  }

  if (_.isEmpty(payment) && !_.isEmpty(special)) {
    return ACTIVE_DUE.SPECIALS;
  }

  if (_.isEmpty(payment) && !_.isEmpty(help_haver)) {
    return ACTIVE_DUE.GRANTS;
  }
};

export const removeSpecialForUser = (keycloakId, callback) => {
  return async (dispatch) => {
    try {
      await ApiCustomers.removeSpecialByKeycloakId(keycloakId);

      dispatch(getMembershipInfo(keycloakId));
      callback();
    } catch (e) {
      console.log("Failed to delete entry", e);
    }
  };
};

export const getComments = (pageId, keycloakId, callback) => {
  return async () => {
    try {
      const data = await ApiCustomers.fetchComments(pageId, keycloakId);

      callback(data);
    } catch (e) {
      callback([]);
      console.log("Failed to fetch comments", e);
    }
  };
};

export const addComment = (page_id, page_keycloak_id, content, callback) => {
  return async () => {
    try {
      await ApiCustomers.addComment({ page_id, page_keycloak_id, content });

      callback();
    } catch (e) {
      console.log("Failed to create comment", e);
    }
  };
};

export const removeCommentById = (id, callback) => {
  return async () => {
    try {
      await ApiCustomers.removeCommentById(id);

      callback();
    } catch (e) {
      console.log("Failed to delete comment", e);
    }
  };
};
