import React from "react";

import MUIDataTable from "mui-datatables";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Link, Box } from "@material-ui/core";

import "./styles.css";
import { useData } from "./useData";
import { HelpRequestDetails, UserSearchField } from "../../../components";
import { MEMBERSHIP_BREADCRUMBS } from "../../../routes/consts";

export default function Membership() {
  const { t } = useTranslation();
  const {
    page,
    loading,
    onSearch,
    requestId,
    rowsPerPage,
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

      <Box mb={8} display="flex">
        <UserSearchField onSearch={onSearch} />
      </Box>

      <MUIDataTable
        data={loading ? [] : membershipRequests}
        options={tableOptions}
        columns={tableColumns}
      />

      <HelpRequestDetails
        useModal={requestDetailsModal}
        rowsPerPage={rowsPerPage}
        type="membership"
        id={requestId}
        page={page}
      />
    </div>
  );
}
