import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../stylesheet/common.css";
import Helmet from "react-helmet";
import { Divider as MuiDivider, Grid, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import LoadingScreen from "./LoadingScreen";
import ConnectivityError from "./ConnectivityError";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/actions/userActions";
import { orders } from "../mockdata/order";
import moment from "moment";
import SideDrawer from "./Drawer";
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
const columns = [
  {
    name: "created_at",
    label: "Date",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value) => (
        <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
      ),
    },
  },
  {
    name: "FullName",
    label: "Full Name",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "Email",
    label: "Email",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "ProductType",
    label: "Product Type",
    options: {
      filter: true,
      sort: false,
    },
  },
  // {
  //   name: "Type",
  //   label: "Order Type",
  //   options: {
  //     filter: true,
  //     sort: false,
  //   }
  // },
  {
    name: "amount",
    label: "Amount",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "Status",
    label: "Status",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => {
        console.log(value);
        return (
          <>
            {value === "paid" && <SucessfulPayment>Paid </SucessfulPayment>}
            {value === "pending" && <PendingPayment>Pending </PendingPayment>}
            {value === "failed" && <FailedPayment>Failed </FailedPayment>}
          </>
        );
      },
    },
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: true,
      sort: false,
      customBodyRender: () => <ViewButton>View</ViewButton>,
    },
  },
];

const options = {
  filterType: "checkbox",
  download: false,
  print: false,
};
function EnhancedTable() {
  const updatedOrder = orders.map((order) => {
    order.FullName = `${order.FirstName} ${order.LastName}`;
    order.amount = `${order.Amount} ${order.Currency} `;
    return order;
  });
  const [data, setData] = React.useState(updatedOrder);
  const [error, setError] = useState(false);
  useEffect(() => {}, []);
  if (error) {
    return <ConnectivityError />;
  }
  return <MUIDataTable data={data} columns={columns} options={options} />;
}
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
            <EnhancedTable />
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

export default Orders;
