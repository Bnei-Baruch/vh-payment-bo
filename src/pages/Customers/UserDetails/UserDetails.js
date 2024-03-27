import React from "react";

import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import { useData } from "./useData";
import "./styles.css";

export default function UserDetails() {
  const { t } = useTranslation();
  const {
    goBack,
    orders,
    loading,
    options,
    payments,
    userDataArr,
    ordersColumns,
    paymentsColumns,
    userDataColumns,
  } = useData();

  return (
    <>
      <div className="ud-back-btn" onClick={goBack}>
        <ArrowBackIosIcon />
        <span>{t("UserDetails.backToSearch")}</span>
      </div>
      <div className="ud-label-wrapper">
        <div className="ud-label">{t("Orders.name")}</div>
        <div className="ud-label-mark" />
      </div>
      <MUIDataTable
        columns={ordersColumns}
        options={options}
        data={loading ? [] : orders}
      />

      <div className="ud-label-wrapper">
        <div className="ud-label">{t("UserDetails.payment")}</div>
        <div className="ud-label-mark" />
      </div>
      <MUIDataTable
        columns={paymentsColumns}
        options={options}
        data={loading ? [] : payments}
      />

      <div className="ud-label-wrapper">
        <div className="ud-label">{t("UserDetails.user")}</div>
        <div className="ud-label-mark" />
      </div>

      <div className="ud-tables-row">
        <MUIDataTable
          data={loading ? [] : userDataArr.slice(0, userDataArr.length / 2)}
          className="ud-table"
          columns={userDataColumns}
          options={options}
        />
        <MUIDataTable
          data={loading ? [] : userDataArr.slice(userDataArr.length / 2)}
          className="ud-table"
          columns={userDataColumns}
          options={options}
        />
      </div>

      <div className="ud-label-wrapper">
        <div className="ud-label">{t("Search.action")}</div>
        <div className="ud-label-mark" />
      </div>
      <div className="ud-button-group">
        <Button startIcon={<CancelIcon />} className="ud-button">
          {t("UserDetails.cancelMembership")}
        </Button>
        <Button startIcon={<MergeTypeIcon />} className="ud-button">
          {t("UserDetails.mergeFromOtherAccount")}
        </Button>
        <Button startIcon={<MonetizationOnIcon />} className="ud-button">
          {t("UserDetails.offlinePayment")}
        </Button>
      </div>
    </>
  );
}
