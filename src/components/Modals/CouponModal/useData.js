/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../../hooks";
import {
  createCouponEntry,
  updateCouponEntry,
  fetchCouponRedemptions,
  clearCouponRedemptions,
  revokeCouponRedemption,
} from "../../../redux/actions/couponActions";

// Coupon dates cross the API as inclusive "YYYY-MM-DD" Asia/Jerusalem days — the
// backend owns all timezone conversion, so here they are plain strings both ways.
const parseProps = (properties) => {
  if (!properties) return {};
  if (typeof properties !== "string") return properties;
  try {
    return JSON.parse(properties);
  } catch (e) {
    console.error("parseProps", e);
    return {};
  }
};

const defaultValues = () => ({
  prefix: "",
  description: "",
  enabled: true,
  type: "percent",
  discount_pct: "",
  fixed_price: "",
  currency: "USD",
  benefit_type: "months",
  benefit_months: "",
  benefit_start: "",
  benefit_end: "",
  countries: [],
  max_redemptions: 25,
  redeem_from: "",
  redeem_until: "",
});

export const useData = (modal, coupon) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [revokeOk, setRevokeOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const confirmationModal = useModal();
  const [revokeTarget, setRevokeTarget] = useState(null);

  const redemptions = useSelector((state) => state.couponReducer.redemptions.list);

  const isEditMode = !!coupon;
  const locked = isEditMode && (coupon.redemptions_count ?? 0) > 0;

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: defaultValues(),
    mode: "onChange",
  });

  useEffect(() => {
    if (!modal.isVisible) return;
    if (coupon) {
      const p = parseProps(coupon.properties);
      reset({
        prefix: "",
        description: coupon.description || "",
        enabled: coupon.enabled,
        type: coupon.type || "percent",
        discount_pct: p.discount_pct != null ? p.discount_pct : "",
        fixed_price: p.fixed_price != null ? p.fixed_price : "",
        currency: p.currency || "USD",
        benefit_type: coupon.benefit_months != null ? "months" : "window",
        benefit_months: coupon.benefit_months != null ? coupon.benefit_months : "",
        benefit_start: coupon.benefit_start || "",
        benefit_end: coupon.benefit_end || "",
        countries: coupon.countries || [],
        max_redemptions: coupon.max_redemptions,
        redeem_until: coupon.redeem_until || "",
      });
      dispatch(clearCouponRedemptions()); // drop the previous coupon's rows before refetch
      dispatch(fetchCouponRedemptions(coupon.id));
    } else {
      reset(defaultValues());
    }
  }, [coupon, modal.isVisible]);

  const discountType = watch("type");
  const benefitType = watch("benefit_type");

  const buildDiscountAndBenefit = (data) => {
    const properties =
      data.type === "percent"
        ? { discount_pct: parseFloat(data.discount_pct) }
        : { fixed_price: parseFloat(data.fixed_price), currency: data.currency };
    const benefit =
      data.benefit_type === "months"
        ? { benefit_months: parseInt(data.benefit_months, 10) }
        : { benefit_start: data.benefit_start, benefit_end: data.benefit_end };
    return { type: data.type, properties, ...benefit };
  };

  const onSubmit = (data) => {
    setLoading(true);
    // Only send redeem_until when it actually changed, so an unrelated edit never
    // rewrites it (the backend keeps its stored value when the field is absent).
    const redeemUntilChanged = !isEditMode || data.redeem_until !== (coupon.redeem_until || "");
    const editable = {
      description: data.description || "",
      countries: data.countries,
      max_redemptions: parseInt(data.max_redemptions, 10),
      ...(data.redeem_until && redeemUntilChanged ? { redeem_until: data.redeem_until } : {}),
    };

    if (isEditMode) {
      const payload = { ...editable, enabled: data.enabled };
      // Discount/benefit are locked once the coupon has redemptions (§4).
      if (!locked) Object.assign(payload, buildDiscountAndBenefit(data));
      dispatch(updateCouponEntry(coupon.id, payload, onSuccess, onError));
    } else {
      dispatch(
        createCouponEntry(
          { prefix: data.prefix, ...editable, ...buildDiscountAndBenefit(data),
            ...(data.redeem_from ? { redeem_from: data.redeem_from } : {}) },
          onSuccess,
          onError
        )
      );
    }
  };

  const onSuccess = (created) => {
    setLoading(false);
    setCreatedCode(created?.code || null);
    setIsOpenAlert(true);
    modal.hideModal();
    reset(defaultValues());
  };

  const onError = (e) => {
    setLoading(false);
    setErrorMsg(e?.response?.data?.error || "Request failed");
  };

  const onPressRevoke = (redemption) => {
    setRevokeTarget(redemption);
    confirmationModal.showModal();
  };

  const onConfirmRevoke = () => {
    if (!revokeTarget) return;
    confirmationModal.hideModal();
    dispatch(
      revokeCouponRedemption(
        coupon.id,
        revokeTarget.id,
        () => {
          setRevokeTarget(null);
          setRevokeOk(true);
        },
        onError
      )
    );
  };

  return {
    loading,
    control,
    isEditMode,
    locked,
    discountType,
    benefitType,
    coupon,
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
    onPressSubmit: handleSubmit(onSubmit),
  };
};
