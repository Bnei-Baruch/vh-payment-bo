import React from "react";
import { useTranslation } from "react-i18next";

export default function NoUserAccess() {
  const { t } = useTranslation("common");
  return <div>{t("common.noAccessRight")}</div>;
}
