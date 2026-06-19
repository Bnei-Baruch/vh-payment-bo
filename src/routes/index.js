import React from "react";
import PollIcon from "@material-ui/icons/Poll";
import async from "../components/Async";
import { DASHBOARD_ROUTES } from "./dashboardRoutes";
import PeopleIcon from "@material-ui/icons/People";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";

const CustomerAnalytics = async(() => import("../pages/Analytics/Customers"));
const CustomerOrders = async(() => import("../pages/Analytics/Orders"));
const CustomerActivity = async(() =>
  import("../pages/Customers/Activity/Activity")
);
const CustomerCreate = async(() => import("../pages/Customers/CreateCustomer"));
const CustomerSearch = async(() => import("../pages/Customers/Search/Search"));
const CustomerSpecials = async(() =>
  import("../pages/Customers/Specials/Specials")
);
const CustomerManualDiscount = async(() =>
  import("../pages/Customers/ManualDiscount/ManualDiscount")
);
const CustomerDetails = async(() =>
  import("../pages/Customers/UserDetails/UserDetails")
);
const CustomerCreateAccount = async(() =>
  import("../pages/Customers/Create/AddAccount")
);
const CustomerCreatePaymentMethod = async(() =>
  import("../pages/Customers/Create/AddNewPaymentMethod")
);
const CustomerCreateNewSpecial = async(() =>
  import("../pages/Customers/Create/AddNewSpecial")
);
const CustomerCreateAddOrder = async(() =>
  import("../pages/Customers/Create/AddOrder")
);
const CustomerCreateAddPayment = async(() =>
  import("../pages/Customers/Create/AddPayment")
);
const Events = async(() => import("../pages/HelpHaver/Events/Events"));
const Membership = async(() =>
  import("../pages/HelpHaver/Membership/Membership")
);
const HHGrants = async(() => import("../pages/HelpHaver/Grants/Grants"));

const sideRoutes = [
  // {
  //   path: DASHBOARD_ROUTES.Analytics,
  //   id: "Analytics",
  //   icon: <PollIcon />,
  //   enableHeader: true,
  //   breadcrumbs: [{ name: "Analytics", path: DASHBOARD_ROUTES.Analytics }],
  //   children: [
  //     {
  //       path: DASHBOARD_ROUTES.CustomerAnalytics,
  //       id: "Customers",
  //       icon: <PollIcon />,
  //       enableHeader: true,
  //       breadcrumbs: [
  //         { name: "Analytics", path: DASHBOARD_ROUTES.Analytics },
  //         { name: "Customers", path: DASHBOARD_ROUTES.CustomerAnalytics },
  //       ],
  //       component: CustomerAnalytics,
  //     },
  //     {
  //       path: DASHBOARD_ROUTES.OrderAnalytics,
  //       id: "Orders",
  //       icon: <PollIcon />,
  //       enableHeader: true,
  //       breadcrumbs: [
  //         { name: "Analytics", path: DASHBOARD_ROUTES.Analytics },
  //         { name: "Orders", path: DASHBOARD_ROUTES.OrderAnalytics },
  //       ],
  //       component: CustomerOrders,
  //     },
  //   ],
  // },
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
        path: DASHBOARD_ROUTES.CustomerSpecials,
        id: "Specials",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Specials", path: DASHBOARD_ROUTES.CustomerSpecials },
        ],
        component: CustomerSpecials,
      },
      {
        path: DASHBOARD_ROUTES.CustomerManualDiscount,
        id: "ManualDiscount",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "ManualDiscount", path: DASHBOARD_ROUTES.CustomerManualDiscount },
        ],
        component: CustomerManualDiscount,
      },
      // {
      //   path: DASHBOARD_ROUTES.CustomerCreate,
      //   id: "Create",
      //   icon: <PeopleIcon />,
      //   enableHeader: true,
      //   breadcrumbs: [
      //     { name: "Customers", path: DASHBOARD_ROUTES.Customers },
      //     { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
      //   ],
      //   component: CustomerCreate,
      // },
    ],
  },
  {
    path: DASHBOARD_ROUTES.HelpHaver,
    id: "HelpHaver",
    icon: <InsertDriveFileOutlinedIcon />,
    enableHeader: true,
    breadcrumbs: [{ name: "HelpHaver", path: DASHBOARD_ROUTES.HelpHaver }],
    children: [
      {
        path: DASHBOARD_ROUTES.HelpHaverMembership,
        id: "HHMembershipV1",
        component: Membership,
      },
      {
        path: DASHBOARD_ROUTES.HelpHaverMembershipV2,
        id: "HHGrants",
        component: HHGrants,
      },
      // {
      //   path: DASHBOARD_ROUTES.HelpHaverEvents,
      //   id: "Events",
      //   component: Events,
      // },
    ],
  },
];

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
        path: DASHBOARD_ROUTES.CustomerSpecials,
        id: "Specials",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Specials", path: DASHBOARD_ROUTES.CustomerSpecials },
        ],
        component: CustomerSpecials,
      },
      {
        path: DASHBOARD_ROUTES.CustomerManualDiscount,
        id: "ManualDiscount",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "ManualDiscount", path: DASHBOARD_ROUTES.CustomerManualDiscount },
        ],
        component: CustomerManualDiscount,
      },
      {
        path: DASHBOARD_ROUTES.CustomerDetails,
        id: "UserDetails",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Search", path: DASHBOARD_ROUTES.CustomerSearch },
          { name: "UserDetails", path: DASHBOARD_ROUTES.CustomerDetails },
        ],
        component: CustomerDetails,
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
      {
        path: DASHBOARD_ROUTES.CustomerCreateAccount,
        id: "CreateAccount",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
          {
            name: "CreateAccount",
            path: DASHBOARD_ROUTES.CustomerCreateAccount,
          },
        ],
        component: CustomerCreateAccount,
      },
      {
        path: DASHBOARD_ROUTES.CustomerCreateOrder,
        id: "CreateOrder",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
          { name: "CreateOrder", path: DASHBOARD_ROUTES.CustomerCreateOrder },
        ],
        component: CustomerCreateAddOrder,
      },
      {
        path: DASHBOARD_ROUTES.CustomerCreatePayment,
        id: "CreatePayment",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
          {
            name: "CreatePayment",
            path: DASHBOARD_ROUTES.CustomerCreatePayment,
          },
        ],
        component: CustomerCreateAddPayment,
      },
      {
        path: DASHBOARD_ROUTES.CustomerCreateSpecial,
        id: "CreateSpecial",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
          {
            name: "CreateSpecial",
            path: DASHBOARD_ROUTES.CustomerCreateSpecial,
          },
        ],
        component: CustomerCreateNewSpecial,
      },
      {
        path: DASHBOARD_ROUTES.CustomerCreatePaymentMethod,
        id: "CreatePaymentMethod",
        icon: <PeopleIcon />,
        enableHeader: true,
        breadcrumbs: [
          { name: "Customers", path: DASHBOARD_ROUTES.Customers },
          { name: "Create", path: DASHBOARD_ROUTES.CustomerCreate },
          {
            name: "CreatePaymentMethod",
            path: DASHBOARD_ROUTES.CustomerCreatePaymentMethod,
          },
        ],
        component: CustomerCreatePaymentMethod,
      },
    ],
  },
  {
    path: DASHBOARD_ROUTES.HelpHaver,
    id: "HelpHaver",
    enableHeader: true,
    breadcrumbs: [{ name: "HelpHaver", path: DASHBOARD_ROUTES.HelpHaver }],
    children: [
      {
        path: DASHBOARD_ROUTES.HelpHaverMembership,
        id: "HHMembershipV1",
        component: Membership,
      },
      {
        path: DASHBOARD_ROUTES.HelpHaverMembershipV2,
        id: "HHGrants",
        component: HHGrants,
      },
      {
        path: DASHBOARD_ROUTES.HelpHaverEvents,
        id: "Events",
        component: Events,
      },
    ],
  },
];

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [...dashboardRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [...sideRoutes];
