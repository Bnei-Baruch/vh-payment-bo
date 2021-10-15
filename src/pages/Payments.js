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
import { payments } from "../mockdata/payments";
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
      sort: false,
      customBodyRender: (value) => (
        <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
      ),
      // display: false,
    },
  },
  {
    name: "ParamX",
    label: "ParamX",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "accountName",
    label: "Account Name",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "amount",
    label: "Amount",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "CCNumber",
    label: "Credit Card",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "CCExpDate",
    label: "Expiry Date",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "ProductType",
    label: "Charge Type",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "PaymentStatus",
    label: "Status",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => {
        console.log(value);
        return (
          <>
            {value === "success" && (
              <SucessfulPayment>Success </SucessfulPayment>
            )}
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
      customBodyRender: (value) => <ViewButton>View</ViewButton>,
    },
  },
];

const options = {
  filterType: "checkbox",
  download: false,
  print: false,
};

function EnhancedTable() {
  const [data, setData] = React.useState(payments);
  const [error, setError] = useState(false);
  useEffect(() => {}, []);
  if (error) {
    return <ConnectivityError />;
  }
  console.log(data);
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
        <Helmet title={t("common.payments")} />
        <Grid justify="space-between" container spacing={10}>
          <Grid item>
            <Typography variant="h3" gutterBottom display="inline">
              {t("common.payments")}
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

export default Payments;
