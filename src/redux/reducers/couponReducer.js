import {
  SET_COUPONS_LOADING,
  FETCH_COUPONS_SUCCESS,
  FETCH_COUPONS_FAILED,
  FETCH_COUPON_REDEMPTIONS_SUCCESS,
  FETCH_COUPON_REDEMPTIONS_FAILED,
} from "../constants";

const INITIAL_STATE = {
  loading: false,
  coupons: { list: [] },
  redemptions: { list: [] },
};

export default function reducer(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case SET_COUPONS_LOADING:
      return { ...state, loading: actions.payload };
    case FETCH_COUPONS_SUCCESS:
      return { ...state, coupons: actions.payload };
    case FETCH_COUPONS_FAILED:
      return { ...state, coupons: INITIAL_STATE.coupons };
    case FETCH_COUPON_REDEMPTIONS_SUCCESS:
      return { ...state, redemptions: actions.payload };
    case FETCH_COUPON_REDEMPTIONS_FAILED:
      return { ...state, redemptions: INITIAL_STATE.redemptions };
    default:
      return state;
  }
}
