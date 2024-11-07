import { string, date, object } from "yup";

export const schema = object({
  keycloak_id: string(),
  email: string(),
  start_date: date(),
  end_date: date(),
  category: string().required(),
  subCategory: string(),
});
