import React from "react";

import { Button, Grid, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";

import { useData } from "./useData";

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
    searchQuery,
    searchResult,
    onPressSearch,
    serSearchQuery,
  } = useData();

  return (
    <Grid container>
      <Grid item xs={12}>
        <span>
          <TextField
            id="outlined-basic"
            label="Search"
            placeholder="abc@example.com"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => serSearchQuery(e.target.value)}
            style={{ minWidth: "350px", marginRight: "10px" }}
          />
        </span>
        <span>
          <Button
            variant="contained"
            color="primary"
            style={{ height: "100%" }}
            onClick={onPressSearch}
          >
            {t("Search.name")}
          </Button>
        </span>
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
