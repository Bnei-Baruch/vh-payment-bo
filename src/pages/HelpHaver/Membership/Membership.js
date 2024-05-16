import React from "react";

import MUIDataTable from "mui-datatables";
import { useTranslation } from "react-i18next";
import {
  Breadcrumbs,
  Link,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";

import "./styles.css";
import { useData } from "./useData";
import { HelpRequestDetails } from "../../../components";
import { MEMBERSHIP_BREADCRUMBS } from "../../../routes/consts";

export default function Membership() {
  const { t } = useTranslation();
  const {
    page,
    loading,
    onKeyDown,
    requestId,
    queryType,
    rowsPerPage,
    searchQuery,
    tableColumns,
    tableOptions,
    setQueryType,
    onPressSearch,
    setSearchQuery,
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
        <TextField
          label={t("Search.name")}
          variant="outlined"
          className="search-field"
          onKeyDown={onKeyDown}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={queryType}
          className="query-type-selector"
          onChange={(e) => setQueryType(e.target.value)}
        >
          <MenuItem value="email">{t("Search.mail")}</MenuItem>
          <MenuItem value="name">{t("Search.nameLabel")}</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          className="search-btn"
          style={{ borderRadius: "0 4px 4px 0" }}
          onClick={onPressSearch}
        >
          {t("Search.name")}
        </Button>
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
