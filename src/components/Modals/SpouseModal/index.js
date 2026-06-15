import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { ProfileAutocomplete } from "../../ProfileAutocomplete";

export const SpouseModal = ({
  useModal,
  onSetSpouse,
  setSelectedSpouse,
  selectedSpouse,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={useModal.isVisible} onClose={useModal.hideModal}>
      <DialogTitle>{t("UserDetails.setSpouse")}</DialogTitle>
      <DialogContent>
        <ProfileAutocomplete
          value={selectedSpouse}
          label={t("UserDetails.searchSpouse")}
          style={{ width: 300 }}
          onChange={(event, newValue) => setSelectedSpouse(newValue)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={useModal.hideModal} color="primary">
          {t("UserDetails.noBack")}
        </Button>
        <Button onClick={() => onSetSpouse(selectedSpouse)} color="primary" disabled={!selectedSpouse}>
          {t("UserDetails.setSpouse")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
