import React from "react";

import MUIDataTable from "mui-datatables";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Link } from "@material-ui/core";

import "../Membership/styles.css";
import { useData } from "../Membership/useData";
import { HelpRequestDetails } from "../../../components";
import { EVENTS_BREADCRUMBS } from "../../../routes/consts";
import { defaultTableOptions } from "../../../constants/table";

export default function Events() {
  const { t } = useTranslation();
  const {
    tableColumns,
    temporaryData,
    onBreadcrumbsClick,
    requestDetailsModal,
  } = useData();

  return (
    <div className="m-container">
      <div className="header-row">
        <div>
          <h3>{t("Events.helpHaverAppForEvents")}</h3>
          <Breadcrumbs aria-label="breadcrumb">
            {EVENTS_BREADCRUMBS.map(({ name, path }) => (
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
      </div>

      <MUIDataTable
        options={defaultTableOptions}
        columns={tableColumns}
        data={temporaryData}
      />

      <HelpRequestDetails type="events" useModal={requestDetailsModal} />
    </div>
  );
}
