/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { schema } from "./validate";
import { addSpecialEntry } from "../../../redux/actions/customersActions";

export const useData = (useModal, email, keycloakId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      keycloak_id: "",
      email: "",
      start_date: "",
      end_date: "",
      category: "",
      subcategory: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);

    dispatch(addSpecialEntry(data, onSuccess));
  };

  const onSuccess = () => {
    setLoading(false);
    setIsOpenAlert(true);
    useModal.hideModal();
    reset();
  };

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }

    if (keycloakId) {
      setValue("keycloak_id", keycloakId);
    }
  }, [email, keycloakId]);

  return {
    loading,
    control,
    isOpenAlert,
    setIsOpenAlert,
    onPressSubmit: handleSubmit(onSubmit),
  };
};
