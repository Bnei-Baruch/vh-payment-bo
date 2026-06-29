import React from "react";

import moment from "moment";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  FormControl,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { useData, isGrantActive, HH_GRANT_TYPES, HH_MONTHS } from "./useData";

export const statusColor = {
  REQUESTED: "var(--color-blue)",
  APPROVED: "var(--color-green)",
  DENIED: "var(--color-red)",
};

const InfoField = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="caption" color="textSecondary">{label}</Typography>
    <Typography variant="body2">{value || "—"}</Typography>
  </Box>
);

// Details of a V2 Help Haver application: requester info, request history,
// the request itself with requested-vs-final values, and the linked grant.
export const HHRequestDetails = ({ useModal, request }) => {
  const { t } = useTranslation();
  const {
    status, setStatus,
    finalType, setFinalType,
    finalPct, setFinalPct,
    finalMonths, setFinalMonths,
    finalStartDate, setFinalStartDate,
    rejectionNote, setRejectionNote,
    loading, history, isConcluded, isDisabledBtn,
    onPressUpdate, onCancelGrant, requestorDetails,
  } = useData(useModal, request);

  if (!request) return null;
  const grant = request.grant;

  return (
    <Dialog open={useModal.isVisible} onClose={useModal.hideModal} maxWidth="lg" fullWidth>
      <Box p={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3">{t("HHGrants.detailsTitle")}</Typography>
          <Chip
            label={request.status}
            size="small"
            variant="outlined"
            style={{ borderColor: statusColor[request.status], color: statusColor[request.status] }}
          />
        </Box>

        <Box display="flex" alignItems="flex-start" style={{ gap: 48 }}>
          {/* Left: requester + history — sizes to its widest (no-wrap) line */}
          <Box style={{ width: "max-content", flexShrink: 0 }}>
            <Typography variant="h6" gutterBottom>{t("HHGrants.personalInfo")}</Typography>
            <Grid container>
              <Grid item xs={6}>
                <InfoField
                  label={t("HHGrants.memberName")}
                  value={`${requestorDetails?.first_name_vernacular ?? ""} ${requestorDetails?.last_name_vernacular ?? ""}`.trim()}
                />
                <InfoField label={t("HHGrants.phone")} value={requestorDetails?.mobile_number} />
                <InfoField label={t("HHGrants.country")} value={requestorDetails?.country} />
              </Grid>
              <Grid item xs={6}>
                <InfoField label={t("HHGrants.email")} value={requestorDetails?.primary_email} />
                <InfoField label={t("HHGrants.membership")} value={requestorDetails?.status?.membership_type} />
                <InfoField label={t("HHGrants.keycloakId")} value={request.keycloak_id} />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>{t("HHGrants.requestHistory")}</Typography>
            {history.length === 0 ? (
              <Typography variant="body2" color="textSecondary">—</Typography>
            ) : (
              history.map((h) => (
                <Box key={h.id} mb={1} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                  <Typography variant="body2" style={{ whiteSpace: "nowrap" }}>
                    {moment(h.created_at).format("DD-MM-YYYY")}{" · "}
                    <b>{h.status}</b>{" · "}
                    {t(`HHGrants.type_${h.type}`, h.type)}{" · "}
                    {h.requested_pct}% / {h.months} {t("HHGrants.months").toLowerCase()}
                    {h.grant ? ` → ${h.grant.discount_pct}%` : ""}
                  </Typography>
                  {(h.note || h.rejection_note) && (
                    <Typography variant="caption" color="textSecondary" display="block">
                      {h.note}{h.note && h.rejection_note ? " · " : ""}{h.rejection_note}
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Box>

          {/* Right: request, conclusion, grant — fills remaining width */}
          <Box flex={1} style={{ minWidth: 0 }}>
            <Typography variant="h6" gutterBottom>
              {t("HHGrants.request")} · {moment(request.created_at).format("DD-MM-YYYY")}
            </Typography>
            <InfoField label={t("HHGrants.note")} value={request.note} />

            {/* Requested vs final values: one row per field, like the V1 dialog */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} />
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">{t("HHGrants.requested")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">{t("HHGrants.final")}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2">{t("HHGrants.type")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">{t(`HHGrants.type_${request.type}`, request.type)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="outlined" size="small" fullWidth disabled={isConcluded || status !== "approved"}>
                  <Select value={finalType} onChange={(e) => setFinalType(e.target.value)}>
                    {HH_GRANT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>{t(`HHGrants.type_${type}`)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2">{t("HHGrants.discountPct")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">{request.requested_pct}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  inputProps={{ min: 1, max: 99 }}
                  disabled={isConcluded || status !== "approved"}
                  value={finalPct}
                  onChange={(e) => setFinalPct(e.target.value)}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2">{t("HHGrants.months")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">{request.months}</Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="outlined" size="small" fullWidth disabled={isConcluded || status !== "approved"}>
                  <Select value={finalMonths} onChange={(e) => setFinalMonths(e.target.value)}>
                    {HH_MONTHS.map((m) => (
                      <MenuItem key={m} value={String(m)}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2">{t("HHGrants.startDate")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">{t("HHGrants.startDefaultNow")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="date"
                  fullWidth
                  disabled={isConcluded || status !== "approved"}
                  value={finalStartDate}
                  onChange={(e) => setFinalStartDate(e.target.value)}
                />
              </Grid>
            </Grid>

            {request.status === "DENIED" && (
              <InfoField label={t("HHGrants.rejectionNote")} value={request.rejection_note} />
            )}

            {grant && (
              <Box mt={4} p={3} border={1} borderColor="grey.300" borderRadius={4}>
                <Typography variant="h6" gutterBottom>
                  {t("HHGrants.grant")}{" "}
                  <Chip
                    size="small"
                    label={isGrantActive(grant) ? t("HHGrants.grantActive") : t("HHGrants.grantEnded")}
                    color={isGrantActive(grant) ? "primary" : "default"}
                  />
                </Typography>
                <Grid container>
                  <Grid item xs={4}>
                    <InfoField
                      label={t("HHGrants.discountPct")}
                      value={`${grant.discount_pct}% (${t(`HHGrants.type_${grant.type}`, grant.type)})`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InfoField
                      label={`${t("HHGrants.startDate")} - ${t("HHGrants.endDate")}`}
                      value={`${moment(grant.start_date).format("DD-MM-YYYY")} - ${moment(grant.end_date).format("DD-MM-YYYY")}`}
                    />
                  </Grid>
                </Grid>
                {isGrantActive(grant) && (
                  <Button
                    variant="outlined"
                    style={{ borderColor: "var(--color-red)", color: "var(--color-red)" }}
                    onClick={onCancelGrant}
                  >
                    {t("HHGrants.cancelGrant")}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {!isConcluded && (
          <Box mt={8} display="flex" flexDirection="column" alignItems="center">
            <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
              <FormControlLabel value="approved" control={<Radio color="primary" />} label={t("HHGrants.approve")} />
              <FormControlLabel value="denied" control={<Radio />} label={t("HHGrants.deny")} />
            </RadioGroup>
            {status === "denied" && (
              <TextField
                label={t("HHGrants.rejectionNote")}
                variant="outlined"
                multiline
                rows={2}
                style={{ width: "100%", maxWidth: 420, marginTop: 8 }}
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
              />
            )}
            <Box mt={3} display="flex" justifyContent="center" style={{ gap: 12 }}>
              <Button variant="outlined" onClick={useModal.hideModal}>
                {t("HHGrants.cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={isDisabledBtn}
                onClick={onPressUpdate}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : t("HHGrants.update")}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
