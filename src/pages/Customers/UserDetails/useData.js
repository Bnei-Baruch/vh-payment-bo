/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { CircularProgress, TextField } from "@material-ui/core";
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
import {
  defaultTableOptions,
  fieldsForEditing,
} from "../../../constants/table";

export const useData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useHistory();
  const { state } = useLocation();
  const confirmationModal = useModal();
  const mergeAccountsModal = useModal();
  const offlinePaymentModal = useModal();
  const [activeTab, setActiveTab] = useState(0);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({});
  const membershipInfo = [
    { key: "membership_active", label: t("Search.status") },
    { key: "membership_type", label: t("Activity.type") },
  ];
  const { orders, payments, loading, searchResult } = useSelector(
    (state) => state.customersReducer
  );
  const userData = useMemo(
    () =>
      searchResult.find(
        ({ primary_email }) => primary_email === state?.userEmail
      ),
    [searchResult, state?.userEmail]
  );

  const userInfoIsUpdated = useMemo(
    () => Object.keys(updatedUserInfo).length > 0,
    [updatedUserInfo]
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
    if (!state?.userEmail) {
      goBack();
    }

    userData
      ? getCustomerDetails()
      : dispatch(searchCustomers(state?.userEmail, "email"));
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
        : Object.keys(orders[0]).map((key) => ({
            name: key,
            label: key,
            options: { sort: key === "ProductType" },
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

  const userDataColumns = [
    { name: "key", label: "" },
    {
      name: "value",
      label: "",
      options: {
        customBodyRender: (value, { rowData }) => {
          const canBeEdited = fieldsForEditing.includes(rowData[0]);

          if (canBeEdited) {
            return (
              <TextField
                defaultValue={value}
                style={{ width: "100%" }}
                onChange={(e) => onChangeUserInfo(rowData[0], e.target.value)}
              />
            );
          }

          return value;
        },
      },
    },
  ];

  const onChangeUserInfo = (label, value) => {
    const defaultValue = userData[label];

    if (defaultValue == value) {
      const { [label]: _, ...newObj } = updatedUserInfo;
      setUpdatedUserInfo(newObj);
    } else {
      setUpdatedUserInfo((p) => ({ ...p, [label]: value }));
    }
  };

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
    activeTab,
    userDataArr,
    setActiveTab,
    onPressMerge,
    ordersColumns,
    paymentsColumns,
    userDataColumns,
    membershipInfo,
    refreshUserInfo,
    userInfoIsUpdated,
    confirmationModal,
    mergeAccountsModal,
    offlinePaymentModal,
    onConfirmCancellation,
  };
};
