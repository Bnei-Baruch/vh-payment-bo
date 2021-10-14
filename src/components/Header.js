import React, { useState } from "react";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { connect, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Hidden,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Typography,
  Button,
  Fade,
  Modal,
  createMuiTheme,
  Backdrop,
  makeStyles,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { ExitToApp, Menu as MenuIcon } from "@material-ui/icons";
import { style } from "@material-ui/system";
const theme = createMuiTheme();
const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;
const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "14.3rem",
  },

  icon: {
    margin: "0px 7px",
  },
  modal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 20,
    width: 400,
  },
  root: {
    "&:hover": {
      borderRadius: 0,
    },
    borderRadius: 0,
  },
  userName: {
    color: "#464A53",
    fontFamily: "Nunito",
    fontSize: "16px",
    fontWeight: "600",
  },
}));
function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

function setDirection(dir) {
  document.body.style.direction = dir;
}

const languages = [
  { code: "US", label: "United States", lang: "English", phone: "1" },
  { code: "IL", label: "Israel", lang: "Hebrew", phone: "972" },
  { code: "ES", label: "Spain", lang: "Spanish", phone: "34" },
  { code: "RU", label: "Russian", lang: "Russian", phone: "7" },
];

function LanguageMenu() {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [lang, setLang] = useState({
    lang: "English",
    code: "US",
  });
  const { i18n } = useTranslation("common");
  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const closeMenu = (lang, code) => {
    setAnchorMenu(null);
    setLang({
      lang: lang,
      code: code,
    });
    if (code === "IL") {
      setDirection("rtl");
    } else {
      setDirection("ltr");
    }
    i18n.changeLanguage(code.toLowerCase());
  };
  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
        className="lang-label"
      >
        {countryToFlag(lang.code)}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={(e) => setAnchorMenu(null)}
      >
        {languages &&
          languages.map((item) => {
            return (
              <MenuItem onClick={(e) => closeMenu(item.lang, item.code)}>
                {item.lang}
              </MenuItem>
            );
          })}
      </Menu>
    </React.Fragment>
  );
}

function UserMenu({ user, ...props }) {
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const state = useSelector((state) => state.userReducer.keycloak);
  const classes = useStyles();
  const { t } = useTranslation("common");

  const toggleMenu = (event) => setAnchorMenu(event.currentTarget);

  const closeMenu = () => setAnchorMenu(null);

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <IconButton
          aria-haspopup="true"
          aria-owns={anchorMenu ? "menu-appbar" : undefined}
          onClick={toggleMenu}
          color="inherit"
          className={classes.root}
          disableRipple={true}
        >
          <AccountCircleIcon className={classes.icon} />
          <Typography
            component={"span"}
            variant="subtitle1"
            className={classes.userName}
          >
            {state && state.profile
              ? state.profile.firstName + " " + state.profile.lastName
              : null}
          </Typography>
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorMenu}
          open={Boolean(anchorMenu)}
          onClose={closeMenu}
          getContentAnchorEl={null}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          transformOrigin={{ horizontal: "center", vertical: "top" }}
          className={classes.menu}
        >
          <MenuItem onClick={closeMenu}>
            <IconButton
              aria-haspopup="true"
              className={classes.root}
              aria-owns={anchorMenu ? "menu-appbar" : undefined}
              color="default"
              disableRipple={true}
              onClick={() => {
                closeMenu();
                setOpen(true);
              }}
            >
              <ExitToApp />{" "}
              <Typography
                component={"span"}
                variant="subtitle1"
                classes={style.icon}
              >
                {t("common.logout")}
              </Typography>
            </IconButton>
          </MenuItem>
        </Menu>

        <Modal
          open={open}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <p id="transition-modal-description">{t("common.surelogout")}</p>
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpen(false);
                    //Emitter.emit('lOGGED_OUT', true)
                    props.signout();
                  }}
                >
                  {t("common.yes") + ", " + t("common.logout")}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  color="primary"
                >
                  {t("common.no")}
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </ThemeProvider>
    </React.Fragment>
  );
}

const Header = ({ onDrawerToggle }) => (
  <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item></Grid>
          <Grid item xs />
          <Grid item>
            <LanguageMenu />
            <UserMenu />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export default connect()(withTheme(Header));
