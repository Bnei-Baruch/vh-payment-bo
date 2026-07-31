import React from "react";

import moment from "moment";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert, Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LockIcon from "@material-ui/icons/Lock";

import countries from "../../../constants/countries";
import { pricingCurrencies } from "../../../constants/currencies";
import { Confirmation } from "../Confirmation";
import { useData } from "./useData";

// DiscountFields + BenefitFields are the "fixed after first redemption" group;
// they render disabled with a lock hint once the coupon has redemptions.
const CouponModal = ({ useModal, coupon }) => {
  const { t } = useTranslation();
  const {
    loading,
    control,
    isEditMode,
    locked,
    discountType,
    benefitType,
    redemptions,
    isOpenAlert,
    setIsOpenAlert,
    createdCode,
    setCreatedCode,
    revokeOk,
    setRevokeOk,
    errorMsg,
    setErrorMsg,
    confirmationModal,
    onPressRevoke,
    onConfirmRevoke,
    onPressSubmit,
  } = useData(useModal, coupon);

  return (
    <>
      <Dialog open={useModal.isVisible} onClose={useModal.hideModal} maxWidth="sm" fullWidth>
        <Box py={4} px={8} bgcolor="var(--color-primary)" display="flex" alignItems="center" justifyContent="center" color="white">
          <Typography variant="h3">
            {isEditMode ? t("Coupons.editTitle") : t("Coupons.createTitle")}
          </Typography>
        </Box>

        <Box p={5} display="flex" flexDirection="column" style={{ gap: 20 }}>
          {!isEditMode && (
            <Controller
              name="prefix"
              control={control}
              rules={{ required: true, pattern: { value: /^[A-Z][A-Z0-9-]*$/, message: t("Coupons.prefixLetters") } }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField label={t("Coupons.prefix")} variant="outlined" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} error={!!error} fullWidth helperText={error?.message || t("Coupons.prefixHint")} />
              )}
            />
          )}

          {isEditMode && (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <TextField label={t("Coupons.code")} variant="outlined" value={coupon.code} disabled />
              <Controller
                name="enabled"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={<Switch checked={!!value} onChange={(e) => onChange(e.target.checked)} color="primary" />}
                    label={t("Coupons.enabled")}
                  />
                )}
              />
            </Box>
          )}

          {/* ---- Fixed-after-first-redemption group ---- */}
          <Box p={2} bgcolor="var(--color-light-grey, #f5f5f5)" borderRadius={4}>
            <Box display="flex" alignItems="center" style={{ gap: 6 }} mb={1}>
              <Typography variant="subtitle2">{t("Coupons.discountAndBenefit")}</Typography>
              {locked && <LockIcon fontSize="small" color="disabled" />}
            </Box>
            {locked && (
              <Typography variant="caption" color="textSecondary">
                {t("Coupons.lockedHint", { count: coupon.redemptions_count })}
              </Typography>
            )}

            <Box display="flex" flexDirection="column" style={{ gap: 16, marginTop: 12 }}>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>{t("Coupons.type")}</InputLabel>
                    <Select value={value} onChange={onChange} label={t("Coupons.type")} disabled={locked}>
                      <MenuItem value="percent">{t("Coupons.typePercent")}</MenuItem>
                      <MenuItem value="fixed_price">{t("Coupons.typeFixedPrice")}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              {discountType === "percent" && (
                <Controller
                  name="discount_pct"
                  control={control}
                  rules={{ required: true, validate: (v) => (parseFloat(v) >= 1 && parseFloat(v) <= 99) || t("Coupons.pctRange") }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField label={t("Coupons.discountPct")} variant="outlined" type="number" inputProps={{ min: 1, max: 99, step: 1 }} value={value} onChange={onChange} error={!!error} helperText={error?.message} disabled={locked} fullWidth />
                  )}
                />
              )}

              {discountType === "fixed_price" && (
                <Box display="flex" style={{ gap: 16 }}>
                  <Controller
                    name="fixed_price"
                    control={control}
                    rules={{ required: true, validate: (v) => parseFloat(v) > 0 || t("Coupons.fixedPriceRange") }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField label={t("Coupons.fixedPrice")} variant="outlined" type="number" inputProps={{ min: 0.01, step: 0.01 }} value={value} onChange={onChange} error={!!error} disabled={locked} style={{ flex: 2 }} />
                    )}
                  />
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControl variant="outlined" style={{ flex: 1 }}>
                        <InputLabel>{t("Coupons.currency")}</InputLabel>
                        <Select value={value} onChange={onChange} label={t("Coupons.currency")} disabled={locked}>
                          {pricingCurrencies.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
              )}

              <Controller
                name="benefit_type"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>{t("Coupons.benefitType")}</InputLabel>
                    <Select value={value} onChange={onChange} label={t("Coupons.benefitType")} disabled={locked}>
                      <MenuItem value="months">{t("Coupons.benefitMonths")}</MenuItem>
                      <MenuItem value="window">{t("Coupons.benefitWindow")}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              {benefitType === "months" && (
                <Controller
                  name="benefit_months"
                  control={control}
                  rules={{ required: true, validate: (v) => parseInt(v, 10) > 0 || t("Coupons.monthsRange") }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField label={t("Coupons.months")} variant="outlined" type="number" inputProps={{ min: 1, step: 1 }} value={value} onChange={onChange} error={!!error} disabled={locked} fullWidth />
                  )}
                />
              )}

              {benefitType === "window" && (
                <Box display="flex" style={{ gap: 16 }}>
                  <Controller
                    name="benefit_start"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl focused style={{ flex: 1 }}>
                        <InputLabel style={{ fontSize: 16 }}>{t("Coupons.benefitStart")}</InputLabel>
                        <TextField type="date" value={value} onChange={onChange} error={!!error} disabled={locked} style={{ marginTop: 16 }} />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="benefit_end"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl focused style={{ flex: 1 }}>
                        <InputLabel style={{ fontSize: 16 }}>{t("Coupons.benefitEnd")}</InputLabel>
                        <TextField type="date" value={value} onChange={onChange} error={!!error} disabled={locked} style={{ marginTop: 16 }} />
                      </FormControl>
                    )}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* ---- Always-editable group ---- */}
          <Controller
            name="countries"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                options={countries}
                getOptionLabel={(o) => `${o.label} (${o.ISO})`}
                getOptionSelected={(o, v) => o.ISO === v.ISO}
                value={countries.filter((c) => (value || []).includes(c.ISO))}
                onChange={(e, opts) => onChange(opts.map((o) => o.ISO))}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label={t("Coupons.countries")} helperText={t("Coupons.countriesHint")} />
                )}
              />
            )}
          />

          <Box display="flex" style={{ gap: 16 }}>
            <Controller
              name="max_redemptions"
              control={control}
              rules={{ required: true, validate: (v) => parseInt(v, 10) > 0 || t("Coupons.maxRange") }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField label={t("Coupons.maxRedemptions")} variant="outlined" type="number" inputProps={{ min: 1, step: 1 }} value={value} onChange={onChange} error={!!error} style={{ flex: 1 }} />
              )}
            />
            <Controller
              name="redeem_until"
              control={control}
              rules={{ required: isEditMode }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl focused style={{ flex: 1 }}>
                  <InputLabel style={{ fontSize: 16 }}>{t("Coupons.redeemUntil")}</InputLabel>
                  <TextField
                    type="date"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    style={{ marginTop: 16 }}
                    helperText={!isEditMode && !value ? t("Coupons.redeemUntilHint") : undefined}
                  />
                </FormControl>
              )}
            />
          </Box>

          {!isEditMode && (
            <Box display="flex" style={{ gap: 16 }}>
              <Controller
                name="redeem_from"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl focused style={{ flex: 1 }}>
                    <InputLabel style={{ fontSize: 16 }}>{t("Coupons.redeemFrom")}</InputLabel>
                    <TextField
                      type="date"
                      value={value}
                      onChange={onChange}
                      style={{ marginTop: 16 }}
                      helperText={!value ? t("Coupons.redeemFromHint") : undefined}
                    />
                  </FormControl>
                )}
              />
            </Box>
          )}

          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField label={t("Coupons.description")} variant="outlined" value={value} onChange={onChange} multiline rows={2} fullWidth />
            )}
          />

          {isEditMode && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t("Coupons.redemptions")} ({redemptions.length})
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("Coupons.email")}</TableCell>
                    <TableCell>{t("Coupons.redeemedAt")}</TableCell>
                    <TableCell>{t("Coupons.window")}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {redemptions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.email || r.keycloak_id}</TableCell>
                      <TableCell>{moment(r.redeemed_at, "YYYY-MM-DD").format("DD-MM-YYYY")}</TableCell>
                      <TableCell>
                        {moment(r.benefit_start, "YYYY-MM-DD").format("DD-MM-YYYY")} –{" "}
                        {moment(r.benefit_end, "YYYY-MM-DD").format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="right">
                        {r.revoked_at ? (
                          <Chip size="small" label={t("Coupons.revoked")} />
                        ) : (
                          <Button size="small" color="secondary" onClick={() => onPressRevoke(r)}>
                            {t("Coupons.revoke")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {redemptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="caption" color="textSecondary">{t("Coupons.noRedemptions")}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>

        <Box display="flex" justifyContent="center" style={{ gap: 12, marginBottom: 20 }}>
          <Button variant="outlined" style={{ width: 130 }} onClick={useModal.hideModal}>
            {t("Coupons.close")}
          </Button>
          <Button onClick={onPressSubmit} disabled={loading} variant="contained" style={{ width: 130, background: "var(--color-primary)", color: "var(--color-white)" }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : t("Coupons.save")}
          </Button>
        </Box>
      </Dialog>

      <Confirmation
        useModal={confirmationModal}
        onPressConfirm={onConfirmRevoke}
        title={t("Coupons.revokeTitle")}
        description={t("Coupons.revokeConfirm")}
        confirmBtnTitle="Coupons.revoke"
      />

      <Snackbar open={isOpenAlert} autoHideDuration={6000} onClose={() => { setIsOpenAlert(false); setCreatedCode(null); }}>
        <Alert severity="success" variant="filled">
          {createdCode ? t("Coupons.created", { code: createdCode }) : t("Coupons.saveSuccess")}
        </Alert>
      </Snackbar>

      <Snackbar open={revokeOk} autoHideDuration={4000} onClose={() => setRevokeOk(false)}>
        <Alert severity="success" variant="filled">{t("Coupons.revokeSuccess")}</Alert>
      </Snackbar>

      <Snackbar open={!!errorMsg} autoHideDuration={5000} onClose={() => setErrorMsg("")}>
        <Alert severity="error" variant="filled" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>
      </Snackbar>
    </>
  );
};

export { CouponModal };
