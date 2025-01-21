import React from "react";

import {
  Card,
  Tooltip,
  Snackbar,
  Typography,
  CardContent,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

import { useData } from "./useData";

export const CardDetails = ({ userData }) => {
  const { t } = useTranslation();
  const { status, setStatus, cardDetails, onUpdateCardPress } = useData({
    userData,
  });

  return (
    <>
      <Tooltip
        arrow
        title={t("UserDetails.updateCard")}
        placement="right"
        onClick={onUpdateCardPress}
      >
        <Card
          style={{
            width: 280,
            height: 166,
            borderRadius: 10,
            background: "linear-gradient(135deg, #1b2430, #547eb6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              letterSpacing="2px"
              style={{ letterSpacing: "2px" }}
            >
              {cardDetails.number.match(/.{1,4}/g).join(" ")}
            </Typography>

            <Typography
              variant="h4"
              align="right"
              letterSpacing="2px"
              style={{ letterSpacing: "2px", marginRight: 9, marginTop: 12 }}
            >
              {cardDetails.expDate.match(/.{1,2}/g).join("/")}
            </Typography>
          </CardContent>
        </Card>
      </Tooltip>

      <Snackbar
        open={!!status}
        autoHideDuration={4000}
        onClose={() => setStatus(null)}
      >
        {status && (
          <Alert
            severity={status === "success" ? "success" : "error"}
            variant="filled"
          >
            {t(
              status === "success"
                ? "UserDetails.succesfullyUpdatedCard"
                : "UserDetails.failedToUpdateCard"
            )}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
