import React, { forwardRef } from "react";

import { Controller } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
  Typography,
  Snackbar,
} from "@material-ui/core";

import { useData } from "./useData";
import languages from "../../../constants/languages";
import { currencies } from "../../../constants/currencies";
import { Alert } from "@material-ui/lab";

export const OfflinePayment = forwardRef(({ useModal, keycloakId }, ref) => {
  const { t } = useTranslation();
  const { isOpenAlert, setIsOpenAlert, control, onPressSubmit } = useData(
    ref,
    useModal,
    keycloakId
  );

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
          <MonetizationOnIcon style={{ marginRight: 10 }} />
          <Typography variant="h3">
            {t("UserDetails.offlinePayment")}
          </Typography>
        </Box>
        <Box p={5} display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Controller
              name="amount"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl focused={!!value}>
                  <InputLabel style={{ fontSize: 16 }}>
                    {t("UserDetails.amount")}
                  </InputLabel>
                  <TextField
                    type="number"
                    value={value}
                    onChange={onChange}
                    error={!!error?.message}
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                    style={{ marginTop: 16, maxWidth: 100 }}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="currency"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl focused={true}>
                  <InputLabel style={{ fontSize: 16 }}>
                    {t("UserDetails.currency")}
                  </InputLabel>
                  <Select value={value} onChange={onChange}>
                    {currencies.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="quantity"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl focused={!!value}>
                  <InputLabel style={{ fontSize: 16 }}>
                    {t("UserDetails.quantity")}
                  </InputLabel>
                  <TextField
                    type="number"
                    value={value}
                    onChange={onChange}
                    error={!!error?.message}
                    style={{ marginTop: 16, maxWidth: 100 }}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="payment_method"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl focused={!!value}>
                  <InputLabel style={{ fontSize: 16 }}>
                    {t("UserDetails.paymentMethod")}
                  </InputLabel>
                  <TextField
                    value={value}
                    error={!!error?.message}
                    style={{ marginTop: 16, minWidth: 180 }}
                    onChange={onChange}
                  />
                </FormControl>
              )}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            my={5}
            width="100%"
          >
            <Controller
              name="payment_date"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl focused={true} style={{ marginRight: 20 }}>
                  <InputLabel style={{ fontSize: 16 }}>
                    {t("UserDetails.paymentDate")}
                  </InputLabel>
                  <TextField
                    type="date"
                    value={value}
                    style={{ marginTop: 16, width: 200 }}
                    onChange={onChange}
                    error={!!error?.message}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="language"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl focused={!!value}>
                  <InputLabel style={{ fontSize: 16 }}>
                    {t("UserDetails.paymentLanguage")}
                  </InputLabel>
                  <Select
                    value={value}
                    style={{ width: 330 }}
                    onChange={onChange}
                  >
                    {languages.map(({ ISO, label }) => (
                      <MenuItem key={ISO} value={ISO}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Controller
            name="note"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl focused={!!value}>
                <InputLabel style={{ fontSize: 16 }}>
                  {t("UserDetails.note")}
                </InputLabel>
                <TextField
                  value={value}
                  style={{ marginTop: 16, width: 560, marginBottom: 20 }}
                  onChange={onChange}
                />
              </FormControl>
            )}
          />

          <Button
            onClick={onPressSubmit}
            variant="contained"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-white)",
            }}
          >
            {t("UserDetails.submit")}
          </Button>
        </Box>
      </Dialog>
      <Snackbar
        open={isOpenAlert}
        autoHideDuration={4000}
        onClose={() => setIsOpenAlert(false)}
      >
        <Alert severity="success" variant="filled">
          {t("UserDetails.paymentSuccessful")}
        </Alert>
      </Snackbar>
    </>
  );
}, []);
