import React from "react";

import MUIDataTable from "mui-datatables";

import { useData } from "./useData";
import "./styles.css";

export default function Activity() {
  const { options, loading, columns, customerActivity } = useData();

  return (
    <MUIDataTable
      columns={columns}
      options={options}
      title={"Activity"}
      data={loading ? [] : customerActivity}
    />
  );
}
