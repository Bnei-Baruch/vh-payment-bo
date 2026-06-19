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
  cancelHHGrant(keycloakId) {
    return axios({
      url: `/pay/v2/hh_grant/${keycloakId}`,
      method: "delete",
    });
  }
  getHHRequests(status, search) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("keycloak_id", search);
    return axios({
      url: `/pay/v2/hh_request/?${params.toString()}`,
      method: "get",
    });
  }
  concludeHHRequest(requestId, data) {
    return axios({
      url: `/pay/v2/hh_request/${requestId}/conclude`,
      method: "post",
      data,
    });
  }
})();
