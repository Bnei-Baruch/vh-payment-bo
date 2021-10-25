import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../stylesheet/common.css";
import Helmet from "react-helmet";
import { Divider as MuiDivider, Grid, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import LoadingScreen from "./LoadingScreen";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";
import { orders } from "../mockdata/order";
import OrderTable from "../components/tables/OrderTable";
import OrdersDrawer from "../components/Drawers/OrdersDrawer";
const Divider = styled(MuiDivider)(spacing);

function Orders() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const keycloak = useSelector((state) => state.userReducer.keycloak);
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (keycloak && keycloak.isTokenExpired()) {
      //refresh token here and set in store
      keycloak.updateToken(30).success(() => {
        dispatch(setToken(keycloak.token));
        setPageLoaded(true);
      });
    } else {
      setPageLoaded(true);
    }
  }, [dispatch, keycloak]);
  if (pageLoaded) {
    return (
      <React.Fragment>
        <Helmet title={t("common.orders")} />
        <Grid justify="space-between" container spacing={10}>
          <Grid item>
            <Typography variant="h3" gutterBottom display="inline">
              {t("common.orders")}
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <OrderTable
              orders={orders}
              openDrawer={() => setOpenDrawer(true)}
            />
            <OrdersDrawer
              open={openDrawer}
              close={() => setOpenDrawer(false)}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  } else {
    return <LoadingScreen />;
  }
}

export default Orders;
