import React, { useEffect, useState } from "react";
import styled from "styled-components";
import '../stylesheet/common.css';
import Helmet from 'react-helmet';
import {
  Divider as MuiDivider,
  Grid,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import LoadingScreen from "./LoadingScreen";
import ConnectivityError from "./ConnectivityError";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";
const Divider = styled(MuiDivider)(spacing);
const columns = [
  {
    name: "accountId",
    label: "Account ID",
    options: {
      filter: false,
      sort: true,
      // display: false,
    }
  },
  {
    name: "fullName",
    label: "Full Name",
    options: {
      filter: false,
      sort: false,
      // display: false
    }
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: false,
      sort: false,
    }
  },
  {
    name: "country",
    label: "Country",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "languages",
    label: "Languages",
    options: {
      filter: true,
      sort: false,
    }
  }
  ,
  {
    name: "firstPurchaseDate",
    label: "First Purchase Date",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: true,
      sort: false,
    }
  }
];

const options = {
  filterType: 'checkbox',
  download: false,
  print: false
};

function EnhancedTable() {
  const [data, setData] = React.useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
  }, []);
  if (error) {
    return <ConnectivityError />
  }
  return <MUIDataTable
    data={data}
    columns={columns}
    options={options}
  />
}
function Payments() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const keycloak = useSelector(state => state.userReducer.keycloak);
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  useEffect(() => {
    if (keycloak && keycloak.isTokenExpired()) {
      //refresh token here and set in store
      keycloak.updateToken(30).success(() => {
        dispatch(setToken(keycloak.token));
        setPageLoaded(true);
      })
    } else {
      setPageLoaded(true);
    }
  }, [])
  if (pageLoaded) {
    return (
      <React.Fragment>
        <Helmet title={t('common.accounts')} />
        <Grid
          justify="space-between"
          container
          spacing={10}
        >
          <Grid item>
            <Typography variant="h3" gutterBottom display="inline">
              {t('common.accounts')}
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <EnhancedTable />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  } else {
    return <LoadingScreen />
  }
}

export default Payments;