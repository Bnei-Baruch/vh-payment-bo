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

// Should be removed
const comments = [
  {
    userName: "Charlotte Walker",
    date: "1640995200",
    comment:
      "The customer support ticket has been resolved. Please confirm if all issues have been addressed. If you need further assistance, feel free to reach out.",
  },
  {
    userName: "Jack Mitchell",
    date: "1648670400",
    comment:
      "I’ve updated the client’s contact information in the system. Please ensure that all upcoming correspondence reflects the new details.",
  },
  {
    userName: "Olivia Carter",
    date: "1672531200",
    comment:
      "The system maintenance is complete, and all services should be up and running. Let me know if you encounter any issues.",
  },
  {
    userName: "Mia Roberts",
    date: "1657065600",
    comment:
      "The issue with the payment gateway has been escalated to the development team. I’ll update you once we have a resolution. Thanks for your patience.",
  },
  {
    userName: "James Thompson",
    date: "1664505600",
    comment: "Your request for additional user access has been approved.",
  },
];

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
  const [membershipInfo, setMembershipInfo] = useState(baseMembershipInfo);
  const [confirmationInfo, setConfirmationInfo] = useState({
    desc: "",
    btnTitle: "",
  });
  const [alert, setAlert] = useState({ visible: false, message: "" });
  const { orders, payments, loading, searchResult, currentPayment } =
    useSelector((state) => state.customersReducer);

  const refreshUserInfo = () =>
    dispatch(searchCustomers(userData?.primary_email, "email"));

  const addSpecialModal = useModal(refreshUserInfo);

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

      dispatch(getMembershipInfo(userData.keycloak_id));
    }

    userData
      ? getCustomerDetails()
      : dispatch(searchCustomers(state?.userEmail, "email"));
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
    comments,
    activeTab,
    hasSpecial,
    onHideAlert,
    userDataArr,
    setActiveTab,
    onPressMerge,
    ordersColumns,
    addSpecialModal,
    paymentsColumns,
    membershipInfo,
    paymentModalRef,
    refreshUserInfo,
    confirmationInfo,
    isEnabledSaveBtn,
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
