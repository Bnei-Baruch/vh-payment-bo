/* eslint-disable react-hooks/exhaustive-deps, react/react-in-jsx-scope */
import React, { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars

import moment from "moment";
import { Button, Chip, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { defaultTableOptions } from "../../../constants/table";
import { useModal } from "../../../hooks";
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

  useEffect(() => {
    dispatch(fetchHHRequests());
  }, []);

  const tableOptions = {
    ...defaultTableOptions,
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
      options: { customBodyRender: (value) => value || "—" },
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
    {
      name: "id",
      label: t("HHGrants.action"),
      options: {
        customBodyRender: (id, { rowIndex }) => (
          <Button variant="outlined" color="primary" onClick={() => onPressDetails(rowIndex)}>
            {t("HHGrants.details")}
          </Button>
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

  return {
    onSearch,
    statusFilter,
    onChangeStatusFilter,
    tableData: hhRequests.list,
    tableColumns,
    tableOptions,
    detailsModal,
    selectedRequest,
  };
};
