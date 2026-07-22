/* eslint-disable react-hooks/exhaustive-deps, react/react-in-jsx-scope */
import React, { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars

import moment from "moment";
import { Chip, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { defaultTableOptions } from "../../../constants/table";
import { useModal, useProfileBriefs } from "../../../hooks";
import { isGrantActive, grantMonths } from "../../../components/Modals/HHRequestDetails/useData";
import { statusColor } from "../../../components/Modals/HHRequestDetails/HHRequestDetails";
import { fetchHHRequests } from "../../../redux/actions/helpHaverActions";

export const useData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const detailsModal = useModal();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchKcid, setSearchKcid] = useState("");
  const { hhRequests, loading } = useSelector((state) => state.helpHaverReducer);
  const briefs = useProfileBriefs(hhRequests.list.map((r) => r.keycloak_id));

  useEffect(() => {
    dispatch(fetchHHRequests());
  }, []);

  const grantSummary = (grant) =>
    grant ? `${grant.discount_pct}% / ${grantMonths(grant)} ${t("HHGrants.months").toLowerCase()}` : "";

  const tableOptions = {
    ...defaultTableOptions,
    onRowClick: (rowData, { dataIndex }) => onPressDetails(dataIndex),
    setRowProps: () => ({ style: { cursor: "pointer" } }),
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("HHGrants.noRecords")
        ),
      },
    },
  };

  const tableColumns = [
    {
      name: "created_at",
      label: t("HHGrants.requestDate"),
      options: {
        customBodyRender: (value) => <>{moment(value).format("DD-MM-YYYY")}</>,
      },
    },
    {
      name: "status",
      label: t("HHGrants.status"),
      options: {
        customBodyRender: (value) => (
          <Chip size="small" variant="outlined" label={value?.toLowerCase()}
            style={{ borderColor: statusColor[value?.toUpperCase()], color: statusColor[value?.toUpperCase()] }} />
        ),
      },
    },
    {
      name: "member_name",
      label: t("HHGrants.memberName"),
      options: {
        // Prefer the live profile name; fall back to the orders account name.
        // Lite render gets the data index — correct row even when sorted/filtered.
        customBodyRenderLite: (dataIndex) => {
          const row = hhRequests.list[dataIndex];
          return briefs[row?.keycloak_id]?.name || row?.member_name || "—";
        },
      },
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
    {
      name: "type",
      label: t("HHGrants.type"),
      options: {
        customBodyRender: (value) => t(`HHGrants.type_${value}`, value),
      },
    },
    {
      name: "requested_pct",
      label: t("HHGrants.requestedPct"),
      options: {
        customBodyRender: (value) => `${value}%`,
      },
    },
    { name: "months", label: t("HHGrants.months") },
    {
      name: "grant",
      label: t("HHGrants.grant"),
      options: {
        customBodyRender: (grant) =>
          grant ? (
            <Chip
              size="small"
              label={`${grant.discount_pct}% / ${grantMonths(grant)} ${t("HHGrants.months").toLowerCase()} · ${
                isGrantActive(grant) ? t("HHGrants.grantActive") : t("HHGrants.grantEnded")
              }`}
              color={isGrantActive(grant) ? "primary" : "default"}
            />
          ) : (
            "—"
          ),
      },
    },
  ];

  const onPressDetails = (rowIndex) => {
    setSelectedRequest(hhRequests.list[rowIndex]);
    detailsModal.showModal();
  };

  const onSearch = (keycloakId) => {
    const kcid = keycloakId ?? "";
    setSearchKcid(kcid);
    dispatch(fetchHHRequests(statusFilter, kcid));
  };

  const onChangeStatusFilter = (status) => {
    setStatusFilter(status);
    dispatch(fetchHHRequests(status, searchKcid));
  };

  const tsvHeaders = [
    t("HHGrants.requestDate"), t("HHGrants.status"), t("HHGrants.memberName"),
    t("AdminTable.ten"), t("AdminTable.country"), t("HHGrants.keycloakId"),
    t("HHGrants.type"), t("HHGrants.requestedPct"), t("HHGrants.months"), t("HHGrants.grant"),
  ];
  const tsvRows = () =>
    hhRequests.list.map((r) => [
      moment(r.created_at).format("DD-MM-YYYY"), r.status,
      briefs[r.keycloak_id]?.name || r.member_name, briefs[r.keycloak_id]?.ten,
      briefs[r.keycloak_id]?.country, r.keycloak_id,
      t(`HHGrants.type_${r.type}`, r.type), r.requested_pct, r.months, grantSummary(r.grant),
    ]);

  return {
    onSearch,
    statusFilter,
    onChangeStatusFilter,
    tsvHeaders,
    tsvRows,
    tableData: hhRequests.list,
    tableColumns,
    tableOptions,
    detailsModal,
    selectedRequest,
  };
};
