import React from "react";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";

import { currencies } from "../../../constants/currencies";
import { useData } from "./useData";

export const ManualDiscountModal = ({ useModal, editEntry }) => {
  const { t } = useTranslation();
  const { loading, control, discountType, isEditMode, isOpenAlert, setIsOpenAlert, onPressSubmit } =
    useData(useModal, editEntry);

  return (
    <>
      <Dialog open={useModal.isVisible} onClose={useModal.hideModal} maxWidth="sm" fullWidth>
        <Box
          py={4}
          px={8}
          bgcolor="var(--color-primary)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
        >
          {isEditMode ? (
            <EditIcon style={{ marginRight: 10 }} />
          ) : (
            <AddCircleOutlineIcon style={{ marginRight: 10 }} />
          )}
          <Typography variant="h3">
            {isEditMode ? t("ManualDiscount.editTitle") : t("ManualDiscount.addTitle")}
          </Typography>
        </Box>

        <Box p={5} display="flex" flexDirection="column" style={{ gap: 20 }}>
          <Controller
            name="keycloak_id"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label={t("ManualDiscount.keycloakId")}
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                disabled={isEditMode}
                fullWidth
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl variant="outlined" fullWidth>
                <InputLabel>{t("ManualDiscount.type")}</InputLabel>
                <Select value={value} onChange={onChange} label={t("ManualDiscount.type")}>
                  <MenuItem value="percent">{t("ManualDiscount.typePercent")}</MenuItem>
                  <MenuItem value="fixed_price">{t("ManualDiscount.typeFixedPrice")}</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {discountType === "percent" && (
            <Controller
              name="discount_pct"
              control={control}
              rules={{ required: true, validate: v => (parseFloat(v) > 0 && parseFloat(v) <= 100) || "Must be between 0 (exclusive) and 100 (inclusive)" }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  label={t("ManualDiscount.discountPct")}
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0.01, max: 100, step: 0.01 }}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  fullWidth
                />
              )}
            />
          )}

          {discountType === "fixed_price" && (
            <Box display="flex" style={{ gap: 16 }}>
              <Controller
                name="fixed_price"
                control={control}
                rules={{ required: true, min: 0 }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    label={t("ManualDiscount.fixedPrice")}
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    style={{ flex: 2 }}
                  />
                )}
              />
              <Controller
                name="currency"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl variant="outlined" style={{ flex: 1 }}>
                    <InputLabel>{t("ManualDiscount.currency")}</InputLabel>
                    <Select value={value} onChange={onChange} label={t("ManualDiscount.currency")}>
                      {currencies.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          )}

          <Box display="flex" style={{ gap: 16 }}>
            <Controller
              name="start_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl focused style={{ flex: 1 }}>
                  <InputLabel style={{ fontSize: 16 }}>{t("ManualDiscount.startDate")}</InputLabel>
                  <TextField
                    type="date"
                    value={value}
                    onChange={onChange}
                    style={{ marginTop: 16 }}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="end_date"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl focused style={{ flex: 1 }}>
                  <InputLabel style={{ fontSize: 16 }}>{t("ManualDiscount.endDate")}</InputLabel>
                  <TextField
                    type="date"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    style={{ marginTop: 16 }}
                  />
                </FormControl>
              )}
            />
          </Box>

          <Controller
            name="note"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={t("ManualDiscount.note")}
                variant="outlined"
                value={value}
                onChange={onChange}
                multiline
                rows={2}
                fullWidth
              />
            )}
          />
        </Box>

        <Box display="flex" justifyContent="center" style={{ gap: 12, marginBottom: 20 }}>
          <Button
            variant="outlined"
            style={{ width: 130 }}
            onClick={useModal.hideModal}
          >
            {isEditMode ? t("ManualDiscount.close") : t("ManualDiscount.cancel")}
          </Button>
          <Button
            onClick={onPressSubmit}
            variant="contained"
            style={{
              width: 130,
              background: "var(--color-primary)",
              color: "var(--color-white)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditMode ? (
              t("ManualDiscount.update")
            ) : (
              t("ManualDiscount.submit")
            )}
          </Button>
        </Box>
      </Dialog>

      <Snackbar
        open={isOpenAlert}
        autoHideDuration={4000}
        onClose={() => setIsOpenAlert(false)}
      >
        <Alert severity="success" variant="filled">
          {isEditMode ? t("ManualDiscount.updateSuccess") : t("ManualDiscount.createSuccess")}
        </Alert>
      </Snackbar>
    </>
  );
};
