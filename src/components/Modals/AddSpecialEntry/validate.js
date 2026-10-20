import { string, date, object } from "yup";

export const schema = object({
  keycloak_id: string(),
  // The server refuses a special without an email: one could never be revoked.
  email: string().trim().required(),
  start_date: date(),
  end_date: date(),
  category: string().required(),
  subCategory: string(),
});
