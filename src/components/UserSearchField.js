import React, { useState } from "react";

import { Box, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { ProfileAutocomplete } from "./ProfileAutocomplete";

// Search box for keycloak-id-filtered lists. Type any text to look up a user
// (picking one by click or Enter fills the box with their keycloak id and
// searches immediately), or enter a raw keycloak id and press Enter / Search.
export const UserSearchField = ({ onSearch }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  return (
    <Box display="flex">
      <ProfileAutocomplete
        freeSolo
        label={t("UserSearch.placeholder")}
        style={{ minWidth: 320 }}
        inputValue={inputValue}
        // Ignore "reset" (MUI syncing the input to the selected option's label) —
        // onChange fills the box with the keycloak id instead.
        onInputChange={(event, value, reason) => {
          if (reason !== "reset") setInputValue(value);
        }}
        onChange={(event, option) => {
          // Fires on click and on Enter: a selected option arrives as an object
          // (mapped to its keycloak id), free text arrives as a string.
          const keycloakId =
            option?.keycloak_id ?? (typeof option === "string" ? option.trim() : "");
          if (option?.keycloak_id) setInputValue(option.keycloak_id);
          onSearch(keycloakId || undefined);
        }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ borderRadius: "0 4px 4px 0" }}
        onClick={() => onSearch(inputValue || undefined)}
      >
        {t("UserSearch.search")}
      </Button>
    </Box>
  );
};
