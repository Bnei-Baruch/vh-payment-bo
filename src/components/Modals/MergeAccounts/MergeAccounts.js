import React from "react";

import MUIDataTable from "mui-datatables";
import Dialog from "@material-ui/core/Dialog";
import { useTranslation } from "react-i18next";
import GroupIcon from "@material-ui/icons/Group";
import SearchIcon from "@material-ui/icons/Search";
import PersonIcon from "@material-ui/icons/Person";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@material-ui/core";

import "./styles.css";
import { useData } from "./useData";
import { Confirmation } from "../Confirmation";

export const MergeAccounts = ({ useModal }) => {
  const { t } = useTranslation();
  const {
    merge,
    userData,
    keycloakId,
    tableOptions,
    tableColumns,
    setKeycloakId,
    onPressSearch,
    isDisabledBtn,
    confirmMergeModal,
  } = useData(useModal.isVisible);

  return (
    <>
      <Dialog
        open={useModal.isVisible}
        onClose={useModal.hideModal}
        className="merge-accounts-modal"
      >
        <Box
          py={4}
          px={8}
          bgcolor="var(--color-primary)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          minWidth={600}
        >
          <GroupIcon style={{ marginRight: 6, fontSize: 30 }} />
          <ArrowForwardIcon />
          <PersonIcon style={{ marginLeft: 3, fontSize: 28 }} />
          <Typography variant="h3" style={{ marginLeft: 28 }}>
            {t("UserDetails.mergeAccounts")}
          </Typography>
        </Box>
        <Box
          p={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <TextField
            size="small"
            variant="outlined"
            value={keycloakId}
            style={{ width: 330 }}
            placeholder={t("UserDetails.keycloakId")}
            onChange={(e) => setKeycloakId(e.target.value)}
          />
          <Button
            onClick={onPressSearch}
            disableRipple={false}
            variant="contained"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-white)",
              width: 130,
            }}
            startIcon={
              merge.loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
          >
            {t("Search.name")}
          </Button>
        </Box>

        <Box
          m={5}
          height="50vh"
          overflow="scroll"
          border="1px solid var(--color-light-blue)"
        >
          <MUIDataTable
            data={userData}
            columns={tableColumns}
            options={tableOptions}
            className="user-details-table"
          />
        </Box>

        <Button
          disableRipple={isDisabledBtn}
          disabled={isDisabledBtn}
          startIcon={<MergeTypeIcon />}
          variant="contained"
          onClick={confirmMergeModal.showModal}
          style={{
            opacity: isDisabledBtn ? 0.6 : 1,
            background: "var(--color-red)",
            color: "var(--color-white)",
            alignSelf: "center",
            marginBottom: 20,
            width: 130,
          }}
        >
          {t("UserDetails.merge")}
        </Button>
      </Dialog>
      <Confirmation
        useModal={confirmMergeModal}
        title={t("UserDetails.beCareful")}
        description={t("UserDetails.areYouSureYouWantToMoveAll", {
          fromEmail: merge.fromAccount?.primary_email,
          toEmail: merge.toAccount?.primary_email,
        })}
        confirmBtnTitle="UserDetails.yesMerge"
      />
    </>
  );
};
