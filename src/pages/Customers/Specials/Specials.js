import React from "react";

import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import { Box, Button, TextField, Select, MenuItem } from "@material-ui/core";

import "./styles.css";
import { useData } from "./useData";
import { AddSpecialEntry, Confirmation } from "../../../components";

export default function Specials() {
  const { t } = useTranslation();
  const {
    onKeyDown,
    tableData,
    queryType,
    searchQuery,
    tableColumns,
    tableOptions,
    setQueryType,
    addEntryModal,
    onRemoveEntry,
    onPressSearch,
    setSearchQuery,
    confirmationModal,
  } = useData();

  return (
    <Box
      px={5}
      py={7}
      bgcolor="var(--color-white)"
      className="specials-container"
    >
      <Box mb={8} display="flex" justifyContent="space-between">
        <Box display="flex">
          <TextField
            label={t("Specials.search")}
            variant="outlined"
            className="search-field"
            onKeyDown={onKeyDown}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={queryType}
            className="query-type-selector"
            onChange={(e) => setQueryType(e.target.value)}
          >
            <MenuItem value="email">{t("Specials.email")}</MenuItem>
            <MenuItem value="keycloak_id">{t("Specials.keycloakId")}</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            style={{ borderRadius: "0 4px 4px 0" }}
            onClick={onPressSearch}
          >
            {t("Specials.search")}
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          style={{
            fontSize: 16,
          }}
          onClick={addEntryModal.showModal}
        >
          {t("Specials.add")}
        </Button>
      </Box>
      <MUIDataTable
        data={tableData}
        options={tableOptions}
        columns={tableColumns}
      />

      <Confirmation
        useModal={confirmationModal}
        onPressConfirm={onRemoveEntry}
        title={t("UserDetails.beCareful")}
        description={t("Specials.areYouSureYouWantToDelete")}
        confirmBtnTitle="Specials.yesDelete"
      />

      <AddSpecialEntry useModal={addEntryModal} />
    </Box>
  );
}
