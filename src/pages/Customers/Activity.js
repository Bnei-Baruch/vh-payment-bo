import { Grid } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import React from 'react'
import moment from "moment";
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import getCustomerActivity from '../../services/activity.service';
const StyledGrid = styled(Grid)`
  background-color: #fff;
`;
export default function Activity() {
  const { t } = useTranslation();
  const [page, setPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const options = {
    selectableRows: false,
    download: false,
    print: false,
    search: false,
    filter: false,
    viewColumns: false,
    count: 200,
    rowsPerPageOptions: [10, 25, 50, 100],
    rowsPerPage: rowsPerPage,
    serverSide: true,
    pagination: true,
    onTableChange: (action, tableState) => {
      if (action === 'changeRowsPerPage') {
        getCustomerActivity(tableState.rowsPerPage, tableState.rowsPerPage * page);
        setRowsPerPage(tableState.rowsPerPage);
      }
      if (action === "changePage") {
        getCustomerActivity(rowsPerPage, tableState.page * rowsPerPage);
        setPage(tableState.page);
      }
    }
  };
  const columns = [
    {
      name: "created_at",
      label: t("Activity.dateTime"),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <>{moment(value).format("DD-MM-YYYY HH:MM:SS")} </>
        )
      },

    },
    {
      name: "first_name",
      label: t("Activity.firstName"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "last_name",
      label: t("Activity.lastName"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "email",
      label: t("Activity.email"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "product_type",
      label: t("Activity.productType"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "type",
      label: t("Activity.type"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "amount",
      label: t("Activity.amount"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "currency",
      label: t("Activity.currency"),
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "payment_status",
      label: t("Activity.status"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "paymentMethod",
      label: t("Activity.paymentMethod"),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "additional_details_param_x",
      label: t("Activity.paramX"),
      options: {
        filter: false,
        sort: false,
      },
    }
  ];

  const [customerActivity, setCustomerActivity] = React.useState([]);

  React.useEffect(() => {
    getCustomerActivity(10, 0).then(res => setCustomerActivity(res.data) && setTotalCount(res.totalCount));
  }, [])
  return (
    <MUIDataTable
      title={"Activity"}
      data={customerActivity}
      columns={columns}
      options={options}
    />
  )
}
