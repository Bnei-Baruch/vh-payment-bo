/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import moment from "moment";
import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import {
  defaultTableOptions,
  rowsPerPageOptions,
} from "../../../constants/table";
import { useModal } from "../../../hooks";
import { Enter } from "../../../constants/formData";

const tableData = [
  {
    primary_email: "sharonkapach@gmail.com",
    keycloak_id: "38754aba-2eb8-4bd7-91dd-244b457da7d5",
    category: "1",
    sub_category: "1.1",
  },
  {
    primary_email: "abhinavshm95@gmail.com",
    keycloak_id: "5ca78e39-d1fa-417e-a0ec-12415dbcdc4a",
    category: "2",
    sub_category: "2.1",
  },
  {
    primary_email: "thefreecycler@gmail.com",
    keycloak_id: "cc48e2da-8430-408f-841a-66c2771318dd",
    category: "3",
    sub_category: "3.1",
  },
];

export const useData = () => {
  const { t } = useTranslation();
  const confirmationModal = useModal();
  const addEntryModal = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [queryType, setQueryType] = useState("email");
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const tableOptions = {
    ...defaultTableOptions,
    rowsPerPage,
    serverSide: true,
    pagination: true,
    rowsPerPageOptions,
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
      name: "primary_email",
      label: t("Specials.email"),
    },
    {
      name: "keycloak_id",
      label: t("Specials.keycloakId"),
    },
    {
      name: "expiration_date",
      label: t("Specials.expirationDate"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")}</>
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
        customBodyRender: () => (
          <Button
            variant="outlined"
            style={{
              borderColor: "var(--color-red)",
              color: "var(--color-red)",
            }}
            startIcon={<DeleteForeverIcon />}
            onClick={confirmationModal.showModal}
          >
            {t("Specials.remove")}
          </Button>
        ),
      },
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      onPressSearch();
    }
  }, [queryType]);

  const onPressSearch = () => null;

  const onKeyDown = (e) => {
    if (e.key === Enter) {
      onPressSearch();
    }
  };

  return {
    onKeyDown,
    tableData,
    queryType,
    searchQuery,
    tableColumns,
    tableOptions,
    setQueryType,
    addEntryModal,
    onPressSearch,
    setSearchQuery,
    confirmationModal,
  };
};
