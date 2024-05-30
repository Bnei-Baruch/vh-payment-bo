import { string, date, object } from "yup";

export const schema = object({
  keycloak_id: string().required(),
  start_date: date(),
  end_date: date(),
  category: string(),
  subCategory: string(),
});
