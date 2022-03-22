import { Grid } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import React from 'react'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
const StyledGrid = styled(Grid)`
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
export default function Activity() {
  const { t } = useTranslation();
  const columns = [
    {
      name: "dateTime",
      label: t("Activity.dateTime"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "name",
      label: t("Activity.userName"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "email",
      label: t("Activity.email"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "productType",
      label: t("Activity.productType"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "type",
      label: t("Activity.type"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "amount",
      label: t("Activity.amount"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "currency",
      label: t("Activity.currency"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "status",
      label: t("Activity.status"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "paymentMethod",
      label: t("Activity.paymentMethod"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "paramX",
      label: t("Activity.paramX"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "orderId",
      label: t("Activity.orderId"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "accountId",
      label: t("Activity.accountId"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "paymentMethodDetails",
      label: t("Activity.paymentMethodDetails"),
      options: {
        filter: false,
        sort: false,
      },
    }
  ];
  return (
    <Grid container spacing={6}>
      <StyledGrid item xs={12}>
        <MUIDataTable
          title={"Search Special Result"}
          data={[]}
          columns={columns}
          options={options}
        />
      </StyledGrid>
    </Grid>
  )
}
