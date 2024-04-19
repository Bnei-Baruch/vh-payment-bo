import React, { useEffect, useState } from "react";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../../hooks";
import { defaultTableOptions } from "../../../constants/table";
import {
  fetchMembershipRequests,
  fetchRequestorDetails,
} from "../../../redux/actions/helpHaverActions";

export const useData = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const requestDetailsModal = useModal();
  const [requestId, setRequestId] = useState(null);
  const { loading, membershipRequests } = useSelector(
    (state) => state.helpHaverReducer
  );

  const tableOptions = {
    ...defaultTableOptions,
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("HelpHaver.sorryNoMatching")
        ),
      },
    },
  };

  const tableColumns = [
    {
      name: "created_at",
      label: t("HelpHaver.requestDate"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")}</>
        ),
      },
    },
    {
      name: "status",
      label: t("HelpHaver.requestStatus"),
      options: {
        customBodyRender: (value) => (
          <div className={`status ${value?.toLowerCase()}`}>
            {value.toLowerCase()}
          </div>
        ),
      },
    },
    {
      name: "name",
      label: t("HelpHaver.userName"),
    },
    {
      name: "id",
      label: t("HelpHaver.action"),
      options: {
        customBodyRender: (id) => (
          <div className="details-btn" onClick={() => onPressDetails(id)}>
            {t("HelpHaver.details")}
          </div>
        ),
      },
    },
  ];

  const onPressDetails = (id) => {
    requestDetailsModal.showModal();
    setRequestId(id);
    const request = membershipRequests.find((req) => req.id === id);
    if (request?.keycloak_id) {
      dispatch(fetchRequestorDetails(request?.keycloak_id));
    }
  };

  const onBreadcrumbsClick = (e, path) => {
    e.preventDefault();
    history.push(path);
  };

  useEffect(() => {
    dispatch(fetchMembershipRequests());
  }, [dispatch]);

  return {
    loading,
    requestId,
    tableColumns,
    tableOptions,
    membershipRequests,
    onBreadcrumbsClick,
    requestDetailsModal,
  };
};
