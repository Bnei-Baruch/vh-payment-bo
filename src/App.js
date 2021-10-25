import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

import Helmet from "react-helmet";

import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";

import maTheme from "./theme";
import Routes from "./routes/Routes";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import English from "./locale/en.json";
import German from "./locale/de.json";
import Hebrew from "./locale/il.json";
import Spanish from "./locale/es.json";
import Russian from "./locale/ru.json";
import axios from "axios";
import LoadingScreen from "./pages/LoadingScreen";
import Keycloak from "keycloak-js";
import keycloakConfig from "./config/keycloak-config";
import {
  setKeycloakData,
  setToken,
  setUserRoles,
} from "./redux/actions/userActions";
var authToken = undefined;
axios.interceptors.request.use((c) => {
  if (authToken) {
    let header = {
      Authorization: "Bearer " + authToken,
      Accept: "application/json",
    };
    c.headers = header;
  }
  return c;
});
i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "en", // language to use
  resources: {
    en: { translation: English },
    us: { translation: English }, // 'common' is our custom namespace
    de: { translation: German },
    es: { translation: Spanish },
    il: { translation: Hebrew },
    ru: { translation: Russian },
  },
});
function App({ theme, token }) {
  authToken = token;
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const keycloak = Keycloak(keycloakConfig);
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        keycloak.loadUserProfile().then(async function () {
          dispatch(setToken(keycloak.token));
          dispatch(setKeycloakData(keycloak));
          dispatch(setUserRoles(keycloak.realmAccess.roles));
          if (authenticated) {
            setAuth(authenticated);
          }
        });
      });
  }, [dispatch]);
  return (
    <React.Fragment>
      <I18nextProvider i18n={i18next}>
        <Helmet
          titleTemplate="VH Payments Application | %s"
          defaultTitle="VH Payments Management"
        />
        <StylesProvider injectFirst>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiThemeProvider theme={maTheme[theme.currentTheme]}>
              <ThemeProvider theme={maTheme[theme.currentTheme]}>
                {auth ? <Routes /> : <LoadingScreen />}
              </ThemeProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </I18nextProvider>
    </React.Fragment>
  );
}

export default connect((store) => ({
  theme: store.themeReducer,
  token: store.userReducer.token,
}))(App);
