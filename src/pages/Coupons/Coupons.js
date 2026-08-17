import React from "react";

import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@material-ui/core";

import { useData } from "./useData";
import { CouponModal } from "../../components";

export default function Coupons() {
  const { t } = useTranslation();
  const {
    createModal,
    detailModal,
    selectedCoupon,
    tableData,
    tableColumns,
    tableOptions,
  } = useData();

  return (
    <Box px={5} py={7} bgcolor="var(--color-white)">
      <Box mb={8} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          style={{ fontSize: 16 }}
          onClick={createModal.showModal}
        >
          {t("Coupons.create")}
        </Button>
      </Box>

      <MUIDataTable title={t("Coupons.name")} data={tableData} options={tableOptions} columns={tableColumns} />

      <CouponModal useModal={createModal} />
      <CouponModal useModal={detailModal} coupon={selectedCoupon} />
    </Box>
  );
}
