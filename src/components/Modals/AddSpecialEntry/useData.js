import { useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { schema } from "./validate";
import { addSpecialEntry } from "../../../redux/actions/customersActions";

export const useData = (useModal) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const { control, handleSubmit, reset } = useForm({
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

  return {
    loading,
    control,
    isOpenAlert,
    setIsOpenAlert,
    onPressSubmit: handleSubmit(onSubmit),
  };
};
