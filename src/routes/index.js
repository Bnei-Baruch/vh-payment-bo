import React from "react";
import async from "../components/Async";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
// Pages components
const Dashboard = async(() => import("../pages/Dashboard"));
/**
 * Route for dashboard with header
 */
const analyticsRoute = {
  id: "Analytics",
  path: "/payment/analytics",
  header: "Events",
  icon: <ViewQuiltIcon />,
  children: [{
    id: "Customers",
    path: "/payment/analytics/customers",
    header: "Events",
    icon: <ViewQuiltIcon />,
    component: Dashboard,
  }, 
  {
    id: "Orders",
    path: "/payment/analytics/orders",
    header: "Events",
    icon: <ViewQuiltIcon />,
    component: Dashboard,
  }
],
};
/**
 * Route for Orders page with header
 */
const customerRoute = {
  id: "Customer",
  path: "/payment/orders",
  icon: <InsertDriveFileIcon />,
  children:  [{
    id: "Actiivty",
    path: "/payment/customer/activity",
    header: "Events",
    icon: <ViewQuiltIcon />,
    component: Dashboard,
  }, 
  {
    id: "Search",
    path: "/payment/customer/search",
    header: "Events",
    icon: <ViewQuiltIcon />,
    component: Dashboard,
  },
  {
    id: "Create",
    path: "/payment/customer/create",
    header: "Events",
    icon: <ViewQuiltIcon />,
    component: Dashboard,
  }
],
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  analyticsRoute,
  customerRoute,
];

// Routes visible in the sidebar
export const sidebarRoutes = [
  analyticsRoute,
  customerRoute,
];
