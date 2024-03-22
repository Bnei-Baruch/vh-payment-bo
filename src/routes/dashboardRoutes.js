export const PAYMENTS_ROOT = "/admin/payments";
export const ROOT = "/";

export const DASHBOARD_ROUTES = {
  Analytics: `${PAYMENTS_ROOT}/analytics/customer`,
  CustomerAnalytics: `${PAYMENTS_ROOT}/analytics/customer`,
  OrderAnalytics: `${PAYMENTS_ROOT}/analytics/order`,
  Customers: `${PAYMENTS_ROOT}/customers/`,
  CustomerActivity: `${PAYMENTS_ROOT}/customers/activity`,
  CustomerSearch: `${PAYMENTS_ROOT}/customers/search`,
  CustomerDetails: `${PAYMENTS_ROOT}/customers/search/userdetails`,
  CustomerCreate: `${PAYMENTS_ROOT}/customers/create`,
  CustomerCreateAccount: `${PAYMENTS_ROOT}/customers/create/account`,
  CustomerCreatePaymentMethod: `${PAYMENTS_ROOT}/customers/create/paymentmethod`,
  CustomerCreateSpecial: `${PAYMENTS_ROOT}/customers/create/special`,
  CustomerCreateOrder: `${PAYMENTS_ROOT}/customers/create/order`,
  CustomerCreatePayment: `${PAYMENTS_ROOT}/customers/create/payment`,
};
