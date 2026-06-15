import { ApiCustomers } from "../api/customersApi";
import { ApiHelpHaver } from "../api/helpHaverApi";
import {
  GET_MEMBERSHIP_REQUESTS_FAILED,
  GET_MEMBERSHIP_REQUESTS_SUCCESS,
  GET_REQUESTOR_DETAILS_SUCCESS,
  GET_REQUESTOR_DETAILS_FAILED,
  SET_HELP_HAVER_LOADING,
  FETCH_HH_REQUESTS_SUCCESS,
  FETCH_HH_REQUESTS_FAILED,
} from "../constants";

export const fetchMembershipRequests = (limit, counter, type, query) => {
  return async (dispatch) => {
    dispatch({ type: SET_HELP_HAVER_LOADING, payload: true });
    try {
      const response = await ApiHelpHaver.getMembershipRequests(
        limit,
        counter,
        type,
        query
      );

      dispatch({
        type: GET_MEMBERSHIP_REQUESTS_SUCCESS,
        payload: {
          grants: response?.data.map((i) => i.Grant),
          requests: response?.data.map((i) => i.Request),
          requestsCount: response?.totalCount,
        },
      });
    } catch (e) {
      console.log("GET_MEMBERSHIP_REQUESTS_FAILED", e);
      dispatch({ type: GET_MEMBERSHIP_REQUESTS_FAILED });
    } finally {
      dispatch({ type: SET_HELP_HAVER_LOADING, payload: false });
    }
  };
};

export const fetchRequestorDetails = (keycloak_id) => {
  return async (dispatch) => {
    try {
      const details = await ApiCustomers.getCustomerDetails(keycloak_id);

      dispatch({
        type: GET_REQUESTOR_DETAILS_SUCCESS,
        payload: details,
      });
    } catch (e) {
      console.log("GET_REQUESTOR_DETAILS_FAILED", e);
      dispatch({ type: GET_REQUESTOR_DETAILS_FAILED });
    }
  };
};

export const updateRequest = (requestId, data, callback, rowsPerPage, page) => {
  return async (dispatch) => {
    try {
      await ApiHelpHaver.updateRequest(requestId, data);
      dispatch(fetchMembershipRequests(rowsPerPage, page * rowsPerPage));
      callback();
    } catch (e) {
      console.log("Update Request Failed", e);
    }
  };
};

export const fetchHHRequests = (status, search) => {
  return async (dispatch) => {
    dispatch({ type: SET_HELP_HAVER_LOADING, payload: true });
    try {
      const result = await ApiHelpHaver.getHHRequests(status, search);
      dispatch({
        type: FETCH_HH_REQUESTS_SUCCESS,
        payload: { list: result?.data ?? [] },
      });
    } catch (e) {
      console.error("FETCH_HH_REQUESTS_FAILED", e);
      dispatch({ type: FETCH_HH_REQUESTS_FAILED });
    } finally {
      dispatch({ type: SET_HELP_HAVER_LOADING, payload: false });
    }
  };
};

export const concludeHHRequestEntry = (requestId, payload, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      await ApiHelpHaver.concludeHHRequest(requestId, payload);
      dispatch(fetchHHRequests());
      onSuccess();
    } catch (e) {
      console.error("Conclude HH request failed", e);
      if (onError) onError(e);
    }
  };
};

export const cancelHHGrantEntry = (keycloakId, callback, onError) => {
  return async (dispatch) => {
    try {
      await ApiHelpHaver.cancelHHGrant(keycloakId);
      dispatch(fetchHHRequests());
      callback();
    } catch (e) {
      console.error("Cancel HH grant failed", e);
      if (onError) onError(e);
    }
  };
};
