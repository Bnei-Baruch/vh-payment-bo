/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { fetchActivity } from "../../../redux/actions/customersActions";
import {
  defaultTableOptions,
  rowsPerPageOptions,
} from "../../../constants/table";

export const useData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { activity, loading } = useSelector((state) => state.customersReducer);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const options = {
    ...defaultTableOptions,
    rowsPerPage,
    serverSide: true,
    pagination: true,
    rowsPerPageOptions,
    count: activity.totalCount,
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("Activity.noRecords")
        ),
      },
    },
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          dispatch(fetchActivity(rowsPerPage, tableState.page * rowsPerPage));
          break;

        case "changeRowsPerPage":
          setRowsPerPage(tableState.rowsPerPage);
          dispatch(
            fetchActivity(
              tableState.rowsPerPage,
              tableState.page * tableState.rowsPerPage
            )
          );
          break;
      }
    },
  };

  const columns = [
    {
      name: "created_at",
      label: t("Activity.dateTime"),
      options: {
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
        ),
      },
    },
    {
      name: "first_name",
      label: t("Activity.firstName"),
    },
    {
      name: "last_name",
      label: t("Activity.lastName"),
    },
    {
      name: "email",
      label: t("Activity.email"),
    },
    {
      name: "product_type",
      label: t("Activity.productType"),
    },
    {
      name: "type",
      label: t("Activity.type"),
    },
    {
      name: "amount",
      label: t("Activity.amount"),
    },
    {
      name: "currency",
      label: t("Activity.currency"),
    },
    {
      name: "payment_status",
      label: t("Activity.status"),
    },
    {
      name: "paymentMethod",
      label: t("Activity.paymentMethod"),
    },
    {
      name: "additional_details_param_x",
      label: t("Activity.paramX"),
    },
  ];

  useEffect(() => {
    dispatch(fetchActivity(rowsPerPage, 0));
  }, [dispatch]);

  return { options, loading, columns, customerActivity: activity.list };
};
