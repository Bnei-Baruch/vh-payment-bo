import React from "react";

import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import { Box, Button, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { useData } from "./useData";
import { Confirmation, ManualDiscountModal } from "../../../components";

export default function ManualDiscount() {
  const { t } = useTranslation();
  const {
    onKeyDown,
    tableData,
    searchQuery,
    tableColumns,
    tableOptions,
    addEntryModal,
    editEntryModal,
    selectedEntry,
    onPressSearch,
    onConfirmCancel,
    setSearchQuery,
    confirmationModal,
    isCancelError,
    setIsCancelError,
  } = useData();

  return (
    <Box px={5} py={7} bgcolor="var(--color-white)">
      <Box mb={8} display="flex" justifyContent="space-between">
        <Box display="flex">
          <TextField
            label={t("ManualDiscount.search")}
            variant="outlined"
            style={{ minWidth: 320 }}
            onKeyDown={onKeyDown}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ borderRadius: "0 4px 4px 0" }}
            onClick={onPressSearch}
          >
            {t("ManualDiscount.search")}
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          style={{ fontSize: 16 }}
          onClick={addEntryModal.showModal}
        >
          {t("ManualDiscount.add")}
        </Button>
      </Box>

      <MUIDataTable title={t("ManualDiscount.name")} data={tableData} options={tableOptions} columns={tableColumns} />

      <Confirmation
        useModal={confirmationModal}
        onPressConfirm={onConfirmCancel}
        title={t("UserDetails.beCareful")}
        description={t("ManualDiscount.cancelConfirm")}
        confirmBtnTitle="ManualDiscount.yesCancel"
      />

      <ManualDiscountModal useModal={addEntryModal} />
      <ManualDiscountModal useModal={editEntryModal} editEntry={selectedEntry} />

      <Snackbar
        open={isCancelError}
        onClose={() => setIsCancelError(false)}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" onClose={() => setIsCancelError(false)}>
          {t("ManualDiscount.cancelError")}
        </Alert>
      </Snackbar>
    </Box>
  );
}
