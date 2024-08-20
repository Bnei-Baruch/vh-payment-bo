import axios from "../../services/axios";

export const ApiCustomers = new (class Api {
  searchByParamX(query) {
    return axios({
      url: `/pay/payments/payment/${query}`,
      method: "get",
    });
  }
  searchByEmailOrName(type, query) {
    return axios({
      url: `/profile/v1/profiles?${type}=${query}`,
      method: "get",
    });
  }
  getActivity(limit, counter) {
    return axios({
      url: `/pay/payments/activities?limit=${limit}&skip=${counter}`,
      method: "get",
    });
  }
  getOrders(email) {
    return axios({
      url: `/pay/v2/orders?email=${email}&limit=200`,
      method: "get",
    });
  }
  getPayments(email) {
    return axios({
      url: `pay/payments/all/${email}`,
      method: "get",
    });
  }
  cancelMembership(keycloak_id) {
    return axios({
      url: `profile/v1/membership/cancellation`,
      method: "post",
      data: { keycloak_id },
    });
  }
  getCustomerDetails(keycloak_id) {
    return axios({
      url: `/profile/v1/profile/${keycloak_id}`,
      method: "get",
    });
  }
  offlinePayment(data) {
    return axios({
      url: `/pay/v2/order/offline`,
      method: "post",
      data,
    });
  }
  getSpecials(limit, counter) {
    return axios({
      url: `/pay/v2/special?limit=${limit}&skip=${counter}`,
      method: "get",
    });
  }
  addSpecialEntry(data) {
    return axios({
      url: `/pay/v2/special/`,
      method: "post",
      data,
    });
  }
  removeSpecialEntry(id) {
    return axios({
      url: `/pay/v2/special/${id}`,
      method: "delete",
    });
  }
  searchSpecials(type, query) {
    return axios({
      url: `/pay/v2/special/${type}/${query}`,
      method: "get",
    });
  }
})();
