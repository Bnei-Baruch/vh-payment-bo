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
import { orders } from "../mockdata/latestorder";
import ConnectivityError from "./ConnectivityError";
import LoadingScreen from "./LoadingScreen";
import { useTranslation } from "react-i18next";
import { boxStyle } from "../stylesheet/commonstyles";
import OrderTable from "../components/tables/OrderTable";

const Divider = styled(MuiDivider)(spacing);
const Typography = styled(MuiTypography)(spacing);

function AccountsDetailView() {
  const { t } = useTranslation();
  const keycloak = useSelector((state) => state.userReducer.keycloak);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (false) {
      setData([]);
      setError(false);
    }
    if (keycloak && keycloak.isTokenExpired()) {
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
              {t("accounts.accountsDetails")}
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={6}>
            <Box css={boxStyle}>
              <Grid item md={12}>
                <Grid item md={6}>
                  First Name
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
              <Grid item md={12}>
                <Grid item md={6}>
                  Last Name
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
              <Grid item md={12}>
                <Grid item md={6}>
                  Email
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box css={boxStyle}>
              <Grid item md={12}>
                <Grid item md={6}>
                  Country
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
              <Grid item md={12}>
                <Grid item md={6}>
                  Phone
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
              <Grid item md={12}>
                <Grid item md={6}>
                  Last Payment
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={boxStyle}>
              <OrderTable orders={orders} />
            </Box>
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={boxStyle}>
              <OrderTable />
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  } else {
    return <LoadingScreen />;
  }
}

export default withTheme(AccountsDetailView);
