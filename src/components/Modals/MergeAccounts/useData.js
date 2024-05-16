import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../../hooks";
import { SAVE_MERGE_DETAILS } from "../../../redux/constants";
import { defaultTableOptions } from "../../../constants/table";
import { getAccountForMerge } from "../../../redux/actions/customersActions";

export const useData = (isVisible) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirmMergeModal = useModal();
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

  useEffect(() => {
    if (!isVisible) {
      setKeycloakId("");
      dispatch({
        type: SAVE_MERGE_DETAILS,
        payload: { fromAccount: null, toAccount: null },
      });
    }
  }, [dispatch, isVisible]);

  return {
    merge,
    userData,
    keycloakId,
    tableColumns,
    tableOptions,
    setKeycloakId,
    onPressSearch,
    isDisabledBtn,
    confirmMergeModal,
  };
};
