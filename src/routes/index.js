import React from "react";
import async from "../components/Async";
import {
  CreditCard,
  BarChart,
  Sliders,
  Users,
  DollarSign
} from "react-feather";

// Dashboards components
const Default = async(() => import("../pages/dashboards/Default"));

// Pages components
const Blank = async(() => import("../pages/pages/Blank"));
const InvoiceDetails = async(() => import("../pages/pages/InvoiceDetails"));
const PaymentsList = async(() => import("../pages/pages/Payments"));
const SubscriptionList = async(() => import("../pages/pages/SubscriptionList"));


const dashboardsRoutes = {
  id: "Dashboard",
  path: "/",
  icon: <Sliders />,
  containsHome: true,
  component : Default
};

const reportRoutes = {
  id: "Reports",
  path: "/reports",
  icon: <BarChart />,
  component: Blank
};

const paymentRoutes = {
  id: "Payments",
  path: "/payments",
  icon: <DollarSign />,
  component: PaymentsList
};

const subscriptionRoutes = {
  id: "Subscription",
  path: "/subscription",
  icon: <CreditCard />,
  component: SubscriptionList
};

const accountsRoute = {
  id: "Accounts",
  path: "/account",
  icon: <Users />,
  component : InvoiceDetails
}

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  dashboardsRoutes,
  reportRoutes,
  subscriptionRoutes,
  paymentRoutes,
  accountsRoute
];

// Routes visible in the sidebar
export const sidebarRoutes = [
  dashboardsRoutes,
  subscriptionRoutes,
  paymentRoutes,
  accountsRoute,
  reportRoutes
];
