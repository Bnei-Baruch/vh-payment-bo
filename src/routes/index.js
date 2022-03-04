import React from "react";
import PollIcon from "@material-ui/icons/Poll";
import async from "../components/Async";
import { DASHBOARD_ROUTES } from "./dashboardRoutes";
import PeopleIcon from "@material-ui/icons/People";
const CustomerAnalytics = async(() => import("../pages/Analytics/Customers"));
const CustomerOrders = async(() => import("../pages/Analytics/Orders"));
const CustomerActivity = async(() => import("../pages/Customers/Activity"));
const CustomerCreate = async(() => import("../pages/Customers/Create"));
const CustomerSearch = async(() => import("../pages/Customers/Search"));

const dashboardRoutes = [
  {
    path: DASHBOARD_ROUTES.Analytics,
    id: "Analytics",
    icon: <PollIcon />,
    enableHeader: true,
    breadcrumbs: [{ name: "Analytics", path: DASHBOARD_ROUTES.Analytics }],
    children: [
      {
        path: DASHBOARD_ROUTES.CustomerAnalytics,
        id: "Customers",
        icon: <PollIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Analytics", path: DASHBOARD_ROUTES.Analytics },
          { name: "Customers", path: DASHBOARD_ROUTES.CustomerAnalytics },
        ],
        component: CustomerAnalytics,
      },
      {
        path: DASHBOARD_ROUTES.OrderAnalytics,
        id: "Orders",
        icon: <PollIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Analytics", path: DASHBOARD_ROUTES.Analytics },
          { name: "Orders", path: DASHBOARD_ROUTES.OrderAnalytics },
        ],
        component: CustomerOrders,
      },
    ],
  },
  {
    path: DASHBOARD_ROUTES.Customers,
    id: "Customers",
    icon: <PeopleIcon />,
    enableHeader: true,
    breadcrumbs: [{ name: "Customers", path: DASHBOARD_ROUTES.Customers }],
    children: [
      {
        path: DASHBOARD_ROUTES.CustomerActivity,
        id: "Activity",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Activity", path: DASHBOARD_ROUTES.CustomerActivity },
        ],
        component: CustomerActivity,
      },
      {
        path: DASHBOARD_ROUTES.CustomerSearch,
        id: "Search",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Search", path: DASHBOARD_ROUTES.CustomerSearch },
        ],
        component: CustomerSearch,
      },
      {
        path: DASHBOARD_ROUTES.CustomerCreate,
        id: "Create",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
        ],
        component: CustomerCreate,
      },
    ],
  },
];

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [...dashboardRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [...dashboardRoutes];
