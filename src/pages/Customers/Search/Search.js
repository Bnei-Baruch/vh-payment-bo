import React from "react";

import {
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
import { Alert } from "@material-ui/lab";
import styled from "styled-components";

import { useData } from "./useData";
import "./styles.css";

const StyledGrid = styled(Grid)`
  margin: 25px 0px !important;
  background-color: #fff;
`;

export default function Search() {
  const { t } = useTranslation();
  const {
    alert,
    options,
    columns,
    loading,
    queryType,
    onKeyDown,
    searchQuery,
    onHideAlert,
    setQueryType,
    searchResult,
    onPressSearch,
    setSearchQuery,
  } = useData();

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label={t("Search.name")}
            variant="outlined"
            value={searchQuery}
            className="s-text-field"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Select
            value={queryType}
            className="query-type-selector"
            onChange={(e) => setQueryType(e.target.value)}
          >
            <MenuItem value="email">{t("Search.mail")}</MenuItem>
            <MenuItem value="name">{t("Search.nameLabel")}</MenuItem>
            <MenuItem value="paramX">{t("Search.paramX")}</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            className="s-search-btn"
            onClick={onPressSearch}
          >
            {t("Search.name")}
          </Button>
        </Grid>
        <StyledGrid item xs={12}>
          <MUIDataTable
            title={"Search Result"}
            data={loading ? [] : searchResult}
            columns={columns}
            options={options}
          />
        </StyledGrid>
      </Grid>
      <Snackbar
        open={alert.visible}
        onClose={onHideAlert}
        autoHideDuration={10000}
      >
        <Alert
          icon={false}
          severity="info"
          variant="filled"
          onClose={onHideAlert}
          style={{ whiteSpace: "pre-line" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
