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
import { accounts } from '../mockdata/account';
import moment from 'moment';
import SideDrawer from "./Drawer";
const Divider = styled(MuiDivider)(spacing);
const ViewButton = styled.div`
  border: 1px solid #000;
  border-radius: 30px;
  padding: 3px 10px;
  text-align: center;
  cursor: pointer;
`;
const columns = [
  {
    name: "FirstName",
    label: "First Name",
    options: {
      filter: false,
      sort: false,
      // display: false
    }
  },
  {
    name: "LastName",
    label: "Last Name",
    options: {
      filter: false,
      sort: false,
      // display: false
    }
  },
  {
    name: "Email",
    label: "Email",
    options: {
      filter: false,
      sort: false,
    }
  },
  {
    name: "Country",
    label: "Country",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "Phone",
    label: "Phone",
    options: {
      filter: true,
      sort: false,
    }
  }
  ,
  {
    name: "created_at",
    label: "Last Payment date",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value,) => (
        <>{moment(value).format('DD-MM-YYYY HH:MM:SS')}  </>
      )
    }
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <ViewButton>View</ViewButton>
      )
    }
  }
];

const options = {
  filterType: 'checkbox',
  download: false,
  print: false
};

function EnhancedTable() {
  const [data, setData] = React.useState(accounts);
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
  const [openDrawer, setOpenDrawer] = useState(false);
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
            <SideDrawer open={openDrawer} close={() => setOpenDrawer(false)} data={''} />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  } else {
    return <LoadingScreen />
  }
}

export default Payments;