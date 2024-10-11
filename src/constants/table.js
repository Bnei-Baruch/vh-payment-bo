import countries from "./countries";
import languages from "./languages";
import { genderData, maritalStatuses } from "./formData";

export const defaultTableOptions = {
  selectableRows: "none",
  download: false,
  print: false,
  pagination: false,
  search: false,
  filter: false,
  viewColumns: false,
  sort: false,
};

export const rowsPerPageOptions = [10, 25, 50, 100];

export const fieldsForEditing = [
  { name: "first_name_latin" },
  { name: "first_name_vernacular" },
  { name: "last_name_latin" },
  { name: "last_name_vernacular" },
  { name: "street_address" },
  { name: "country", type: "dropdown", data: countries },
  { name: "state_region" },
  { name: "city" },
  { name: "gender", type: "dropdown", data: genderData },
  { name: "marital_status", type: "dropdown", data: maritalStatuses },
  { name: "date_of_birth", type: "date" },
  { name: "mobile_number" },
  { name: "whats_app_number" },
  { name: "alternate_email_1" },
  { name: "alternate_email_2" },
  { name: "first_language", type: "dropdown", data: languages },
  { name: "other_language_1", type: "dropdown", data: languages },
  { name: "listening_language", type: "dropdown", data: languages },
  { name: "reading_language", type: "dropdown", data: languages },
  { name: "email_language", type: "dropdown", data: languages },
  { name: "study_start_year" },
  { name: "study_framework" },
  { name: "has_ten_group" },
  { name: "name_ten_group" },
];

export const fieldsForSorting = ["ProductType", "ID"];
