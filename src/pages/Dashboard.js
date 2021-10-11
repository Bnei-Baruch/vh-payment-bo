import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Box
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import LoadingScreen from "./LoadingScreen";
import ConnectivityError from "./ConnectivityError";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";

import { orders } from '../mockdata/latestorder';
import moment from "moment";
import MUIDataTable from "mui-datatables";
const Divider = styled(MuiDivider)(spacing);
const ViewButton = styled.div`
  border: 1px solid #000;
  border-radius: 30px;
  padding: 3px 10px;
  text-align: center;
  cursor: pointer;
`;

const SucessfulPayment = styled.div`
  color: green;
  font-weight: 800;
`;
const PendingPayment = styled.div`
  color: orange;
  font-weight: 800;
`;
const FailedPayment = styled.div`
  color: red;
  font-weight: 800;
`;
const Typography = styled(MuiTypography)(spacing);
function Dashboard() {
  const keycloak = useSelector(state => state.userReducer.keycloak);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (keycloak && keycloak.isTokenExpired()) {
      //refresh token here and set in store
      keycloak.updateToken(30).success(() => {
        dispatch(setToken(keycloak.token));
      })
    }

  }, [])
  if (error) {
    return <ConnectivityError />
  }
  if (data) {
    return (
      <React.Fragment>
        <Helmet title="Default Dashboard" />
        <Grid justify="space-between" container spacing={6}>
          <Grid item>
            <Typography variant="h3" display="inline">
              Welcome
            </Typography>
          </Grid>
        </Grid>

        <Divider my={6} />
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={4}>
            <Box css={{
              width: '100%',
              height: 150,
              bgcolor: '#fff',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>

            </Box>
          </Grid>
          <Grid item md={4}>
            <Box css={{
              width: '100%',
              height: 150,
              bgcolor: '#fff',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>

            </Box>
          </Grid>
          <Grid item md={4}>
            <Box css={{
              width: '100%',
              height: 150,
              bgcolor: '#fff',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>

            </Box>
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={{
              width: '100%',
              height: 150,
              bgcolor: '#fff',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>
              <OrderTable />
            </Box>
          </Grid>
        </Grid>
        <Grid justify="space-between" container spacing={6}>
          <Grid item md={12}>
            <Box css={{
              width: '100%',
              height: 150,
              bgcolor: '#fff',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment >
    )
  } else {
    return <LoadingScreen />
  }
}
const columns = [
  {
    name: "created_at",
    label: "Date",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value) => (
        <>{moment(value).format('DD-MM-YYYY')}  </>
      )
    }
  },
  {
    name: "FullName",
    label: "Full Name",
    options: {
      filter: false,
      sort: false
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
    name: "amount",
    label: "Amount",
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
      customBodyRender: (value) => {
        console.log(value)
        return <>
          {value === 'paid' && <SucessfulPayment>Paid </SucessfulPayment>}
          {value === 'pending' && <PendingPayment>Pending </PendingPayment>}
          {value === 'failed' && <FailedPayment>Failed </FailedPayment>}
        </>
      }
    }
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: true,
      sort: false,
      customBodyRender: () => (
        <ViewButton>View</ViewButton>
      )
    }
  }
];

const options = {
  selectableRows: false,
  download: false,
  print: false,
  pagination: false,
  responsive: 'scroll'
};
function OrderTable() {
  const updatedOrder = orders.map(order => {
    order.FullName = `${order.FirstName} ${order.LastName}`;
    order.amount = `${order.Amount} ${order.Currency} `
    return order;
  })
  console.log(updatedOrder)
  const [data, setData] = React.useState(updatedOrder);
  const [error, setError] = useState(false);
  useEffect(() => {
  }, []);
  if (error) {
    return <ConnectivityError />
  }
  return <MUIDataTable
    title={'Latest 50 orders'}
    data={data}
    columns={columns}
    options={options}
  />
}

export default withTheme(Dashboard);
