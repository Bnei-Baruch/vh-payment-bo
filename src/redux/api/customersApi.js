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
})();
