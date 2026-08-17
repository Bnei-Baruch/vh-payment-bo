import axios from "../../services/axios";

export const ApiCoupons = new (class Api {
  getCoupons() {
    return axios({
      url: `/pay/v2/coupon/`,
      method: "get",
    });
  }
  createCoupon(data) {
    return axios({
      url: `/pay/v2/coupon/`,
      method: "post",
      data,
    });
  }
  updateCoupon(couponId, data) {
    return axios({
      url: `/pay/v2/coupon/${couponId}`,
      method: "patch",
      data,
    });
  }
  getCouponRedemptions(couponId) {
    return axios({
      url: `/pay/v2/coupon/${couponId}/redemptions`,
      method: "get",
    });
  }
  revokeRedemption(couponId, redemptionId) {
    return axios({
      url: `/pay/v2/coupon/${couponId}/redemption/${redemptionId}`,
      method: "delete",
    });
  }
})();
