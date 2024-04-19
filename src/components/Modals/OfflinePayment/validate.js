import { number, string, date, object } from "yup";

export const schema = object({
  amount: number().required(),
  currency: string().required(),
  quantity: number().required().min(1),
  payment_method: string().required(),
  payment_date: date().required(),
});
