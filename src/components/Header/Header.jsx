import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import { PAYMENTS_ROOT } from "../../routes/dashboardRoutes";

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    marginBottom: theme.spacing(6),
    "& .MuiTypography-colorInherit": {
      color: "#1E88E5",
    },
  },
}));

const Header = ({ name, breadcrumbs }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = (event, path) => {
    event.preventDefault();
    history.push(path);
  };

  return (
    <div>
      <Typography variant="h3">{t(`${name}.name`)}</Typography>
      {breadcrumbs.length ? (
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          {breadcrumbs.map((item) => (
            <Link
              key={item.name}
              color="textPrimary"
              href={item.path}
              onClick={(event) => handleClick(event, item.path)}
              aria-current="page"
            >
              {t(`${item.name}.name`)}
            </Link>
          ))}
        </Breadcrumbs>
      ) : null}
    </div>
  );
};

Header.propTypes = {
  name: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Header;
