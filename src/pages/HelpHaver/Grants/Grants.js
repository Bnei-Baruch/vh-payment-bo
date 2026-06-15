import React from "react";

import MUIDataTable from "mui-datatables";
import { useTranslation } from "react-i18next";
import { Box, MenuItem, Select } from "@material-ui/core";

import { useData } from "./useData";
import { HHRequestDetails, UserSearchField } from "../../../components";

const STATUS_FILTERS = ["", "REQUESTED", "APPROVED", "DENIED"];

export default function Grants() {
  const { t } = useTranslation();
  const {
    onSearch,
    statusFilter,
    onChangeStatusFilter,
    tableData,
    tableColumns,
    tableOptions,
    detailsModal,
    selectedRequest,
  } = useData();

  return (
    <Box px={5} py={7} bgcolor="var(--color-white)">
      <Box mb={8} display="flex">
        <UserSearchField onSearch={onSearch} />
        <Select
          value={statusFilter}
          displayEmpty
          style={{ marginLeft: 16, minWidth: 140 }}
          onChange={(e) => onChangeStatusFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((s) => (
            <MenuItem key={s} value={s}>
              {s ? t(`HHGrants.status_${s}`) : t("HHGrants.allStatuses")}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <MUIDataTable title={t("HHGrants.name")} data={tableData} options={tableOptions} columns={tableColumns} />

      <HHRequestDetails useModal={detailsModal} request={selectedRequest} />
    </Box>
  );
}
