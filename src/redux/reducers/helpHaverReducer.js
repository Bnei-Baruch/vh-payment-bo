import {
  SET_HELP_HAVER_LOADING,
  GET_MEMBERSHIP_REQUESTS_FAILED,
  GET_MEMBERSHIP_REQUESTS_SUCCESS,
  GET_REQUESTOR_DETAILS_SUCCESS,
  GET_REQUESTOR_DETAILS_FAILED,
} from "../constants";

const INITIAL_STATE = {
  loading: false,
  membershipGrants: [],
  membershipRequests: [],
  requestorDetails: null,
};

export default function reducer(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case SET_HELP_HAVER_LOADING:
      return {
        ...state,
        loading: actions.payload,
      };

    case GET_MEMBERSHIP_REQUESTS_SUCCESS:
      return {
        ...state,
        membershipGrants: actions.payload.grants,
        membershipRequests: actions.payload.requests,
      };

    case GET_MEMBERSHIP_REQUESTS_FAILED:
      return {
        ...state,
        membershipGrants: INITIAL_STATE.membershipGrants,
        membershipRequests: INITIAL_STATE.membershipRequests,
      };

    case GET_REQUESTOR_DETAILS_SUCCESS:
      return {
        ...state,
        requestorDetails: actions.payload,
      };

    case GET_REQUESTOR_DETAILS_FAILED:
      return {
        ...state,
        requestorDetails: INITIAL_STATE.membershipRequests,
      };
    default:
      return state;
  }
}
