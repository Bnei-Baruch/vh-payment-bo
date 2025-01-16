import React from "react";

import {
  Box,
  Card,
  Button,
  Snackbar,
  Typography,
  CardContent,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import EditIcon from "@material-ui/icons/Edit";
import PaymentIcon from "@material-ui/icons/Payment";

import { useData } from "./useData";

export const CardDetails = ({ useModal, userData }) => {
  const { t } = useTranslation();
  const { status, setStatus, cardDetails, onUpdateCardPress } = useData({
    userData,
  });

  return (
    <>
      <Dialog open={useModal.isVisible} onClose={useModal.hideModal}>
        <Box
          py={4}
          px={8}
          bgcolor="var(--color-primary)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          minWidth={500}
        >
          <PaymentIcon />
          <Typography variant="h3" style={{ marginLeft: 28 }}>
            {t("UserDetails.paymentCard")}
          </Typography>
        </Box>
        <Box p={5} display="flex" flexDirection="column" alignItems="center">
          <Card
            style={{
              width: 320,
              height: 190,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1b2430, #547eb6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                align="center"
                letterSpacing="2px"
                style={{ letterSpacing: "2px" }}
              >
                {cardDetails.number.match(/.{1,4}/g).join(" ")}
              </Typography>

              <Typography
                variant="h3"
                align="right"
                letterSpacing="2px"
                style={{ letterSpacing: "2px", marginRight: 12, marginTop: 12 }}
              >
                {cardDetails.expDate.match(/.{1,2}/g).join("/")}
              </Typography>
            </CardContent>
          </Card>
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={onUpdateCardPress}
            style={{
              background: "var(--color-primary)",
              color: "var(--color-white)",
              alignSelf: "center",
              marginTop: 30,
            }}
          >
            {t("UserDetails.updateCard")}
          </Button>
        </Box>
      </Dialog>

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
