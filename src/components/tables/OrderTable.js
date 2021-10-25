import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import ConnectivityError from "../../pages/ConnectivityError";
import moment from "moment";
import {
  FailedPayment,
  PendingPayment,
  SucessfulPayment,
  ViewButton,
} from "../../stylesheet/commonstyles";
import { useTranslation } from "react-i18next";
const options = {
  selectableRows: false,
  download: false,
  print: false,
  pagination: false,
  responsive: "scroll",
};
export default function OrderTable({ orders, openDrawer, tableHeader }) {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (orders) {
      const updatedOrder = orders.map((order) => {
        order.FullName = `${order.FirstName} ${order.LastName}`;
        order.amount = `${order.Amount} ${order.Currency} `;
        return order;
      });
      setData(updatedOrder);
    } else {
      setError(true);
    }
  }, [orders]);
  const columns = [
    {
      name: "created_at",
      label: t("common.date"),
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
        ),
      },
    },
    {
      name: "FullName",
      label: t("common.fullName"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Email",
      label: t("common.email"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "ProductType",
      label: t("productType"),
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
      name: "Status",
      label: t("common.status"),
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          console.log(value);
          return (
            <>
              {value === "paid" && (
                <SucessfulPayment>{t("common.paid")} </SucessfulPayment>
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
      label: "Actions",
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
