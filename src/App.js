import React from "react";
import { connect } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import Helmet from 'react-helmet';
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import maTheme from "./theme";
import Routes from "./routes/Routes";
import English from "./locale/en.json";
import German from "./locale/de.json";
import Hebrew from "./locale/il.json";
import Spanish from "./locale/es.json";
import Russian from "./locale/ru.json";
i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'en',                              // language to use
  resources: {
    en: { English },
    us: { English },         // 'common' is our custom namespace
    de: { German },
    es: { Spanish },
    il: { Hebrew },
    ru: { Russian }
  },
});
function App({ theme }) {
  return (
    <React.Fragment>
      <I18nextProvider i18n={i18next}>
        <Helmet
          titleTemplate="%s"
          defaultTitle="Admin Application for Payment Management"
        />
        <StylesProvider injectFirst>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiThemeProvider theme={maTheme[theme.currentTheme]}>
              <ThemeProvider theme={maTheme[theme.currentTheme]}>
                <Routes />
              </ThemeProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </I18nextProvider>
    </React.Fragment>
  );
}

export default connect(store => ({ theme: store.themeReducer }))(App);
