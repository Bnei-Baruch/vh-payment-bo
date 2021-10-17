import React, { useState, useEffect } from "react";
import moment from "moment";

import {
  FailedPayment,
  PendingPayment,
  SucessfulPayment,
  ViewButton,
} from "../../stylesheet/commonstyles";
import { useTranslation } from "react-i18next";

import MUIDataTable from "mui-datatables";
import ConnectivityError from "../../pages/ConnectivityError";

export default function PaymentsTable({ payments, openDrawer, tableHeader }) {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (payments) {
      setData(payments);
    } else {
      setError(true);
    }
  }, [payments]);
  const columns = [
    {
      name: "created_at",
      label: t("common.date"),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
        ),
        // display: false,
      },
    },
    {
      name: "ParamX",
      label: t("payments.paramx"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "accountName",
      label: t("payments.accountName"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "amount",
      label: t("common.amount"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "CCNumber",
      label: t("payments.creditCard"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "ProductType",
      label: t("payments.chargeType"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "PaymentStatus",
      label: t("common.status"),
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return (
            <>
              {value === "success" && (
                <SucessfulPayment>{t("common.success")} </SucessfulPayment>
              )}
              {value === "pending" && (
                <PendingPayment>{t("common.pending")} </PendingPayment>
              )}
              {value === "failed" && (
                <FailedPayment>{t("common.failed")} </FailedPayment>
              )}
            </>
          );
        },
      },
    },
    {
      name: "actions",
      label: t("common.actions"),
      options: {
        filter: true,
        sort: false,
        customBodyRender: () => (
          <ViewButton onClick={() => openDrawer()}>
            {t("common.view")}
          </ViewButton>
        ),
      },
    },
  ];

  const options = {
    selectableRows: false,
    download: false,
    print: false,
    pagination: false,
    responsive: "scroll",
  };
  if (error) {
    return <ConnectivityError />;
  }
  return (
    <MUIDataTable
      title={tableHeader}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
