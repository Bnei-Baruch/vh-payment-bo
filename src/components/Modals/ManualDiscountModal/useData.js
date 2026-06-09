/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { createOrUpdateManualDiscountEntry } from "../../../redux/actions/customersActions";

const defaultValues = (today) => ({
  keycloak_id: "",
  type: "percent",
  discount_pct: "",
  fixed_price: "",
  currency: "USD",
  start_date: today,
  end_date: "",
  note: "",
});

export const useData = (useModal, editEntry) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: defaultValues(today),
    mode: "onChange",
  });

  useEffect(() => {
    if (!useModal.isVisible) return;
    if (editEntry) {
      const p = editEntry.properties
        ? typeof editEntry.properties === "string"
          ? JSON.parse(editEntry.properties)
          : editEntry.properties
        : {};
      reset({
        keycloak_id: editEntry.keycloak_id,
        type: editEntry.type || "percent",
        discount_pct: p.discount_pct != null ? p.discount_pct : "",
        fixed_price: p.fixed_price != null ? p.fixed_price : "",
        currency: p.currency || "USD",
        start_date: editEntry.start_date ? editEntry.start_date.substring(0, 10) : today,
        end_date: editEntry.end_date ? editEntry.end_date.substring(0, 10) : "",
        note: editEntry.note || "",
      });
    } else {
      reset(defaultValues(today));
    }
  }, [editEntry, useModal.isVisible]);

  const discountType = watch("type");

  const onSubmit = (data) => {
    setLoading(true);

    let properties;
    if (data.type === "percent") {
      properties = { discount_pct: parseFloat(data.discount_pct) };
    } else {
      properties = {
        fixed_price: parseFloat(data.fixed_price),
        currency: data.currency,
      };
    }

    const payload = {
      ...(editEntry ? { id: editEntry.id } : {}),
      keycloak_id: data.keycloak_id,
      type: data.type,
      properties,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
      note: data.note || undefined,
    };

    dispatch(createOrUpdateManualDiscountEntry(payload, onSuccess, onError));
  };

  const onError = () => { setLoading(false); };

  const onSuccess = () => {
    setLoading(false);
    setIsOpenAlert(true);
    useModal.hideModal();
    reset(defaultValues(today));
  };

  return {
    loading,
    control,
    discountType,
    isEditMode: !!editEntry,
    isOpenAlert,
    setIsOpenAlert,
    onPressSubmit: handleSubmit(onSubmit),
  };
};
