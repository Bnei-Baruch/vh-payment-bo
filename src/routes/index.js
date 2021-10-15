import React from "react";
import async from "../components/Async";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import PersonIcon from "@material-ui/icons/Person";
import EqualizerIcon from "@material-ui/icons/Equalizer";
// Pages components
const Dashboard = async(() => import("../pages/Dashboard"));
const Payments = async(() => import("../pages/Payments"));
const Orders = async(() => import("../pages/Orders"));
const Accounts = async(() => import("../pages/Accounts"));
const Reports = async(() => import("../pages/Reports"));
const AccountDetails = async(() => import("../pages/AccountsDetailView"));
/**
 * Route for dashboard with header
 */
const dashboardRoute = {
  id: "Dashboard",
  path: "/payment/dashboard",
  header: "Events",
  icon: <ViewQuiltIcon />,
  component: Dashboard,
  children: null,
};
/**
 * Route for Orders page with header
 */
const ordersRoute = {
  id: "Orders",
  path: "/payment/orders",
  icon: <InsertDriveFileIcon />,
  component: Orders,
  children: null,
};
/**
 * Route for Payments Page with header
 */
const paymentRoute = {
  id: "Payments",
  path: "/payment/payments",
  icon: <ConfirmationNumberIcon />,
  component: Payments,
  children: null,
};
/**
 * Route for Accounts to user with header
 */
const accountsRoute = {
  id: "Accounts",
  path: "/payment/accounts",
  icon: <PersonIcon />,
  component: Accounts,
  children: null,
};
/**
 * Route for Reports with header
 */
const reportsRoutes = {
  id: "Reports",
  path: "/payment/reports",
  icon: <EqualizerIcon />,
  component: Reports,
  children: null,
};

const accountDetailsRoutes = {
  id: "Account Detail",
  path: "/payment/accounts/acountdetails",
  icon: <EqualizerIcon />,
  component: AccountDetails,
  children: null,
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  dashboardRoute,
  ordersRoute,
  paymentRoute,
  accountsRoute,
  reportsRoutes,
  accountDetailsRoutes,
];

// Routes visible in the sidebar
export const sidebarRoutes = [
  dashboardRoute,
  ordersRoute,
  paymentRoute,
  accountsRoute,
  reportsRoutes,
];
