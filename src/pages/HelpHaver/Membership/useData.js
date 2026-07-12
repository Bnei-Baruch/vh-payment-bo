/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useModal, useProfileBriefs } from "../../../hooks";
import {
  defaultTableOptions,
  rowsPerPageOptions,
} from "../../../constants/table";
import {
  fetchMembershipRequests,
  fetchRequestorDetails,
} from "../../../redux/actions/helpHaverActions";

export const useData = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const requestDetailsModal = useModal();
  const [page, setPage] = useState(0);
  const [requestId, setRequestId] = useState(null);
  const [searchKcid, setSearchKcid] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { loading, membershipRequests, requestsCount } = useSelector(
    (state) => state.helpHaverReducer
  );
  const briefs = useProfileBriefs((membershipRequests ?? []).map((r) => r.keycloak_id));

  const tableOptions = {
    ...defaultTableOptions,
    onRowClick: (rowData, { dataIndex }) => onPressDetails(membershipRequests[dataIndex]?.id),
    setRowProps: () => ({ style: { cursor: "pointer" } }),
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
              "kcid",
              searchKcid
            )
          );
          break;

        case "changeRowsPerPage":
          setRowsPerPage(tableState.rowsPerPage);
          dispatch(
            fetchMembershipRequests(
              tableState.rowsPerPage,
              tableState.page * tableState.rowsPerPage,
              "kcid",
              searchKcid
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
      name: "keycloak_id",
      label: t("AdminTable.ten"),
      options: { sort: false, customBodyRender: (kcid) => briefs[kcid]?.ten || "—" },
    },
    {
      name: "keycloak_id",
      label: t("AdminTable.country"),
      options: { sort: false, customBodyRender: (kcid) => briefs[kcid]?.country || "—" },
    },
    { name: "keycloak_id", label: t("HHGrants.keycloakId") },
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
    dispatch(fetchMembershipRequests(rowsPerPage, 0, "kcid", ""));
  }, [dispatch]);

  const onSearch = (keycloakId) => {
    const kcid = keycloakId ?? "";
    setSearchKcid(kcid);
    dispatch(fetchMembershipRequests(rowsPerPage, 0, "kcid", kcid));
  };

  const tsvHeaders = [
    t("HelpHaver.requestDate"), t("HelpHaver.requestStatus"), t("HelpHaver.userName"),
    t("AdminTable.ten"), t("AdminTable.country"), t("HHGrants.keycloakId"),
  ];
  const tsvRows = () =>
    (membershipRequests ?? []).map((r) => [
      moment(r.created_at).format("DD-MM-YYYY"), r.status, r.name,
      briefs[r.keycloak_id]?.ten, briefs[r.keycloak_id]?.country, r.keycloak_id,
    ]);

  return {
    page,
    loading,
    onSearch,
    tsvHeaders,
    tsvRows,
    requestId,
    rowsPerPage,
    tableColumns,
    tableOptions,
    membershipRequests,
    onBreadcrumbsClick,
    requestDetailsModal,
  };
};
