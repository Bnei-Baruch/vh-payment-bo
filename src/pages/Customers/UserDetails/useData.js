/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import {
  getCustomerOrders,
  getCustomerPayments,
} from "../../../redux/actions/customersActions";

export const useData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useHistory();
  const { state } = useLocation();
  const { orders, payments, loading, searchResult } = useSelector(
    (state) => state.customersReducer
  );
  const userData = useMemo(
    () => searchResult.find(({ user_id }) => user_id === state?.userId),
    [searchResult, state?.userId]
  );

  const getCustomerDetails = () => {
    dispatch(getCustomerOrders(userData.primary_email));
    dispatch(getCustomerPayments(userData.primary_email));
  };

  useEffect(() => {
    userData ? getCustomerDetails() : goBack();
  }, [userData]);

  const options = {
    selectableRows: "none",
    download: false,
    print: false,
    pagination: false,
    search: false,
    filter: false,
    viewColumns: false,
    sort: false,
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
        ? Object.keys(userData).map((key) => ({
            key,
            value:
              key === "status" ? userData[key].membership_type : userData[key],
          }))
        : [],
    [userData]
  );

  return {
    orders,
    loading,
    options,
    payments,
    userDataArr,
    ordersColumns,
    paymentsColumns,
    userDataColumns,
  };
};
