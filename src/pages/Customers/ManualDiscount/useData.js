/* eslint-disable react-hooks/exhaustive-deps, react/react-in-jsx-scope, default-case */
import React, { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars

import moment from "moment";
import { Button, CircularProgress, TableCell, TableRow } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@material-ui/icons/Cancel";

import { defaultTableOptions } from "../../../constants/table";
import { useModal } from "../../../hooks";
import { Enter } from "../../../constants/formData";
import {
  cancelManualDiscountEntry,
  fetchManualDiscounts,
} from "../../../redux/actions/customersActions";

export const useData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirmationModal = useModal();
  const addEntryModal = useModal();
  const editEntryModal = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeycloakId, setSelectedKeycloakId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isCancelError, setIsCancelError] = useState(false);
  const { manualDiscounts, loading } = useSelector((state) => state.customersReducer);

  useEffect(() => {
    dispatch(fetchManualDiscounts());
  }, []);

  const isActive = (row) =>
    moment(row.end_date).isAfter(moment()) && moment(row.start_date).isBefore(moment());

  const tableOptions = {
    ...defaultTableOptions,
    customRowRender: (values, idx) => {
      const row = manualDiscounts.list[idx];
      const active = isActive(row);

      return (
        <TableRow
          key={row.id}
          onClick={() => onPressEdit(row)}
          style={{
            fontStyle: active ? "normal" : "italic",
            background: active ? "#fff" : "#f3dfe3",
            cursor: "pointer",
          }}
        >
          {values.map((el, i) => (
            <TableCell key={`${i}${row.id}`}>{el}</TableCell>
          ))}
        </TableRow>
      );
    },
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("ManualDiscount.noRecords")
        ),
      },
    },
  };

  const tableColumns = [
    { name: "keycloak_id", label: t("ManualDiscount.keycloakId") },
    { name: "type", label: t("ManualDiscount.type") },
    {
      name: "properties",
      label: t("ManualDiscount.properties"),
      options: {
        customBodyRender: (value) => {
          if (!value) return "-";
          const p = typeof value === "string" ? JSON.parse(value) : value;
          if (p.discount_pct != null) return `${p.discount_pct}% off`;
          if (p.fixed_price != null) return `${p.fixed_price} ${p.currency}`;
          return JSON.stringify(p);
        },
      },
    },
    {
      name: "start_date",
      label: t("ManualDiscount.startDate"),
      options: {
        customBodyRender: (value) => <>{moment(value).format("DD-MM-YYYY")}</>,
      },
    },
    {
      name: "end_date",
      label: t("ManualDiscount.endDate"),
      options: {
        customBodyRender: (value) => <>{moment(value).format("DD-MM-YYYY")}</>,
      },
    },
    { name: "note", label: t("ManualDiscount.note") },
    {
      name: "keycloak_id",
      label: t("ManualDiscount.cancel"),
      options: {
        customBodyRender: (keycloakId, { rowIndex }) => {
          const row = manualDiscounts.list[rowIndex];
          if (!isActive(row)) return null;
          return (
            <Button
              variant="outlined"
              style={{ borderColor: "var(--color-red)", color: "var(--color-red)" }}
              startIcon={<CancelIcon />}
              onClick={(e) => { e.stopPropagation(); onPressCancel(keycloakId); }}
            >
              {t("ManualDiscount.cancel")}
            </Button>
          );
        },
      },
    },
  ];

  const onPressEdit = (row) => {
    setSelectedEntry(row);
    editEntryModal.showModal();
  };

  const onPressCancel = (keycloakId) => {
    confirmationModal.showModal();
    setSelectedKeycloakId(keycloakId);
  };

  const onConfirmCancel = () => {
    if (selectedKeycloakId) {
      dispatch(cancelManualDiscountEntry(
        selectedKeycloakId,
        confirmationModal.hideModal,
        () => { confirmationModal.hideModal(); setIsCancelError(true); },
      ));
    }
  };

  const onPressSearch = () => {
    dispatch(fetchManualDiscounts(searchQuery || undefined));
  };

  const onKeyDown = (e) => {
    if (e.key === Enter) onPressSearch();
  };

  return {
    onKeyDown,
    tableData: manualDiscounts.list,
    searchQuery,
    tableColumns,
    tableOptions,
    addEntryModal,
    editEntryModal,
    selectedEntry,
    onPressSearch,
    onConfirmCancel,
    setSearchQuery,
    confirmationModal,
    isCancelError,
    setIsCancelError,
  };
};
