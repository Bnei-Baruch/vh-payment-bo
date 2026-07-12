import React from "react";

import { Button } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { useTranslation } from "react-i18next";

// Copies table data to the clipboard as TSV — paste-ready for spreadsheets.
// headers: string[]; getRows: () => any[][] (raw cell values, built on click).
export const CopyTsvButton = ({ headers, getRows }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const cell = (v) => String(v ?? "").replace(/[\t\n]/g, " ");
  const onCopy = async () => {
    const text = [headers, ...getRows()]
      .map((row) => row.map(cell).join("\t"))
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("CopyTsvButton", e);
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outlined"
      startIcon={copied ? <DoneIcon /> : <FileCopyOutlinedIcon />}
      onClick={onCopy}
    >
      {t(copied ? "AdminTable.copied" : "AdminTable.copyTsv")}
    </Button>
  );
};
