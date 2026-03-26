/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";

import moment from "moment";
import debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import { useModal } from "../../../hooks";
import {
  addComment,
  cancelMembership,
  getComments,
  getCustomerOrders,
  getCustomerPayments,
  getMembershipInfo,
  removeCommentById,
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
import { ApiCustomers } from "../../../redux/api/customersApi";
import { DASHBOARD_ROUTES } from "../../../routes/dashboardRoutes";
import { DEFAULT_CARD, PAYMENT_TYPE } from "../../../constants/payments";

const USER_DETAILS_PAGE_ID = 1;

export const useData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { state } = useLocation();
  const paymentModalRef = useRef(null);
  const confirmationModal = useModal();
  const mergeAccountsModal = useModal();
  const offlinePaymentModal = useModal();
  const spouseModal = useModal();
  const priceCalculatorModal = useModal();
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [cardDetails, setCardDetails] = useState(DEFAULT_CARD);
  const [orderDetails, setOrderDetails] = useState(null);
  const [membershipInfo, setMembershipInfo] = useState(baseMembershipInfo);
  const [confirmationInfo, setConfirmationInfo] = useState({
    desc: "",
    btnTitle: "",
    onConfirm: () => {},
  });
  const [alert, setAlert] = useState({
    type: "success",
    visible: false,
    message: "",
  });
  const [spouseSearchResult, setSpouseSearchResult] = useState([]);
  const [selectedSpouse, setSelectedSpouse] = useState(null);
  const [spouseData, setSpouseData] = useState(null);

  const { language } = useSelector((state) => state.settingsReducer);
  const { orders, payments, loading, searchResult, currentPayment } =
    useSelector((state) => state.customersReducer);
  const { info: currentUser } = useSelector((state) => state.profileReducer);

  const paramX = new URLSearchParams(
    window.location.search.slice(1).replace("?", "&")
  ).get("paramX");

  const userEmail =
    state?.userEmail ??
    new URLSearchParams(window.location.search).get("user_email");
  const userData = useMemo(
    () => {
      let user = searchResult.find(({ primary_email }) => primary_email === userEmail);
      if (user && user.marital_status === null) {
        user = { ...user, marital_status: "Unspecified" };
      }
      if (spouseData) {
        user = {
          ...user,
          "spouse": `${spouseData.first_name_vernacular} ${spouseData.last_name_vernacular} (${spouseData.primary_email})`,
          // "spouse_keycloak_id": spouseData.keycloak_id,
          "spouse_user_id": spouseData.user_id,
        };
      }
      return user;
    },
    [searchResult, userEmail, spouseData]
  );

  const refreshUserInfo = () =>
    dispatch(searchCustomers(userData?.primary_email, "email"));

  const addSpecialModal = useModal(refreshUserInfo);

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

  const {
    control: noteControl,
    handleSubmit: handleNoteSubmit,
    reset: resetNoteField,
  } = useForm({
    mode: "onChange",
  });

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
    fetchComments();

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
    setMembershipInfo([
      ...baseMembershipInfo,
      ...(currentPayment?.activeDue
        ? [
            {
              value: t(`UserDetails.${currentPayment.activeDue}`),
              label: t("UserDetails.paymentType"),
            },
          ]
        : []),
      ...(currentPayment?.expiry
        ? [
            {
              key: "membership_expiry",
              value: currentPayment.expiry,
              label: t("UserDetails.membershipExpiry"),
            },
          ]
        : []),
    ]);
  }, [currentPayment]);

  useEffect(() => {
    let isMounted = true;
    const fetchSpouseData = async () => {
      if (userData?.spouse_keycloak_id) {
        const spouse = await ApiCustomers.search({ keycloak_id: userData.spouse_keycloak_id }, "or");
        if (isMounted) setSpouseData(spouse[0]);
      } else {
        if (isMounted) setSpouseData(null);
      }
    };
    fetchSpouseData();
    return () => { isMounted = false; };
  }, [userData?.spouse_keycloak_id]);


  const onSearchSpouse = useMemo(() => 
    debounce(async (term) => {
      if (term.length >= 2) {
        try {
        const results = await ApiCustomers.search({ email: term, name: term, user_id: term, keycloak_id: term }, "or")
        setSpouseSearchResult(results || []);
        } catch (error) { 
          console.error("Failed to search spouse", error);
          setSpouseSearchResult([]);
        }
      } else {
        setSpouseSearchResult([]);
      }
    }, 300),
    []
  );
  
  const onSetSpouse = async (spouse, forceUpdate = false) => {
    if (userData?.keycloak_id === spouse?.keycloak_id) {
      setAlert({
        visible: true,
        type: "error",
        message: t("UserDetails.cannotSetSpouseToSelf"),
      });
      return;
    }
    try {
      await ApiCustomers.setSpouse(
        userData?.keycloak_id,
        spouse?.keycloak_id,
        forceUpdate
      );
      setAlert({
        visible: true,
        type: "success",
        message: t("UserDetails.spouseUpdatedSuccessfully"),
      });
      refreshUserInfo();
      spouseModal.hideModal();
      setSelectedSpouse(null);
      setSpouseSearchResult([]);
    } catch (error) {
      if (error?.response?.status === 409 && !forceUpdate) {
        setSelectedSpouse(spouse); 
        setConfirmationInfo({
          desc: t("UserDetails.spouseConflictConfirmation"),
          btnTitle: t("UserDetails.forceUpdate"),
          onConfirm: () => onConfirmSetSpouse(spouse),
        });
        confirmationModal.showModal();
      } else {
        setAlert({
          visible: true,
          type: "error",
          message: `${t("UserDetails.failedToUpdateSpouse")}: ${error?.response?.data?.error}`,
        });
      }
      console.error("Failed to set spouse", error);
    }
  };

  const onConfirmSetSpouse = () => {
    confirmationModal.hideModal();
    if (selectedSpouse) {
      onSetSpouse(selectedSpouse, true);
    }
  };
  
  const onPressSetSpouse = () => {
    spouseModal.showModal();
  };

  const onConfirmRemoveSpouse = async () => {
    try {
        await ApiCustomers.setSpouse(userData?.keycloak_id, "", false); // Keep existing API call for now
        setAlert({
            visible: true,
            type: "success",
            message: t("UserDetails.spouseRemovedSuccessfully"), // New translation key
        });
        refreshUserInfo();
    } catch (error) {
        setAlert({
            visible: true,
            type: "error",
            message: t("UserDetails.failedToRemoveSpouse"), // Already handled in en.json
        });
        console.error("Failed to remove spouse", error);
    }
    confirmationModal.hideModal();
  }

  const onPressRemoveSpouse = () => {
    setConfirmationInfo({
      desc: t("UserDetails.confirmRemoveSpouse", {
        spouseName: `${spouseData?.first_name_vernacular ?? ""} ${spouseData?.last_name_vernacular ?? ""}`,
      }),
      btnTitle: t("UserDetails.yesDelete"),
      onConfirm: onConfirmRemoveSpouse,
    });
    confirmationModal.showModal();
  };

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

  const userDataArr = useMemo(() => {
    return Object.keys(userData || {}).flatMap((key) => {
      const isMembershipKey = !!membershipInfo.find((i) => i.key === key);
      const isStatusKey = key === "status";
      if (isMembershipKey || isStatusKey) {
        return []; // Skip this item.
      }
      return [{ key, value: userData[key] }];
    });
  }, [userData, spouseData]);

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

    Object.keys(formState.dirtyFields).forEach((key) => {
      let value = values[key];
      if (key === "marital_status" && value === "Unspecified") {
        value = null;
      } else if (key === "date_of_birth") {
        value = moment(value).format();
      }
      payload[key] = value;
    });

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

  const fetchComments = () => {
    if (!userData?.keycloak_id) return;

    dispatch(
      getComments(USER_DETAILS_PAGE_ID, userData?.keycloak_id, (data) =>
        setComments(data ?? [])
      )
    );
  };

  const onAddNoteClick = ({ note }) => {
    if (note && note?.length > 1) {
      dispatch(
        addComment(USER_DETAILS_PAGE_ID, userData?.keycloak_id, note, () =>
          fetchComments()
        )
      );

      resetNoteField({ note: "" });
    }
  };

  const onDeleteNoteClick = (id) => {
    setConfirmationInfo({
      desc: t("UserDetails.areYouSureYouWantToDeleteComment"),
      btnTitle: "UserDetails.yesDelete",
      onConfirm: () => onConfirmDeleteNote(id),
    });
    confirmationModal.showModal();
  };

  const onConfirmDeleteNote = (id) => {
    confirmationModal.hideModal();

    dispatch(
      removeCommentById(id, () => {
        setAlert({
          visible: true,
          message: t("UserDetails.commentSuccessfullyRemoved"),
        });
        fetchComments();
      })
    );
  };

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
      if (currentPayment?.user_id !== userData?.user_id) return;

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

        return;
      }

      setCardDetails(DEFAULT_CARD);
    } catch (error) {
      console.log("Failed to get card", error);
      setCardDetails(DEFAULT_CARD);
    }
  };

  const onPressCalculatePrice = () => {
    priceCalculatorModal.showModal();
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
    comments,
    activeTab,
    hasSpecial,
    currentUser,
    noteControl,
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
    onDeleteNoteClick,
    onPressAddSpecial,
    confirmationModal,
    mergeAccountsModal,
    onPressEditPayment,
    offlinePaymentModal,
    onPressDeleteSpecial,
    onPressOfflinePayment,
    onPressCancelMembership,
    onPressCalculatePrice,
    priceCalculatorModal,
    onPressSave: handleSubmit(onSubmit),
    onAddNoteClick: handleNoteSubmit(onAddNoteClick),
    // Spouse functionality
    spouseModal,
    spouseSearchResult,
    selectedSpouse,
    onSearchSpouse,
    setSelectedSpouse,
    onPressSetSpouse,
    onPressRemoveSpouse,
    onSetSpouse,
    spouseData,
  };
};
