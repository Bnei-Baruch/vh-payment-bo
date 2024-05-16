import axios from "../../services/axios";

export const ApiHelpHaver = new (class Api {
  getMembershipRequests(limit, counter, type, query) {
    return axios({
      url: `/profile/v1/requests?limit=${limit}&skip=${counter}&${type}=${query}`,
      method: "get",
    });
  }
  updateRequest(requestId, data) {
    return axios({
      url: `/profile/v1/request/${requestId}/conclude`,
      method: "post",
      data,
    });
  }
})();
