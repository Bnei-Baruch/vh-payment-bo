import {
  FETCH_ACTIVITY_FAILED,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_MANUAL_DISCOUNTS_FAILED,
  FETCH_MANUAL_DISCOUNTS_SUCCESS,
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

const INITIAL_STATE = {
  loading: false,
  searchResult: [],
  activity: {
    list: [],
    totalCount: 0,
  },
  orders: [],
  payments: [],
  currentPayment: {},
  merge: {
    loading: false,
    fromAccount: null,
    toAccount: null,
  },
  specials: {
    list: [],
    totalCount: 0,
  },
  manualDiscounts: {
    list: [],
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

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        orders: actions.payload,
      };

    case GET_ORDERS_FAILED:
      return {
        ...state,
        orders: INITIAL_STATE.orders,
      };

    case GET_PAYMENTS_SUCCESS:
      return {
        ...state,
        payments: actions.payload,
      };

    case GET_PAYMENTS_FAILED:
      return {
        ...state,
        payments: INITIAL_STATE.payments,
      };

    case GET_CURRENT_PAYMENT_SUCCESS:
      return {
        ...state,
        currentPayment: actions.payload,
      };

    case GET_CURRENT_PAYMENT_FAILED:
      return {
        ...state,
        currentPayment: INITIAL_STATE.currentPayment,
      };

    case SAVE_MERGE_DETAILS:
      return {
        ...state,
        merge: {
          ...state.merge,
          ...actions.payload,
        },
      };

    case FETCH_SPECIALS_SUCCESS:
      return {
        ...state,
        specials: actions.payload,
      };

    case FETCH_SPECIALS_FAILED:
      return {
        ...state,
        specials: INITIAL_STATE.specials,
      };

    case FETCH_MANUAL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        manualDiscounts: actions.payload,
      };

    case FETCH_MANUAL_DISCOUNTS_FAILED:
      return {
        ...state,
        manualDiscounts: INITIAL_STATE.manualDiscounts,
      };

    default:
      return state;
  }
}
