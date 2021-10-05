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
import { orders } from '../mockdata/order';
import moment from 'moment';
const Divider = styled(MuiDivider)(spacing);

const columns = [
  {
    name: "created_at",
    label: "Date",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value,) => (
        <>{moment(value).format('DD-MM-YYYY')}  </>
      )
      // display: false,
    }
  },
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
    }
  },
  {
    name: "Email",
    label: "Email",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "ProductType",
    label: "Product Type",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "Type",
    label: "Order Type",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "Amount",
    label: "Amount",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "Currency",
    label: "Currency",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "Status",
    label: "Status",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "lastPayment",
    label: "Last Payment",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "flag",
    label: "Flag",
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
  const [data, setData] = React.useState(orders);
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
function Orders() {
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
        <Helmet title={t('common.orders')} />
        <Grid
          justify="space-between"
          container
          spacing={10}
        >
          <Grid item>
            <Typography variant="h3" gutterBottom display="inline">
              {t('common.orders')}
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

export default Orders;