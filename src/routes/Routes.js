import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { dashboardLayoutRoutes } from "./index";

import DashboardLayout from "../layouts/Dashboard";
import { useSelector } from "react-redux";

const childRoutes = (Layout, routes, roles) =>
  routes.map(({ children, path, component: Component, role }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          exact
          render={props => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ))
    ) : role === undefined ? (
      // Route item without children
      <Route
        key={index}
        path={path}
        exact
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    ) : role !== undefined && roles.includes(role) ? <Route
      key={index}
      path={path}
      exact
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    /> : null
  );

const Routes = () => {
  const roles = useSelector(state => state.userReducer.roles);
  return <Router>
    <Switch>
      {childRoutes(DashboardLayout, dashboardLayoutRoutes, roles)}
      <Redirect to="/payment/dashboard" />
    </Switch>
  </Router>
};

export default Routes;
