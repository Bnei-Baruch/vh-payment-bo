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
import { AccountsSection } from '../components/Drawers/DrawerComponents/AccountsComponent'
import OrdersDrawer from "../components/Drawers/OrdersDrawer";
import { payments } from "../mockdata/payments";
import PaymentsDrawer from "../components/Drawers/PaymentsDrawer";
import PaymentsTable from "../components/tables/PaymentsTable";

const Divider = styled(MuiDivider)(spacing);
const Typography = styled(MuiTypography)(spacing);

const DataGrid = styled(Grid)`
  padding: 15px 0px;
  >div {
    min-height : auto !important;
    padding : 15px;
  }
  >div>div>div {
    margin: 15px 0px;
  }
`;

function AccountsDetailView() {
  const { t } = useTranslation();
  const keycloak = useSelector((state) => state.userReducer.keycloak);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const [showPaymentsDrawer, setShowPaymentsDrawer] = useState(false);
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
        <Helmet title={t('common.accountsDetails')} />
        <Grid justify="space-between" container spacing={6}>
          <Grid item>
            <Typography variant="h3" display="inline">
              {t("accounts.accountsDetails")}
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <DataGrid>
          <Box css={boxStyle}>
            <AccountsSection />
          </Box>
        </DataGrid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={boxStyle}>
              <OrderTable
                orders={orders}
                openDrawer={() => setShowOrderDrawer(true)}
                tableHeader={t("accounts.userOrder")}
              />
              <OrdersDrawer
                open={showOrderDrawer}
                close={() => setShowOrderDrawer(false)}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={boxStyle}>
              <PaymentsTable
                payments={payments}
                openDrawer={() => setShowPaymentsDrawer(true)}
                tableHeader={t("accounts.usersPayments")}
              />
              <PaymentsDrawer
                open={showPaymentsDrawer}
                close={() => setShowPaymentsDrawer(false)}
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

export default withTheme(AccountsDetailView);
