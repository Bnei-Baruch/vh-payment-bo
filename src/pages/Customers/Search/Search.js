import React from "react";

import { Button, Grid, TextField, Select, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
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
    options,
    columns,
    loading,
    queryType,
    searchQuery,
    setQueryType,
    searchResult,
    onPressSearch,
    setSearchQuery,
  } = useData();

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          id="outlined-basic"
          label="Search"
          placeholder="abc@example.com"
          variant="outlined"
          value={searchQuery}
          className="s-text-field"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={queryType}
          className="query-type-selector"
          onChange={(e) => setQueryType(e.target.value)}
        >
          <MenuItem value="email">Mail</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="paramX">Param X</MenuItem>
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
  );
}
