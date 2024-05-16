/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../../hooks";
import {
  defaultTableOptions,
  rowsPerPageOptions,
} from "../../../constants/table";
import {
  fetchMembershipRequests,
  fetchRequestorDetails,
} from "../../../redux/actions/helpHaverActions";
import { Enter } from "../../../constants/formData";

export const useData = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const requestDetailsModal = useModal();
  const [page, setPage] = useState(0);
  const [requestId, setRequestId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryType, setQueryType] = useState("email");
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { loading, membershipRequests, requestsCount } = useSelector(
    (state) => state.helpHaverReducer
  );

  const tableOptions = {
    ...defaultTableOptions,
    rowsPerPage,
    serverSide: true,
    pagination: true,
    rowsPerPageOptions,
    count: requestsCount,
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("HelpHaver.sorryNoMatching")
        ),
      },
    },
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          setPage(tableState.page);
          dispatch(
            fetchMembershipRequests(
              rowsPerPage,
              tableState.page * rowsPerPage,
              queryType,
              searchQuery
            )
          );
          break;

        case "changeRowsPerPage":
          setRowsPerPage(tableState.rowsPerPage);
          dispatch(
            fetchMembershipRequests(
              tableState.rowsPerPage,
              tableState.page * tableState.rowsPerPage,
              queryType,
              searchQuery
            )
          );
          break;
      }
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
    dispatch(fetchMembershipRequests(rowsPerPage, 0, queryType, ""));
  }, [dispatch]);

  const onPressSearch = () => {
    dispatch(fetchMembershipRequests(rowsPerPage, 0, queryType, searchQuery));
  };

  const onKeyDown = (e) => {
    if (e.key === Enter) {
      onPressSearch();
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      onPressSearch();
    }
  }, [queryType]);

  return {
    page,
    loading,
    onKeyDown,
    requestId,
    queryType,
    searchQuery,
    rowsPerPage,
    tableColumns,
    tableOptions,
    setQueryType,
    onPressSearch,
    setSearchQuery,
    membershipRequests,
    onBreadcrumbsClick,
    requestDetailsModal,
  };
};
