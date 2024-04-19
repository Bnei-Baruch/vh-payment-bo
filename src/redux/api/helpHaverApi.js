import axios from "../../services/axios";

export const ApiHelpHaver = new (class Api {
  getMembershipRequests() {
    return axios({
      url: "/profile/v1/requests",
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
