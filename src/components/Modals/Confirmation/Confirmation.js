import React from "react";

import { Button, Box, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export const Confirmation = ({
  useModal,
  title,
  description,
  onPressConfirm,
  confirmBtnTitle = "UserDetails.yesCancel",
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={useModal.isVisible} onClose={useModal.hideModal}>
      <Box py={5} px={6} display="flex" flexDirection="column">
        <HighlightOffIcon
          style={{
            marginBottom: 6,
            alignSelf: "flex-end",
            cursor: "pointer",
          }}
          onClick={useModal.hideModal}
        />
        <Typography
          variant="h3"
          align="center"
          style={{ marginBottom: 13, fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Typography variant="h4" style={{ marginBottom: 32 }}>
          {description}
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={onPressConfirm}
            variant="contained"
            style={{
              background: "var(--color-red)",
              color: "var(--color-white)",
            }}
          >
            {t(confirmBtnTitle)}
          </Button>
          <Button
            onClick={useModal.hideModal}
            variant="contained"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-white)",
            }}
          >
            {t("UserDetails.noBack")}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
