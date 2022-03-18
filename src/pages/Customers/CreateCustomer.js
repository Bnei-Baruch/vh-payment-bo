import { Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import styled from 'styled-components';
import AddIcon from "@material-ui/icons/AddCircle";
import { DASHBOARD_ROUTES } from '../../routes/dashboardRoutes';
import { useHistory } from "react-router-dom";
const Card = styled(Paper)`
  padding: 20px;
  text-align: center;
  cursor: pointer;
  svg {
    font-size: 50px;
    margin-bottom: 10px;
    color: #777;
  }
`
export default function CreateCustomer() {
  let history = useHistory();
  const handleClick = (route) => {
    history.push(route);
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={3}>
        <Card elevation={1} onClick={() => handleClick(DASHBOARD_ROUTES.CustomerCreateAccount)}>
          <AddIcon />
          <Typography variant="h6">Add Account</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} onClick={() => handleClick(DASHBOARD_ROUTES.CustomerCreatePayment)}>
        <Card>
          <AddIcon />
          <Typography variant="h6">New Payment</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} onClick={() => handleClick(DASHBOARD_ROUTES.CustomerCreateOrder)}>
        <Card>
          <AddIcon />
          <Typography variant="h6">New Order</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} onClick={() => handleClick(DASHBOARD_ROUTES.CustomerCreateSpecial)}>
        <Card>
          <AddIcon />
          <Typography variant="h6">New Special</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} onClick={() => handleClick(DASHBOARD_ROUTES.CustomerCreatePaymentMethod)}>
        <Card>
          <AddIcon />
          <Typography variant="h6">New Payment Method</Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
