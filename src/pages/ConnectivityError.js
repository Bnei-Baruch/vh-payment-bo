import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Typography, Box } from "@material-ui/core";
import { Warning } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  linear: {
    height: "6px",
  },
  loader: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  central: {
    textAlign: "center",
    height: "100%",
    display: "grid",
    padding: "20px",
  },
  container: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  icon: {
    fontSize: "60px",
    color: "#ffcc00",
  },
  text: {
    fontSize: "20px",
  },
}));
function ConnectivityError() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <Box className={classes.central}>
        <div className={classes.container}>
          <Warning className={classes.icon} />
          <Typography className={classes.text}>
            {t("common.connectivityError")}
          </Typography>
        </div>
      </Box>
    </>
  );
}

export default ConnectivityError;
