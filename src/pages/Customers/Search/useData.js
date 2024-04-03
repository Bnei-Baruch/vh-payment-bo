/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import moment from "moment";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { searchCustomers } from "../../../redux/actions/customersActions";
import { DASHBOARD_ROUTES } from "../../../routes/dashboardRoutes";

export const useData = () => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [queryType, setQueryType] = useState("email");
  const { loading, searchResult } = useSelector(
    (state) => state.customersReducer
  );

  const options = {
    selectableRows: "none",
    download: false,
    print: false,
    pagination: false,
    search: false,
    filter: false,
    viewColumns: false,
    sort: false,
    onRowClick: (rowData) =>
      push(DASHBOARD_ROUTES.CustomerDetails, { userId: rowData[2] }),
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("Activity.noRecords")
        ),
      },
    },
  };

  const columns = [
    {
      name: "first_name_vernacular",
      label: t("Search.firstName"),
    },
    {
      name: "last_name_vernacular",
      label: t("Search.lastName"),
    },
    {
      name: "user_id",
      label: t("Search.userId"),
    },
    {
      name: "primary_email",
      label: t("Search.email"),
    },
    {
      name: "study_start_year",
      label: t("Search.studyStartYear"),
    },
    {
      name: "country",
      label: t("Search.country"),
    },
    {
      name: "city",
      label: t("Search.city"),
    },
    {
      name: "first_language",
      label: t("Search.language"),
    },
    {
      name: "created_at",
      label: t("Search.createdAt"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")}</>
        ),
      },
    },
    {
      name: "status",
      label: t("Search.status"),
      options: {
        customBodyRender: (value) => <>{value.membership_type}</>,
      },
    },
  ];

  useEffect(() => {
    dispatch(searchCustomers("", queryType));
  }, [dispatch]);

  const onPressSearch = () => {
    dispatch(searchCustomers(searchQuery, queryType));
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      dispatch(searchCustomers(searchQuery, queryType));
    }
  }, [queryType]);

  return {
    options,
    columns,
    loading,
    queryType,
    searchQuery,
    setQueryType,
    searchResult,
    onPressSearch,
    setSearchQuery,
  };
};
