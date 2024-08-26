import React from "react";

import {
  FormControl,
  InputLabel,
  TextField,
  Box,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import { useData } from "./useData";

export const AddSpecialEntry = ({ useModal, email, keycloakId }) => {
  const { t } = useTranslation();
  const { loading, isOpenAlert, setIsOpenAlert, control, onPressSubmit } =
    useData(useModal, email, keycloakId);

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
          minWidth={600}
        >
          <AddCircleOutlineIcon style={{ marginRight: 10 }} />
          <Typography variant="h3">{t("Specials.addNewEntry")}</Typography>
        </Box>
        <Box p={5} display="flex" justifyContent="space-between">
          <Controller
            name="keycloak_id"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl focused={!!value}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("Specials.keycloakId")}
                </InputLabel>
                <TextField
                  value={value}
                  onChange={onChange}
                  disabled={!!keycloakId}
                  error={!!error?.message}
                  style={{ marginTop: 16, minWidth: 267 }}
                />
              </FormControl>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl focused={!!value}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("Specials.email")}
                </InputLabel>
                <TextField
                  value={value}
                  disabled={!!email}
                  onChange={onChange}
                  error={!!error?.message}
                  style={{ marginTop: 16, minWidth: 267 }}
                />
              </FormControl>
            )}
          />
        </Box>

        <Box px={5} mb={5} display="flex" justifyContent="space-between">
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl focused={!!value}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("Specials.category")}
                </InputLabel>
                <TextField
                  value={value}
                  onChange={onChange}
                  error={!!error?.message}
                  style={{ marginTop: 16, width: 267 }}
                />
              </FormControl>
            )}
          />
          <Controller
            name="subcategory"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl focused={!!value}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("Specials.subCategory")}
                </InputLabel>
                <TextField
                  value={value}
                  onChange={onChange}
                  error={!!error?.message}
                  style={{ marginTop: 16, width: 267 }}
                />
              </FormControl>
            )}
          />
        </Box>

        <Box px={5} mb={10} display="flex" justifyContent="space-between">
          <Controller
            name="start_date"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl focused={true}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("Specials.startDate")}
                </InputLabel>
                <TextField
                  type="date"
                  value={value}
                  onChange={onChange}
                  error={!!error?.message}
                  style={{ marginTop: 16, width: 267 }}
                />
              </FormControl>
            )}
          />

          <Controller
            name="end_date"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl focused={true}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("Specials.endDate")}
                </InputLabel>
                <TextField
                  type="date"
                  value={value}
                  onChange={onChange}
                  error={!!error?.message}
                  style={{ marginTop: 16, width: 267 }}
                />
              </FormControl>
            )}
          />
        </Box>

        <Button
          onClick={onPressSubmit}
          variant="contained"
          style={{
            width: 170,
            marginBottom: 20,
            marginLeft: "auto",
            marginRight: "auto",
            background: "var(--color-primary)",
            color: "var(--color-white)",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("Specials.submit")
          )}
        </Button>
      </Dialog>
      <Snackbar
        open={isOpenAlert}
        autoHideDuration={4000}
        onClose={() => setIsOpenAlert(false)}
      >
        <Alert severity="success" variant="filled">
          {t("Specials.newEntrySuccessfullyAdded")}
        </Alert>
      </Snackbar>
    </>
  );
};
