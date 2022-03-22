import { Button, Grid, TextField } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
const StyledGrid = styled(Grid)`
  margin: 25px 0px !important;
  background-color: #fff;
`;
const options = {
  selectableRows: false,
  download: false,
  print: false,
  pagination: false,
  responsive: "scroll",
  search: false,
  filter: false,
  viewColumns: false,
};
export default function Search() {
  const { t } = useTranslation();
  const columns = [
    {
      name: "firstName",
      label: t("Search.firstName"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "lastName",
      label: t("Search.lastName"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "email",
      label: t("Search.email"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "language",
      label: t("Search.language"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "country",
      label: t("Search.country"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "action",
      label: t("Search.action"),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  return (
    <Grid container>
      <Grid item xs={12}>
        <span>
          <TextField
            id="outlined-basic"
            label="Search"
            placeholder="abc@example.com"
            variant="outlined"
            style={{minWidth: "350px"}}
          />
        </span>{" "}
        &nbsp;&nbsp;
        <span>
          {" "}
          <Button
            variant="contained"
            color="primary"
            style={{ height: "100%" }}
          >
            {t("Search.name")}
          </Button>{" "}
        </span>
      </Grid>
      <StyledGrid item xs={12}>
        <MUIDataTable
          title={"Search Result"}
          data={[]}
          columns={columns}
          options={options}
        />
      </StyledGrid>
      <StyledGrid item xs={12}>
        <MUIDataTable
          title={"Search Special Result"}
          data={[]}
          columns={columns}
          options={options}
        />
      </StyledGrid>
    </Grid>
  );
}
