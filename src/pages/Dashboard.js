import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";
import Helmet from "react-helmet";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Box,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";

import LoadingScreen from "./LoadingScreen";
import ConnectivityError from "./ConnectivityError";
import { orders } from "../mockdata/latestorder";
import { payments } from "../mockdata/payments";
import OrderTable from "../components/tables/OrderTable";
import { boxStyle } from "../stylesheet/commonstyles";
import PaymentsTable from "../components/tables/PaymentsTable";
import { useTranslation } from "react-i18next";
import Stats from "../components/Stats";
import StatsImage from "../asset/img/totalsubscription.svg";
import FailedPaymentImage from "../asset/img/failedPayments.svg";
import RevenueImage from "../asset/img/revenue.svg";

const Divider = styled(MuiDivider)(spacing);
const Typography = styled(MuiTypography)(spacing);

function Dashboard() {
  const { t } = useTranslation();
  const keycloak = useSelector((state) => state.userReducer.keycloak);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (keycloak && keycloak.isTokenExpired()) {
      //refresh token here and set in store
      keycloak.updateToken(30).success(() => {
        dispatch(setToken(keycloak.token));
      });
    }
  }, [dispatch, keycloak]);
  if (error) {
    return <ConnectivityError />;
  }
  if (data) {
    return (
      <React.Fragment>
        <Helmet title="Default Dashboard" />
        <Grid justify="space-between" container spacing={6}>
          <Grid item>
            <Typography variant="h3" display="inline">
              {t("common.welcome")}
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={4} css={boxStyle}>
            <Stats
              image={StatsImage}
              title={t("dashboard.totalSubscription")}
              amount="2.532"
            />
          </Grid>
          <Grid item md={4}>
            <Stats
              image={FailedPaymentImage}
              title={t("dashboard.totalPayments")}
              amount="2.532"
            />
          </Grid>
          <Grid item md={4}>
            <Stats
              image={RevenueImage}
              title={t("dashboard.revenue")}
              amount="2.532"
            />
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={boxStyle}>
              <OrderTable
                orders={orders}
                tableHeader={t("dashboard.topOrders")}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={boxStyle}>
              <PaymentsTable
                payments={payments}
                tableHeader={t("dashboard.lastpayment")}
              />
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  } else {
    return <LoadingScreen />;
  }
}

export default withTheme(Dashboard);
