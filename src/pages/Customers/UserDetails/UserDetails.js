import React from "react";

import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import {
  Confirmation,
  MergeAccounts,
  OfflinePayment,
} from "../../../components";
import { useData } from "./useData";
import "./styles.css";

export default function UserDetails() {
  const { t } = useTranslation();
  const {
    goBack,
    orders,
    loading,
    options,
    payments,
    userName,
    userData,
    userDataArr,
    ordersColumns,
    paymentsColumns,
    userDataColumns,
    membershipInfo,
    confirmationModal,
    mergeAccountsModal,
    offlinePaymentModal,
    onConfirmCancellation,
  } = useData();

  const renderStatus = () => {
    const status = userData?.membership_active ? "active" : "notActive";

    return (
      <div className={`value ${status}`}>
        {userData?.membership_active
          ? t("Search.active")
          : t("Search.notActive")}
      </div>
    );
  };

  return (
    <div className="user-details-container">
      <Box
        display="flex"
        alignItems="center"
        style={{ cursor: "pointer" }}
        onClick={goBack}
      >
        <ArrowBackIosIcon />
        <Typography variant="h4" style={{ color: "var(--color-primary)" }}>
          {t("UserDetails.backToSearch")}
        </Typography>
      </Box>

      <Box
        mt={10}
        mb={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Typography
          variant="h3"
          style={{
            color: "var(--color-primary)",
            backgroundColor: "#f2f2f2",
            zIndex: 2,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {t("Search.action")}
        </Typography>
        <Box
          width="100%"
          height="1px"
          position="absolute"
          bgcolor="rgba(224, 224, 224, 1)"
        />
      </Box>

      <Typography
        variant="h4"
        style={{
          color: "var(--color-primary)",
          marginBottom: 20,
        }}
      >
        {t("UserDetails.membershipInformation")}
      </Typography>

      {userData && (
        <div className="action-row">
          {membershipInfo.map(({ key, label }) => (
            <div key={key} className="info-column">
              <div className="key">{label}</div>
              {key === "membership_active" ? (
                renderStatus()
              ) : (
                <div className="value">{userData[key]}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <Box mb={10} display="flex" flexDirection={{ xs: "column", sm: "row" }}>
        <Button
          startIcon={<CancelIcon />}
          className="button cancel"
          onClick={confirmationModal.showModal}
        >
          {t("UserDetails.cancelMembership")}
        </Button>
        <Button
          onClick={mergeAccountsModal.showModal}
          startIcon={<MergeTypeIcon />}
          className="button"
        >
          {t("UserDetails.mergeFromOtherAccount")}
        </Button>
        <Button
          onClick={offlinePaymentModal.showModal}
          startIcon={<MonetizationOnIcon />}
          className="button"
        >
          {t("UserDetails.offlinePayment")}
        </Button>
      </Box>

      <Box
        mt={10}
        mb={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Typography
          variant="h3"
          style={{
            color: "var(--color-primary)",
            backgroundColor: "#f2f2f2",
            zIndex: 2,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {t("UserDetails.orders")}
        </Typography>
        <Box
          width="100%"
          height="1px"
          position="absolute"
          bgcolor="rgba(224, 224, 224, 1)"
        />
      </Box>

      <MUIDataTable
        columns={ordersColumns}
        options={options}
        data={loading ? [] : orders}
      />

      <Box
        mt={10}
        mb={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Typography
          variant="h3"
          style={{
            color: "var(--color-primary)",
            backgroundColor: "#f2f2f2",
            zIndex: 2,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {t("UserDetails.payment")}
        </Typography>
        <Box
          width="100%"
          height="1px"
          position="absolute"
          bgcolor="rgba(224, 224, 224, 1)"
        />
      </Box>

      <MUIDataTable
        columns={paymentsColumns}
        options={options}
        data={loading ? [] : payments}
      />

      <Box
        mt={10}
        mb={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Typography
          variant="h3"
          style={{
            color: "var(--color-primary)",
            backgroundColor: "#f2f2f2",
            zIndex: 2,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {t("UserDetails.user")}
        </Typography>
        <Box
          width="100%"
          height="1px"
          position="absolute"
          bgcolor="rgba(224, 224, 224, 1)"
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <MUIDataTable
          data={loading ? [] : userDataArr.slice(0, userDataArr.length / 2)}
          className="table"
          columns={userDataColumns}
          options={options}
        />
        <MUIDataTable
          data={loading ? [] : userDataArr.slice(userDataArr.length / 2)}
          className="table"
          columns={userDataColumns}
          options={options}
        />
      </Box>

      <Confirmation
        onPressConfirm={onConfirmCancellation}
        useModal={confirmationModal}
        title={t("UserDetails.beCareful")}
        description={t("UserDetails.areYouSureYouWantToCancel", {
          name: userName,
        })}
      />
      <MergeAccounts useModal={mergeAccountsModal} />
      <OfflinePayment
        useModal={offlinePaymentModal}
        keycloakId={userData?.keycloak_id}
      />
    </div>
  );
}
