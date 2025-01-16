import axios from "../../services/axios";

export const ApiPayments = new (class Api {
  getOrderById(id) {
    return axios({
      url: `/pay/v2/order/${id}`,
      method: "get",
    });
  }
  requestUpdateCard(data) {
    return axios({
      url: "/pay/v2/transaction/new_token",
      method: "post",
      data,
    });
  }
  saveUpdatedCard(data) {
    return axios({
      url: "/pay/v2/order/update_token",
      method: "post",
      data,
    });
  }
  getCardDetails(id) {
    return axios({
      url: `pay/v2/card_detail/${id}`,
      method: "get",
    });
  }
})();
