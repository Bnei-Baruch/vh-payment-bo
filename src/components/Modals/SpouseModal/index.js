import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

export const SpouseModal = ({
  useModal,
  onSetSpouse,
  onSearchSpouse,
  spouseSearchResult,
  setSelectedSpouse,
  selectedSpouse, // Added selectedSpouse to props
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={useModal.isVisible} onClose={useModal.hideModal}>
      <DialogTitle>{t("UserDetails.setSpouse")}</DialogTitle>
      <DialogContent>
        <Autocomplete
          value={selectedSpouse}
          getOptionSelected={(option, value) => option.keycloak_id === value.keycloak_id}
          options={spouseSearchResult}
          getOptionLabel={(option) =>
            `${option.first_name_vernacular} ${option.last_name_vernacular} (${option.primary_email})`
          }
          filterOptions={(x) => x}
          style={{ width: 300 }}
          onInputChange={(event, newInputValue) => {
            onSearchSpouse(newInputValue);
          }}
          onChange={(event, newValue) => {
            setSelectedSpouse(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("UserDetails.searchSpouse")}
              variant="outlined"
            />
          )}
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
