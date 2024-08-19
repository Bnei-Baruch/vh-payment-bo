/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import moment from "moment";
import {
  Button,
  CircularProgress,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import {
  defaultTableOptions,
  rowsPerPageOptions,
} from "../../../constants/table";
import { useModal } from "../../../hooks";
import { Enter } from "../../../constants/formData";
import {
  fetchSpecials,
  removeSpecialEntry,
  searchSpecials,
} from "../../../redux/actions/customersActions";

export const useData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirmationModal = useModal();
  const addEntryModal = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [queryType, setQueryType] = useState("email");
  const [selectedEntryId, setSlectedEntryId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { specials, loading } = useSelector((state) => state.customersReducer);

  const tableOptions = {
    ...defaultTableOptions,
    rowsPerPage,
    serverSide: true,
    pagination: true,
    rowsPerPageOptions,
    customRowRender: (values, idx) => {
      const timeHasPassed = moment(specials.list[idx].end_date).isBefore(
        moment(new Date())
      );

      return (
        <TableRow
          key={specials.list[idx].id}
          style={{
            fontStyle: timeHasPassed ? "italic" : "normal",
            background: timeHasPassed ? "#f3dfe3" : "#fff",
          }}
        >
          {values.map((el, i) => (
            <TableCell key={`${i}${specials.list[idx].id}`}>{el}</TableCell>
          ))}
        </TableRow>
      );
    },
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("Specials.noRecords")
        ),
      },
    },
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changeRowsPerPage":
          setRowsPerPage(tableState.rowsPerPage);
          break;
      }
    },
  };

  const tableColumns = [
    {
      name: "email",
      label: t("Specials.email"),
    },
    {
      name: "keycloak_id",
      label: t("Specials.keycloakId"),
    },
    {
      name: "start_date",
      label: t("Specials.startDate"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:mm:ss")}</>
        ),
      },
    },
    {
      name: "end_date",
      label: t("Specials.endDate"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:mm:ss")}</>
        ),
      },
    },
    {
      name: "created_at",
      label: t("Specials.createdAt"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:mm:ss")}</>
        ),
      },
    },
    {
      name: "category",
      label: t("Specials.category"),
    },
    {
      name: "sub_category",
      label: t("Specials.subCategory"),
    },
    {
      name: "id",
      label: t("Specials.remove"),
      options: {
        customBodyRender: (id, { rowIndex }) => {
          const timeHasPassed = moment(
            specials.list[rowIndex].end_date
          ).isBefore(moment(new Date()));

          return (
            timeHasPassed || (
              <Button
                variant="outlined"
                style={{
                  borderColor: "var(--color-red)",
                  color: "var(--color-red)",
                }}
                startIcon={<DeleteForeverIcon />}
                onClick={() => onPressRemove(id)}
              >
                {t("Specials.remove")}
              </Button>
            )
          );
        },
      },
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      onPressSearch();
    }
  }, [queryType]);

  const onPressSearch = () => dispatch(searchSpecials(searchQuery, queryType));

  const onPressRemove = (id) => {
    confirmationModal.showModal();
    setSlectedEntryId(id);
  };

  const onKeyDown = (e) => {
    if (e.key === Enter) {
      onPressSearch();
    }
  };

  const onRemoveEntry = () => {
    if (selectedEntryId) {
      dispatch(
        removeSpecialEntry(selectedEntryId, confirmationModal.hideModal)
      );
    }
  };

  useEffect(() => {
    dispatch(fetchSpecials());
  }, [dispatch]);

  return {
    onKeyDown,
    tableData: specials.list,
    queryType,
    searchQuery,
    tableColumns,
    tableOptions,
    setQueryType,
    addEntryModal,
    onPressSearch,
    onRemoveEntry,
    setSearchQuery,
    confirmationModal,
  };
};
