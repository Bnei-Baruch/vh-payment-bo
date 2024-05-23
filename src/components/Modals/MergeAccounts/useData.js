import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../../hooks";
import { SAVE_MERGE_DETAILS } from "../../../redux/constants";
import { defaultTableOptions } from "../../../constants/table";
import {
  getAccountForMerge,
  mergeAccounts,
} from "../../../redux/actions/customersActions";

export const useData = (isVisible, hideModal, callback) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirmMergeModal = useModal();
  const [alert, setAlert] = useState({ visible: false, message: "" });
  const [keycloakId, setKeycloakId] = useState("");
  const { merge } = useSelector((state) => state.customersReducer);

  const onPressSearch = () =>
    dispatch(
      keycloakId.length > 0 && keycloakId !== merge.toAccount?.keycloak_id
        ? getAccountForMerge(keycloakId)
        : { type: SAVE_MERGE_DETAILS, payload: { fromAccount: null } }
    );

  const tableColumns = [
    { name: "key", label: "" },
    { name: "value", label: "" },
  ];

  const tableOptions = {
    ...defaultTableOptions,
    textLabels: {
      body: {
        noMatch: t("UserDetails.enterValidKeycloakIdToSearch"),
      },
    },
  };

  const userData = useMemo(
    () =>
      merge.fromAccount
        ? Object.keys(merge.fromAccount).flatMap((key) =>
            key === "status" ? [] : [{ key, value: merge.fromAccount[key] }]
          )
        : [],
    [merge.fromAccount]
  );

  const isDisabledBtn = useMemo(() => userData.length === 0, [userData]);

  const alertType = useMemo(
    () =>
      alert.message === t("UserDetails.somethingWentWrong")
        ? "error"
        : "success",
    [alert.message, t]
  );

  useEffect(() => {
    if (!isVisible) {
      setKeycloakId("");
      dispatch({
        type: SAVE_MERGE_DETAILS,
        payload: { fromAccount: null, toAccount: null },
      });
    }
  }, [dispatch, isVisible]);

  const onConfirmMerge = () => {
    confirmMergeModal.hideModal();
    dispatch(
      mergeAccounts(
        merge.fromAccount?.keycloak_id,
        merge.toAccount?.keycloak_id,
        onSuccess,
        onFailed
      )
    );
  };

  const onSuccess = () => {
    hideModal();
    setAlert({
      visible: true,
      message: t("UserDetails.accountsHaveBeenSuccessfullyMerged"),
    });
    callback();
  };

  const onFailed = () => {
    setAlert({
      visible: true,
      message: t("UserDetails.somethingWentWrong"),
    });
  };

  const onHideAlert = () => setAlert((p) => ({ ...p, visible: false }));

  return {
    merge,
    alert,
    userData,
    alertType,
    keycloakId,
    onHideAlert,
    tableColumns,
    tableOptions,
    setKeycloakId,
    onPressSearch,
    isDisabledBtn,
    onConfirmMerge,
    confirmMergeModal,
  };
};
