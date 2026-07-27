/* eslint-disable react-hooks/exhaustive-deps, react/react-in-jsx-scope */
import React, { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars

import moment from "moment";
import { Chip, CircularProgress, IconButton } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { defaultTableOptions } from "../../constants/table";
import { useModal } from "../../hooks";
import { fetchCoupons } from "../../redux/actions/couponActions";

// Coupon code cell with an inline copy-to-clipboard icon.
const CodeWithCopy = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = (e) => {
    e.stopPropagation(); // don't open the row's detail dialog
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      {code}
      <IconButton size="small" style={{ marginLeft: 8 }} onClick={onCopy}>
        {copied ? <DoneIcon fontSize="small" /> : <FileCopyOutlinedIcon fontSize="small" />}
      </IconButton>
    </span>
  );
};

export const useData = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const createModal = useModal();
  const detailModal = useModal();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const { coupons, loading } = useSelector((state) => state.couponReducer);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, []);

  const onPressDetails = (dataIndex) => {
    setSelectedCoupon(coupons.list[dataIndex]);
    detailModal.showModal();
  };

  const tableOptions = {
    ...defaultTableOptions,
    onRowClick: (rowData, { dataIndex }) => onPressDetails(dataIndex),
    setRowProps: () => ({ style: { cursor: "pointer" } }),
    textLabels: {
      body: {
        noMatch: loading ? <CircularProgress size={20} color="inherit" /> : t("Coupons.noRecords"),
      },
    },
  };

  const tableColumns = [
    { name: "code", label: t("Coupons.code"), options: { customBodyRender: (code) => <CodeWithCopy code={code} /> } },
    {
      name: "type",
      label: t("Coupons.type"),
      options: { customBodyRender: (value) => t(`Coupons.type_${value}`, value) },
    },
    {
      name: "status",
      label: t("Coupons.status"),
      options: {
        customBodyRender: (labels) =>
          (labels || []).map((s) => (
            <Chip key={s} size="small" variant="outlined" label={t(`Coupons.status_${s}`, s)} style={{ marginRight: 4 }} />
          )),
      },
    },
    { name: "redemptions_count", label: t("Coupons.redemptionsCount") },
    { name: "max_redemptions", label: t("Coupons.maxRedemptions") },
    {
      name: "benefits_until",
      label: t("Coupons.benefitsUntil"),
      options: {
        // Already an inclusive Asia/Jerusalem "YYYY-MM-DD" string from the backend.
        customBodyRender: (value) => (value ? moment(value, "YYYY-MM-DD").format("DD-MM-YYYY") : "—"),
      },
    },
  ];

  return {
    createModal,
    detailModal,
    selectedCoupon,
    tableData: coupons.list,
    tableColumns,
    tableOptions,
  };
};
