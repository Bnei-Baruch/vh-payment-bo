import React, { useEffect, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Helmet from "react-helmet";
import styled from "styled-components";
import { Divider as MuiDivider, Grid, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import LoadingScreen from "./LoadingScreen";
import ConnectivityError from "./ConnectivityError";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";
import { accounts } from "../mockdata/account";
import SideDrawer from "./Drawer";
import "../stylesheet/common.css";
const Divider = styled(MuiDivider)(spacing);
const ViewButton = styled.div`
  border: 1px solid #000;
  border-radius: 30px;
  padding: 3px 10px;
  text-align: center;
  cursor: pointer;
`;

const options = {
  filterType: "checkbox",
  download: false,
  print: false,
};

function AccountsTable() {
  const { t } = useTranslation();
  const [data, setData] = React.useState(accounts);
  const [error, payments] = useState(false);
  useEffect(() => {
    if (false) {
      setData(accounts);
      payments(false);
    }
  }, []);
  const history = useHistory();
  const columns = [
    {
      name: "FirstName",
      label: t('accounts.firstName'),
      options: {
        filter: false,
        sort: false,
        // display: false
      },
    },
    {
      name: "LastName",
      label: t('accounts.lastName'),
      options: {
        filter: false,
        sort: false,
        // display: false
      },
    },
    {
      name: "Email",
      label: t('common.email'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Country",
      label: t('accounts.Country'),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Phone",
      label: t('accounts.Phone'),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "created_at",
      label: t('accounts.lastPaymentDate'),
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
        ),
      },
    },
    {
      name: "actions",
      label: t('common.actions'),
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (
          <ViewButton
            onClick={() =>
              history.push("/payment/accounts/acountdetails", {
                customer: value,
              })
            }
          >
            {t('common.view')}
          </ViewButton>
        ),
      },
    },
  ];
  if (error) {
    return <ConnectivityError />;
  }
  return <MUIDataTable data={data} columns={columns} options={options} />;
}
function Payments() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const keycloak = useSelector((state) => state.userReducer.keycloak);
  const dispatch = useDispatch();
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
        <Helmet title={t("common.accounts")} />
        <Grid justify="space-between" container spacing={10}>
          <Grid item>
            <Typography variant="h3" gutterBottom display="inline">
              {t("common.accounts")}
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <AccountsTable />
            <SideDrawer
              open={openDrawer}
              close={() => setOpenDrawer(false)}
              data={""}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  } else {
    return <LoadingScreen />;
  }
}

export default Payments;
