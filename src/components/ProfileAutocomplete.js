import React from "react";

import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { useProfileSearch } from "../hooks";

// Autocomplete over profiles, searching by any text property as the user types.
export const ProfileAutocomplete = ({ label, onInputChange, ...autocompleteProps }) => {
  const { options, loading, search } = useProfileSearch();

  return (
    <Autocomplete
      options={options}
      loading={loading}
      getOptionSelected={(option, value) => option.keycloak_id === value?.keycloak_id}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.first_name_vernacular} ${option.last_name_vernacular} (${option.primary_email})`
      }
      filterOptions={(x) => x}
      onInputChange={(event, value, reason) => {
        if (reason !== "reset") search(value);
        if (onInputChange) onInputChange(event, value, reason);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} color="inherit" /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...autocompleteProps}
    />
  );
};
