import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";

import Helmet from "react-helmet";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import LoadingScreen from "./LoadingScreen";
import ConnectivityError from "./ConnectivityError";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";
import { useTranslation } from "react-i18next";
const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);
function Default() {
  const { t } = useTranslation();
  const keycloak = useSelector((state) => state.userReducer.keycloak);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (keycloak && keycloak.isTokenExpired()) {
      //refresh token here and set in store
      keycloak.updateToken(30).success((token) => {
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
        <Helmet title={t("common.reports")} />
        <Grid justify="space-between" container spacing={6}>
          <Grid item>
            <Typography variant="h3" display="inline">
              {t("common.reports")}
            </Typography>
          </Grid>
        </Grid>
        <Divider my={6} />
        WIP
      </React.Fragment>
    );
  } else {
    return <LoadingScreen />;
  }
}

export default withTheme(Default);
