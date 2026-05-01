import React, { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { useTranslation } from "react-i18next";

import { ApiCustomers } from "../../../redux/api/customersApi";
import countries from "../../../constants/countries";

const PRICING_VERSIONS = [
  { value: "", label: "Default — backend decides" },
  { value: "v1", label: "V1 — Static pricing" },
  { value: "v2", label: "V2 — Country-based tiered pricing" },
];

const Row = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" mb={0.5}>
    <Typography variant="body2" style={{ color: "#666", minWidth: 160 }}>{label}</Typography>
    <Typography variant="body2" style={{ fontWeight: 500, textAlign: "right" }}>{value}</Typography>
  </Box>
);

const SectionTitle = ({ children }) => (
  <Typography variant="body2" style={{ fontWeight: 700, marginTop: 12, marginBottom: 4, textTransform: "uppercase", fontSize: 11, color: "#888" }}>
    {children}
  </Typography>
);

const PropsTitle = ({ children }) => (
  <Typography variant="body2" style={{ fontWeight: 600, marginBottom: 4, fontSize: 11, color: "#555" }}>
    {children}
  </Typography>
);

const DonationsProperties = ({ dp, accountID, finalPrice, t }) => (
  <Box mt={1} p={1.5} bgcolor="#efefef" borderRadius={4}>
    <PropsTitle>{t("PriceCalculator.properties")}</PropsTitle>
    <Row label={t("PriceCalculator.primaryAccountId")} value={accountID} />
    <Row label={t("PriceCalculator.finalPrice")} value={`${finalPrice?.amount} ${finalPrice?.currency?.toUpperCase()}`} />
    <Row label={t("PriceCalculator.emailsQueried")} value={dp.primary_email_count} />
    {dp.spouse_account_id ? (
      <>
        <Row label={t("PriceCalculator.spouseAccount")} value={dp.spouse_account_id} />
        <Row label={t("PriceCalculator.spouseKeycloakId")} value={dp.spouse_keycloak_id} />
        <Row label={t("PriceCalculator.spouseEmailsQueried")} value={dp.spouse_email_count} />
        <Row label={t("PriceCalculator.spouseGetsDiscount")} value={dp.spouse_gets_discount ? t("PriceCalculator.yes") : t("PriceCalculator.no")} />
      </>
    ) : (
      <Row label={t("PriceCalculator.spouse")} value={t("PriceCalculator.noSpouse")} />
    )}
    <Row label={t("PriceCalculator.donationsFetched")} value={dp.donations_fetched ? t("PriceCalculator.yes") : t("PriceCalculator.no")} />
    {dp.donations_fetched_emails?.length > 0 && (
      <Row label={t("PriceCalculator.fetchedEmails")} value={dp.donations_fetched_emails.join(", ")} />
    )}
    {dp.donations_fetch_note && (
      <Row label={t("PriceCalculator.fetchNote")} value={dp.donations_fetch_note} />
    )}
    {dp.donations_fetch_error && (
      <Row
        label={<span style={{ color: "#c62828", fontWeight: 600 }}>{t("PriceCalculator.fetchError")}</span>}
        value={<span style={{ color: "#c62828" }}>{dp.donations_fetch_error}</span>}
      />
    )}
  </Box>
);

const DiscountCard = ({ discount, evaluation, t }) => (
  <Box mt={1.5} p={2} bgcolor="#fff" borderRadius={4} border="1px solid #ddd">
    <Row label={t("PriceCalculator.discountType")} value={discount.type} />
    <Row label={t("PriceCalculator.discountAmountPct")} value={`${discount.amount_pct}%`} />
    <Row label={t("PriceCalculator.discountEligible")} value={discount.eligible ? t("PriceCalculator.yes") : t("PriceCalculator.no")} />
    {discount.type === "donations" && discount.properties && (
      <DonationsProperties
        dp={discount.properties}
        accountID={evaluation.account_id}
        finalPrice={evaluation.final_price}
        t={t}
      />
    )}
  </Box>
);

export const PriceCalculatorModal = ({ useModal, keycloakId }) => {
  const { t } = useTranslation();
  const [pricingVersion, setPricingVersion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setResult(null);
    setError(null);
    useModal.hideModal();
  };

  const handleCalculate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const { data } = await ApiCustomers.getMonthlyPrice(keycloakId, pricingVersion);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || t("PriceCalculator.error"));
    } finally {
      setLoading(false);
    }
  };

  const v1 = result?.v1_details;
  const v2 = result?.v2_details;
  const donationsDiscount = v2?.discounts?.find(d => d.type === "donations");

  return (
    <Dialog open={useModal.isVisible} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box py={5} px={6} display="flex" flexDirection="column">
        <HighlightOffIcon
          style={{ marginBottom: 6, alignSelf: "flex-end", cursor: "pointer" }}
          onClick={handleClose}
        />

        <Typography variant="h3" align="center" style={{ marginBottom: 24, fontWeight: 700 }}>
          {t("PriceCalculator.title")}
        </Typography>

        <FormControl variant="outlined" style={{ marginBottom: 24 }}>
          <InputLabel>{t("PriceCalculator.pricingVersion")}</InputLabel>
          <Select
            value={pricingVersion}
            onChange={(e) => { setPricingVersion(e.target.value); setResult(null); }}
            label={t("PriceCalculator.pricingVersion")}
          >
            {PRICING_VERSIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          onClick={handleCalculate}
          variant="contained"
          disabled={loading}
          style={{ background: "var(--color-primary)", color: "var(--color-white)", marginBottom: 24 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : t("PriceCalculator.calculate")}
        </Button>

        {result && (
          <Box p={3} bgcolor="#f5f5f5" borderRadius={4}>
            <SectionTitle>{t("PriceCalculator.result")}</SectionTitle>
            <Row label={t("PriceCalculator.amount")} value={result.amount} />
            <Row label={t("PriceCalculator.currency")} value={result.currency?.toUpperCase()} />
            <Row label={t("PriceCalculator.version")} value={result.pricing_version} />

            {donationsDiscount?.properties?.donations_fetch_error && (
              <Box mt={1} p={1.5} bgcolor="#ffebee" borderRadius={4} border="1px solid #f44336">
                <Typography variant="body2" style={{ color: "#c62828", fontWeight: 600 }}>
                  {t("PriceCalculator.donationsFetchError")}
                </Typography>
                <Typography variant="body2" style={{ color: "#c62828", fontFamily: "monospace", fontSize: 11, wordBreak: "break-all" }}>
                  {donationsDiscount.properties.donations_fetch_error}
                </Typography>
              </Box>
            )}

            {v1 && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <SectionTitle>{t("PriceCalculator.v1Details")}</SectionTitle>
                <Row label={t("PriceCalculator.evaluatedAt")} value={new Date(v1.evaluated_at).toLocaleString()} />
                <Row label={t("PriceCalculator.basePrice")} value={`${v1.base_price?.amount} ${v1.base_price?.currency?.toUpperCase()}`} />

                {v1.discounts?.length > 0 && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <SectionTitle>{t("PriceCalculator.discounts")}</SectionTitle>
                    {v1.discounts.map((d, i) => (
                      <DiscountCard key={i} discount={d} evaluation={v1} t={t} />
                    ))}
                  </>
                )}

                {v1.explain?.length > 0 && (
                  <>
                    <Divider style={{ margin: "12px 0" }} />
                    <SectionTitle>{t("PriceCalculator.explain")}</SectionTitle>
                    <Box
                      p={1.5}
                      bgcolor="#e8e8e8"
                      borderRadius={4}
                      style={{ fontFamily: "monospace", fontSize: 11, wordBreak: "break-all", whiteSpace: "pre-wrap" }}
                    >
                      {v1.explain.map((line, i) => <div key={i}>{line}</div>)}
                    </Box>
                  </>
                )}
              </>
            )}

            {v2 && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <SectionTitle>{t("PriceCalculator.v2Details")}</SectionTitle>
                <Row label={t("PriceCalculator.evaluatedAt")} value={new Date(v2.evaluated_at).toLocaleString()} />
                <Row label={t("PriceCalculator.country")} value={`${v2.country_code} — ${countries.find(c => c.ISO === v2.country_code)?.label ?? v2.country_code}`} />
                <Row label={t("PriceCalculator.basePrice")} value={`${v2.country_base?.amount} ${v2.country_base?.currency?.toUpperCase()}`} />
                <Row label={t("PriceCalculator.priceGroup")} value={v2.country_base?.group} />

                {v2.discounts?.length > 0 && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <SectionTitle>{t("PriceCalculator.discounts")}</SectionTitle>
                    {v2.discounts.map((d, i) => (
                      <DiscountCard key={i} discount={d} evaluation={v2} t={t} />
                    ))}
                  </>
                )}

                {v2.explain?.length > 0 && (
                  <>
                    <Divider style={{ margin: "12px 0" }} />
                    <SectionTitle>{t("PriceCalculator.explain")}</SectionTitle>
                    <Box
                      p={1.5}
                      bgcolor="#e8e8e8"
                      borderRadius={4}
                      style={{ fontFamily: "monospace", fontSize: 11, wordBreak: "break-all", whiteSpace: "pre-wrap" }}
                    >
                      {v2.explain.map((line, i) => <div key={i}>{line}</div>)}
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        )}

        {error && (
          <Typography variant="body2" style={{ color: "var(--color-red)" }}>{error}</Typography>
        )}
      </Box>
    </Dialog>
  );
};
