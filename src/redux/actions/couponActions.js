import { ApiCoupons } from "../api/couponApi";
import {
  SET_COUPONS_LOADING,
  FETCH_COUPONS_SUCCESS,
  FETCH_COUPONS_FAILED,
  FETCH_COUPON_REDEMPTIONS_SUCCESS,
  FETCH_COUPON_REDEMPTIONS_FAILED,
} from "../constants";

export const fetchCoupons = () => {
  return async (dispatch) => {
    dispatch({ type: SET_COUPONS_LOADING, payload: true });
    try {
      const result = await ApiCoupons.getCoupons();
      dispatch({ type: FETCH_COUPONS_SUCCESS, payload: { list: result?.data ?? [] } });
    } catch (e) {
      console.error("FETCH_COUPONS_FAILED", e);
      dispatch({ type: FETCH_COUPONS_FAILED });
    } finally {
      dispatch({ type: SET_COUPONS_LOADING, payload: false });
    }
  };
};

// Clears the redemptions slice immediately (before a refetch) so a stale
// coupon's rows don't flash when opening a different coupon.
export const clearCouponRedemptions = () => ({
  type: FETCH_COUPON_REDEMPTIONS_SUCCESS,
  payload: { list: [] },
});

export const fetchCouponRedemptions = (couponId) => {
  return async (dispatch) => {
    try {
      const result = await ApiCoupons.getCouponRedemptions(couponId);
      dispatch({ type: FETCH_COUPON_REDEMPTIONS_SUCCESS, payload: { list: result?.data ?? [] } });
    } catch (e) {
      console.error("FETCH_COUPON_REDEMPTIONS_FAILED", e);
      dispatch({ type: FETCH_COUPON_REDEMPTIONS_FAILED });
    }
  };
};

export const createCouponEntry = (payload, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      await ApiCoupons.createCoupon(payload);
      dispatch(fetchCoupons());
      onSuccess();
    } catch (e) {
      console.error("Create coupon failed", e);
      if (onError) onError(e);
    }
  };
};

export const updateCouponEntry = (couponId, payload, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      await ApiCoupons.updateCoupon(couponId, payload);
      dispatch(fetchCoupons());
      onSuccess();
    } catch (e) {
      console.error("Update coupon failed", e);
      if (onError) onError(e);
    }
  };
};

export const revokeCouponRedemption = (couponId, redemptionId, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      await ApiCoupons.revokeRedemption(couponId, redemptionId);
      dispatch(fetchCouponRedemptions(couponId));
      dispatch(fetchCoupons());
      onSuccess();
    } catch (e) {
      console.error("Revoke redemption failed", e);
      if (onError) onError(e);
    }
  };
};
