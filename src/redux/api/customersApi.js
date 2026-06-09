import axios from "../../services/axios";

const PRICING_TIMEOUT_MS = 60000;

export const ApiCustomers = new (class Api {
  searchByParamX(query) {
    return axios({
      url: `/pay/payments/payment/${query}`,
      method: "get",
    });
  }
  search(fields, clause) {
    const queryParams = new URLSearchParams(fields).toString();
    const clauseParam = clause ? `&clause=${clause}` : "";
    return axios({
      url: `/profile/v1/profiles/search?${queryParams}${clauseParam}`,
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
      url: `/pay/payments/all/${email}`,
      method: "get",
    });
  }
  cancelMembership(keycloak_id) {
    return axios({
      url: `/profile/v1/membership/cancellation`,
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
  getSpecials() {
    return axios({
      url: `/pay/v2/special/`,
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
  mergeAccounts(data) {
    return axios({
      url: `/pay/v2/account/merge`,
      method: "post",
      data,
    });
  }
  updatePersonalInfo(data, keycloakId) {
    return axios({
      url: `/profile/v1/profile/${keycloakId}`,
      method: "patch",
      data,
    });
  }
  setSpouse(keycloakId, spouseKeycloakId, forceUpdate) {
    return axios({
      url: `/profile/v1/profile/${keycloakId}/spouse`,
      method: "patch",
      data: {
        spouse_keycloak_id: spouseKeycloakId,
        force_update: forceUpdate,
      },
    });
  }
  fetchMembershipInfo(keycloakId) {
    return axios({
      url: `/profile/v1/membership/kcid/${keycloakId}`,
      method: "get",
    });
  }
  updateOfflinePayment(data) {
    return axios({
      url: `/pay/v2/order/offline`,
      method: "patch",
      data,
    });
  }
  removeSpecialByKeycloakId(keycloakId) {
    return axios({
      url: `/pay/v2/special/delete/${keycloakId}`,
      method: "delete",
    });
  }
  fetchComments(pageId, keycloakId) {
    return axios({
      url: `profile/v1/page-notes?page_keycloak_id=${keycloakId}&page_id=${pageId}`,
      method: "get",
    });
  }
  addComment(data) {
    return axios({
      url: `profile/v1/page-notes`,
      method: "post",
      data,
    });
  }
  removeCommentById(id) {
    return axios({
      url: `profile/v1/page-notes/${id}`,
      method: "delete",
    });
  }
  getManualDiscounts(search) {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return axios({
      url: `/pay/v2/manual_discount/${params}`,
      method: "get",
    });
  }
  createOrUpdateManualDiscount(data) {
    return axios({
      url: `/pay/v2/manual_discount/`,
      method: "post",
      data,
    });
  }
  cancelManualDiscount(keycloakId) {
    return axios({
      url: `/pay/v2/manual_discount/${keycloakId}`,
      method: "delete",
    });
  }
  getMonthlyPrice(keycloakId, pricingVersion) {
    const params = pricingVersion ? `?pricing_version=${pricingVersion}` : "";
    return axios({
      url: `/pay/v2/pricing/monthly/${keycloakId}${params}`,
      method: "get",
      timeout: PRICING_TIMEOUT_MS,
    });
  }
})();
