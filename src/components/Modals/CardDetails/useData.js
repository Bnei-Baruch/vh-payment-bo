/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { ApiPayments } from "../../../redux/api/paymentsApi";

export const useData = ({ userData }) => {
  const { language } = useSelector((state) => state.settingsReducer);
  const { currentPayment } = useSelector((state) => state.customersReducer);
  const [orderDetails, setOrderDetails] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: "****************",
    expDate: "****",
  });
  const paramX = new URLSearchParams(
    window.location.search.slice(1).replace("?", "&")
  ).get("paramX");
  const [status, setStatus] = useState(
    new URLSearchParams(window.location.search).get("status")
  );

  useEffect(() => {
    if (currentPayment?.details?.automatic?.order_id) {
      fetchCardDetails();
    }
  }, [currentPayment]);

  const fetchCardDetails = async () => {
    try {
      const { data } = await ApiPayments.getOrderById(
        currentPayment?.details?.automatic?.order_id
      );

      setOrderDetails(data);

      const { data: cardDetails } = await ApiPayments.getCardDetails(
        data?.card_details_id
      );

      setCardDetails({
        number: cardDetails?.cc_number,
        expDate: cardDetails?.cc_expdate,
      });
    } catch (error) {
      console.log("Failed to get card", error);
    }
  };

  useEffect(() => {
    if (paramX) {
      saveUpdatedCard();
    }
  }, [paramX]);

  const saveUpdatedCard = async () => {
    try {
      const searchParams = new URLSearchParams(
        window.location.search.slice(1).replace("?", "&")
      );
      const cc_expdate = searchParams.get("CreditCardExpDate");
      const cc_number = searchParams.get("CreditCardNumber");
      const order_id = searchParams.get("order_id");
      const token = searchParams.get("token");

      await ApiPayments.saveUpdatedCard({
        order_id: parseInt(order_id, 10),
        card_number: cc_number,
        card_exp: cc_expdate,
        param_x: paramX,
        token,
      });

      setStatus("success");
      setCardDetails({
        number: cc_number,
        expDate: cc_expdate,
      });

      var newUrl = new URL(window.location.href);
      searchParams.delete("paramX");

      window.history.replaceState(
        {},
        "",
        `${newUrl.origin}${newUrl.pathname}?${searchParams.toString()}`
      );
    } catch (error) {
      setStatus("failed");
      console.log("Failed to save card", error);
    }
  };

  const onUpdateCardPress = async () => {
    try {
      const payload = {
        OrderLanguage: language.toUpperCase(),
        UserKey: userData?.keycloak_id,
        Currency: currentPayment?.details?.payment?.currency,
        Reference: "new_token_" + currentPayment?.details?.automatic?.order_id,
        Organization: orderDetails?.Organization,
        SKU: orderDetails?.SKU || "",
        FirstName: userData?.first_name_vernacular,
        LastName: userData?.last_name_vernacular,
        Email: userData?.primary_email,
        Phone: userData?.mobile_number || "",
        Country: userData?.country || "",
        SuccessURL: `${window.location.href}?user_email=${userData?.primary_email}&order_id=${currentPayment?.details?.automatic?.order_id}`,
        CancelURL: `${window.location.href}?status=failed&user_email=${userData?.primary_email}`,
        ErrorURL: `${window.location.href}?status=failed&user_email=${userData?.primary_email}`,
      };

      const { url } = await ApiPayments.requestUpdateCard(payload);

      window.location.href = url;
    } catch (error) {
      console.log("Failed to update card", error);
    }
  };

  return { status, setStatus, cardDetails, onUpdateCardPress };
};
