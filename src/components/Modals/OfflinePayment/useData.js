import { useImperativeHandle, useState } from "react";

import moment from "moment";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { schema } from "./validate";
import { currencies } from "../../../constants/currencies";
import { offlinePayment } from "../../../redux/actions/customersActions";

export const useData = (ref, useModal, keycloakId) => {
  const dispatch = useDispatch();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const { currentPayment } = useSelector((state) => state.customersReducer);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      amount: "",
      currency: currencies[0],
      quantity: 1,
      payment_method: "",
      payment_date: "",
      language: "",
      note: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useImperativeHandle(ref, () => ({
    setFormValues() {
      const { amount, currency, payment_method } =
        currentPayment?.details?.payment;

      reset({
        amount: amount,
        currency: currency,
        payment_method: payment_method,
      });
    },
  }));

  const onSubmit = (values) => {
    const {
      amount,
      currency,
      language,
      note,
      payment_date,
      payment_method,
      quantity,
    } = values;
    dispatch(
      offlinePayment(
        {
          amount,
          currency,
          quantity,
          payment_method,
          payment_date: `${moment(payment_date).format(
            "YYYY-MM-DD"
          )}T00:00:00Z`,
          language: language.length > 0 ? language?.toUpperCase() : null,
          note: note.length > 0 ? note : null,
          keycloak_id: keycloakId,
        },
        onSuccess
      )
    );
  };

  const onSuccess = () => {
    setIsOpenAlert(true);
    useModal.hideModal();
  };

  return {
    control,
    isOpenAlert,
    setIsOpenAlert,
    onPressSubmit: handleSubmit(onSubmit),
  };
};
