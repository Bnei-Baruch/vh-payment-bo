/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import { useModal } from "../../../hooks";
import {
  cancelMembership,
  getCustomerOrders,
  getCustomerPayments,
  searchCustomers,
} from "../../../redux/actions/customersActions";
import { SAVE_MERGE_DETAILS } from "../../../redux/constants";
import { defaultTableOptions } from "../../../constants/table";

export const useData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useHistory();
  const { state } = useLocation();
  const confirmationModal = useModal();
  const mergeAccountsModal = useModal();
  const offlinePaymentModal = useModal();
  const membershipInfo = [
    { key: "membership_active", label: t("Search.status") },
    { key: "membership_type", label: t("Activity.type") },
  ];
  const { orders, payments, loading, searchResult } = useSelector(
    (state) => state.customersReducer
  );
  const userData = useMemo(
    () => searchResult.find(({ user_id }) => user_id === state?.userId),
    [searchResult, state?.userId]
  );

  const userName = useMemo(
    () =>
      `${userData?.first_name_vernacular ?? ""} ${
        userData?.last_name_vernacular ?? ""
      }`,
    [userData]
  );

  const getCustomerDetails = () => {
    dispatch(getCustomerOrders(userData.primary_email));
    dispatch(getCustomerPayments(userData.primary_email));
  };

  useEffect(() => {
    userData ? getCustomerDetails() : goBack();
  }, [userData]);

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
        : Object.keys(orders[0]).map((key) => ({ name: key, label: key })),
    [orders.length]
  );

  const paymentsColumns = useMemo(
    () =>
      payments.length === 0
        ? []
        : Object.keys(payments[0]).map((key) => ({ name: key, label: key })),
    [payments.length]
  );

  const userDataColumns = [
    { name: "key", label: "" },
    { name: "value", label: "" },
  ];

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

  const refreshUserInfo = () =>
    dispatch(searchCustomers(userData?.primary_email, "email"));

  return {
    goBack,
    orders,
    loading,
    options,
    payments,
    userName,
    userData,
    userDataArr,
    onPressMerge,
    ordersColumns,
    paymentsColumns,
    userDataColumns,
    membershipInfo,
    refreshUserInfo,
    confirmationModal,
    mergeAccountsModal,
    offlinePaymentModal,
    onConfirmCancellation,
  };
};
