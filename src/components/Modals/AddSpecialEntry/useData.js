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
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg("");

    dispatch(addSpecialEntry(data, onSuccess, onError));
  };

  const onError = (message) => {
    setLoading(false);
    setErrorMsg(message);
  };

  const onSuccess = () => {
    setLoading(false);
    setIsOpenAlert(true);
    useModal.hideModal();
    // Back to the prefilled values, not blanks: the prefilled fields are
    // disabled, and the effect below doesn't run again while the modal stays
    // mounted, so a blank required email would block the next add.
    reset({
      keycloak_id: keycloakId || "",
      email: email || "",
      start_date: "",
      end_date: "",
      category: "",
      subcategory: "",
    });
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
    errorMsg,
    setErrorMsg,
    onPressSubmit: handleSubmit(onSubmit),
  };
};
