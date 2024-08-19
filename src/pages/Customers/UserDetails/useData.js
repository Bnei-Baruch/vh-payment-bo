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
  searchCustomers,
  updateCustomerInfo,
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
  const paymentModalRef = useRef(null);
  const confirmationModal = useModal();
  const mergeAccountsModal = useModal();
  const offlinePaymentModal = useModal();
  const [activeTab, setActiveTab] = useState(0);
  const [membershipInfo, setMembershipInfo] = useState([
    { key: "membership_active", label: t("Search.status") },
    { key: "membership_type", label: t("Activity.type") },
  ]);
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

  const defaultValues = useMemo(() => {
    const values = {};

    if (userData) {
      fieldsForEditing.map(({ name }) => (values[name] = userData[name]));
    }

    return values;
  }, [userData]);

  const isEditablePayment = useMemo(
    () =>
      !!membershipInfo.find(
        ({ value }) => value === t("UserDetails.offlinePayment")
      ),
    [membershipInfo]
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

  const getCustomerDetails = () => {
    dispatch(getCustomerOrders(userData.primary_email));
    dispatch(getCustomerPayments(userData.primary_email));
  };

  useEffect(() => {
    if (!state?.userEmail) {
      goBack();
    }

    if (userData?.date_of_birth) {
      setValue("date_of_birth", userData?.date_of_birth);
    }

    if (userData) {
      fieldsForEditing.map(({ name }) => setValue(name, userData[name]));

      dispatch(
        getMembershipInfo(
          userData.keycloak_id,
          (type) =>
            type &&
            setMembershipInfo((p) => [
              ...p,
              {
                value: t(`UserDetails.${type}`),
                label: t("UserDetails.paymentType"),
              },
            ])
        )
      );
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
      })
    );
  };

  const onPressEditPayment = () => {
    paymentModalRef?.current?.setFormValues();
    offlinePaymentModal.showModal();
  };

  return {
    goBack,
    orders,
    loading,
    options,
    control,
    payments,
    userName,
    userData,
    activeTab,
    userDataArr,
    setActiveTab,
    onPressMerge,
    ordersColumns,
    paymentsColumns,
    membershipInfo,
    paymentModalRef,
    refreshUserInfo,
    isEnabledSaveBtn,
    isEditablePayment,
    confirmationModal,
    mergeAccountsModal,
    onPressEditPayment,
    offlinePaymentModal,
    onConfirmCancellation,
    onPressSave: handleSubmit(onSubmit),
  };
};
