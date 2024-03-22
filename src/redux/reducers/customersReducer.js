import {
  FETCH_ACTIVITY_FAILED,
  FETCH_ACTIVITY_SUCCESS,
  SEARCH_CUSTOMERS_FAILED,
  SEARCH_CUSTOMERS_SUCCESS,
  SET_CUSTOMERS_LOADING,
} from "../constants";

const INITIAL_STATE = {
  loading: false,
  searchResult: [],
  activity: {
    list: [],
    totalCount: 0,
  },
};

export default function reducer(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case SEARCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        searchResult: actions.payload,
      };

    case SEARCH_CUSTOMERS_FAILED:
      return {
        ...state,
        searchResult: INITIAL_STATE.searchResult,
      };

    case SET_CUSTOMERS_LOADING:
      return {
        ...state,
        loading: actions.payload,
      };

    case FETCH_ACTIVITY_SUCCESS:
      return {
        ...state,
        activity: actions.payload,
      };

    case FETCH_ACTIVITY_FAILED:
      return {
        ...state,
        activity: INITIAL_STATE.activity,
      };

    default:
      return state;
  }
}
