/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";

import moment from "moment";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import { useModal } from "../../../hooks";
import {
  cancelMembership,
  getCustomerOrders,
  getCustomerPayments,
  getMembershipInfo,
  removeSpecialForUser,
  searchCustomers,
  updateCustomerInfo,
} from "../../../redux/actions/customersActions";
import { SAVE_MERGE_DETAILS } from "../../../redux/constants";
import {
  baseMembershipInfo,
  defaultTableOptions,
  fieldsForEditing,
  fieldsForSorting,
} from "../../../constants/table";
import { ACTIVE_DUE } from "../../../constants/specials";
import { ApiPayments } from "../../../redux/api/paymentsApi";
import { DASHBOARD_ROUTES } from "../../../routes/dashboardRoutes";
import { DEFAULT_CARD, PAYMENT_TYPE } from "../../../constants/payments";

export const useData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { state } = useLocation();
  const paymentModalRef = useRef(null);
  const confirmationModal = useModal();
  const mergeAccountsModal = useModal();
  const offlinePaymentModal = useModal();
  const [activeTab, setActiveTab] = useState(0);
  const [cardDetails, setCardDetails] = useState(DEFAULT_CARD);
  const [orderDetails, setOrderDetails] = useState(null);
  const [membershipInfo, setMembershipInfo] = useState(baseMembershipInfo);
  const [confirmationInfo, setConfirmationInfo] = useState({
    desc: "",
    btnTitle: "",
  });
  const [alert, setAlert] = useState({
    type: "success",
    visible: false,
    message: "",
  });
  const { language } = useSelector((state) => state.settingsReducer);
  const { orders, payments, loading, searchResult, currentPayment } =
    useSelector((state) => state.customersReducer);

  const paramX = new URLSearchParams(
    window.location.search.slice(1).replace("?", "&")
  ).get("paramX");

  const refreshUserInfo = () =>
    dispatch(searchCustomers(userData?.primary_email, "email"));

  const addSpecialModal = useModal(refreshUserInfo);
  const userEmail =
    state?.userEmail ??
    new URLSearchParams(window.location.search).get("user_email");

  const userData = useMemo(
    () => searchResult.find(({ primary_email }) => primary_email === userEmail),
    [searchResult, userEmail]
  );

  const goBack = () => push(DASHBOARD_ROUTES.CustomerSearch);

  const defaultValues = useMemo(() => {
    const values = {};

    if (userData) {
      fieldsForEditing.map(({ name }) => (values[name] = userData[name]));
    }

    return values;
  }, [userData]);

  const isEditablePayment = useMemo(
    () => currentPayment?.activeDue === ACTIVE_DUE.OFFLINE_PAYMENT,
    [currentPayment]
  );

  const { control, handleSubmit, formState, reset, setValue } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const isEnabledSaveBtn = useMemo(
    () => formState?.isDirty && formState?.isValid,
    [formState?.isDirty, formState?.isValid]
  );

  const userName = useMemo(
    () =>
      `${userData?.first_name_vernacular ?? ""} ${
        userData?.last_name_vernacular ?? ""
      }`,
    [userData]
  );

  const hasSpecial = useMemo(
    () => currentPayment?.activeDue === ACTIVE_DUE.SPECIALS,
    [currentPayment]
  );

  const hasCreditCard = useMemo(
    () =>
      currentPayment?.active && currentPayment?.type === PAYMENT_TYPE.AUTOMATIC,
    [currentPayment]
  );

  const getCustomerDetails = () => {
    dispatch(getCustomerOrders(userData.primary_email));
    dispatch(getCustomerPayments(userData.primary_email));
  };

  useEffect(() => {
    if (!userEmail) {
      goBack();
    }

    if (userData?.date_of_birth) {
      setValue("date_of_birth", userData?.date_of_birth);
    }

    if (userData) {
      fieldsForEditing.map(({ name }) => setValue(name, userData[name]));

      dispatch(getMembershipInfo(userData.keycloak_id));
    }

    userData
      ? getCustomerDetails()
      : dispatch(searchCustomers(userEmail, "email"));
  }, [userData]);

  useEffect(() => {
    if (currentPayment?.activeDue) {
      setMembershipInfo([
        ...baseMembershipInfo,
        {
          value: t(`UserDetails.${currentPayment.activeDue}`),
          label: t("UserDetails.paymentType"),
        },
      ]);
    }
  }, [currentPayment]);

  const options = {
    ...defaultTableOptions,
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("Activity.noRecords")
        ),
      },
    },
  };

  const ordersColumns = useMemo(
    () =>
      orders.length === 0
        ? []
        : Object.keys(orders[0]).map((key) => ({
            name: key,
            label: key,
            options: { sort: fieldsForSorting.includes(key) },
          })),
    [orders.length]
  );

  const paymentsColumns = useMemo(
    () =>
      payments.length === 0
        ? []
        : Object.keys(payments[0]).map((key) => ({ name: key, label: key })),
    [payments.length]
  );

  const userDataArr = useMemo(
    () =>
      userData
        ? Object.keys(userData).flatMap((key) =>
            !!membershipInfo.find((i) => i.key === key) || key === "status"
              ? []
              : [{ key, value: userData[key] }]
          )
        : [],
    [userData]
  );

  const onConfirmCancellation = () => {
    confirmationModal.hideModal();
    dispatch(cancelMembership(userData?.keycloak_id, goBack));
  };

  const onPressMerge = () => {
    mergeAccountsModal.showModal();
    dispatch({
      type: SAVE_MERGE_DETAILS,
      payload: { toAccount: userData },
    });
  };

  const onPressCancelMembership = () => {
    setConfirmationInfo({
      desc: t("UserDetails.areYouSureYouWantToCancel", {
        name: userName,
      }),
      btnTitle: "UserDetails.yesCancel",
      onConfirm: onConfirmCancellation,
    });
    confirmationModal.showModal();
  };

  const onPressAddSpecial = () => {
    if (hasSpecial) {
      return;
    }

    addSpecialModal.showModal();
  };

  const onPressDeleteSpecial = () => {
    setConfirmationInfo({
      desc: t("UserDetails.areYouSureYouWantToDeleteSpecial", {
        name: userName,
      }),
      btnTitle: "UserDetails.yesDelete",
      onConfirm: onConfirmDeleteSpecial,
    });
    confirmationModal.showModal();
  };

  const onConfirmDeleteSpecial = () => {
    confirmationModal.hideModal();
    dispatch(
      removeSpecialForUser(userData?.keycloak_id, () =>
        setAlert({
          visible: true,
          type: "success",
          message: t("UserDetails.specialsSuccessfullyRemoved"),
        })
      )
    );
  };

  const onSubmit = (values) => {
    const payload = {};

    Object.keys(formState.dirtyFields).map(
      (key) =>
        (payload[key] =
          key === "date_of_birth" ? moment(values[key]).format() : values[key])
    );

    dispatch(
      updateCustomerInfo(payload, userData?.keycloak_id, () => {
        refreshUserInfo();
        reset();
        setAlert({
          visible: true,
          type: "success",
          message: t("UserDetails.dataUpdatedSuccessfully"),
        });
      })
    );
  };

  const onPressOfflinePayment = () => {
    paymentModalRef?.current?.resetFormValues();
    offlinePaymentModal.showModal();
  };

  const onPressEditPayment = () => {
    paymentModalRef?.current?.setFormValues();
    offlinePaymentModal.showModal();
  };

  const onHideAlert = () => setAlert((p) => ({ ...p, visible: false }));

  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("status") === "failed"
    ) {
      setAlert({
        visible: true,
        type: "error",
        message: t("UserDetails.failedToUpdateCard"),
      });
    }
  }, []);

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

      setAlert({
        visible: true,
        type: "success",
        message: t("UserDetails.succesfullyUpdatedCard"),
      });

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
      setAlert({
        visible: true,
        type: "error",
        message: t("UserDetails.failedToUpdateCard"),
      });
      console.log("Failed to save card", error);
    }
  };

  useEffect(() => {
    currentPayment?.details?.automatic?.order_id
      ? fetchCardDetails()
      : setCardDetails(DEFAULT_CARD);
  }, [currentPayment]);

  const fetchCardDetails = async () => {
    try {
      const { data } = await ApiPayments.getOrderById(
        currentPayment?.details?.automatic?.order_id
      );

      setOrderDetails(data);

      if (data?.card_details_id) {
        const { data: cardDetails } = await ApiPayments.getCardDetails(
          data?.card_details_id
        );

        setCardDetails({
          number: cardDetails?.cc_number,
          expDate: cardDetails?.cc_expdate,
        });

        return;
      }

      if (currentPayment?.details?.payment?.payment_method) {
        setCardDetails({
          number: currentPayment?.details?.payment?.payment_method,
          expDate: "****",
        });
      }
    } catch (error) {
      console.log("Failed to get card", error);
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

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.log("Failed to update card", error);
    }
  };

  return {
    alert,
    goBack,
    orders,
    loading,
    options,
    control,
    payments,
    userName,
    userData,
    activeTab,
    hasSpecial,
    cardDetails,
    onHideAlert,
    userDataArr,
    setActiveTab,
    onPressMerge,
    hasCreditCard,
    ordersColumns,
    addSpecialModal,
    paymentsColumns,
    membershipInfo,
    paymentModalRef,
    refreshUserInfo,
    confirmationInfo,
    isEnabledSaveBtn,
    onUpdateCardPress,
    isEditablePayment,
    onPressAddSpecial,
    confirmationModal,
    mergeAccountsModal,
    onPressEditPayment,
    offlinePaymentModal,
    onPressDeleteSpecial,
    onPressOfflinePayment,
    onPressCancelMembership,
    onPressSave: handleSubmit(onSubmit),
  };
};
