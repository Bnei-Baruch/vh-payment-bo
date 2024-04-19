import React from "react";

import MUIDataTable from "mui-datatables";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Link } from "@material-ui/core";

import "./styles.css";
import { useData } from "./useData";
import { HelpRequestDetails } from "../../../components";
import { MEMBERSHIP_BREADCRUMBS } from "../../../routes/consts";

export default function Membership() {
  const { t } = useTranslation();
  const {
    loading,
    requestId,
    tableColumns,
    tableOptions,
    membershipRequests,
    onBreadcrumbsClick,
    requestDetailsModal,
  } = useData();

  return (
    <div className="m-container">
      <div className="header-row">
        <h3>{t("Membership.helpHaverAppForMembership")}</h3>
        <Breadcrumbs aria-label="breadcrumb">
          {MEMBERSHIP_BREADCRUMBS.map(({ name, path }) => (
            <Link
              key={name}
              href={path}
              aria-current="page"
              color="textPrimary"
              onClick={(e) => onBreadcrumbsClick(e, path)}
            >
              {t(`${name}.name`)}
            </Link>
          ))}
        </Breadcrumbs>
      </div>

      <MUIDataTable
        data={loading ? [] : membershipRequests}
        options={tableOptions}
        columns={tableColumns}
      />

      <HelpRequestDetails
        useModal={requestDetailsModal}
        type="membership"
        id={requestId}
      />
    </div>
  );
}
