import { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { schema } from "./validate";

export const useData = (useModal) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      keycloak_id: "",
      expiration_date: "",
      category: "",
      subcategory: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    setIsOpenAlert(true);
    useModal.hideModal();
    reset();
  };

  return {
    control,
    isOpenAlert,
    setIsOpenAlert,
    onPressSubmit: handleSubmit(onSubmit),
  };
};
