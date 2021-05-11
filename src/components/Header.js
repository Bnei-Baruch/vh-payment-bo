import React, { useState } from "react";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import {
  Grid,
  Hidden,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Menu as MenuIcon } from "@material-ui/icons";

import {
  Power
} from "react-feather";

const AppBar = styled(MuiAppBar)`
  background: #222C3C;
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const StyledGrid = styled(Grid)`
  display : contents;
`;
const languages = [
  { code: 'US', label: 'United States', lang: 'English', phone: '1' },
  { code: 'IL', label: 'Israel', lang: 'Hebrew', phone: '972' },
  { code: 'ES', label: 'Spain', lang: 'Spanish', phone: '34' },
  { code: 'RU', label: 'Russian', lang: 'Russian', phone: '7' }
];

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

function setDirection(dir) {
  document.body.style.direction = dir;
}
function LanguageMenu() {
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const [lang, setLang] = React.useState({
    "lang" : "English",
    "code" : "US"
  });
  const { i18n } = useTranslation();
  const toggleMenu = event => {
    setAnchorMenu(event.currentTarget);
  };
  const closeMenu = (lang, code) => {
    setAnchorMenu(null);
    setLang({
      "lang" : lang,
      "code" : code
    })
    if (code === "IL") {
      setDirection('rtl');
    } else {
      setDirection('ltr');
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
      <div className="header-lang-text" onClick={toggleMenu}>{lang.lang}</div>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={(e) => setAnchorMenu(null)}
      >
        {languages && languages.map(item => {
          return <MenuItem onClick={(e) => closeMenu(item.lang, item.code)}>
            {item.lang}
          </MenuItem>
        })}
      </Menu>
    </React.Fragment>
  )
}

function UserMenu() {
  const [anchorMenu, setAnchorMenu] = useState(null);

  const toggleMenu = event => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
      >
        <Power />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>
          Profile
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          Sign out
        </MenuItem>
      </Menu>
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
          <Grid item>
          </Grid>
          <Grid item xs />
          <StyledGrid item>
            <LanguageMenu />
            <UserMenu />
          </StyledGrid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export default connect()(withTheme(Header));
