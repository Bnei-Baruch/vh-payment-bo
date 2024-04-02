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
})();
