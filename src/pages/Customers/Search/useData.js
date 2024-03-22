import React, { useEffect, useState } from "react";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { searchCustomers } from "../../../redux/actions/customersActions";

export const useData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchQuery, serSearchQuery] = useState("");
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
    dispatch(searchCustomers(""));
  }, [dispatch]);

  const onPressSearch = () => {
    dispatch(searchCustomers(searchQuery));
  };

  return {
    options,
    columns,
    loading,
    searchQuery,
    searchResult,
    onPressSearch,
    serSearchQuery,
  };
};
