import { string, date, object } from "yup";

export const schema = object({
  keycloak_id: string().required(),
  expiration_date: date(),
  category: string(),
  subCategory: string(),
});
