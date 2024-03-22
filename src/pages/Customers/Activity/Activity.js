import React from "react";

import MUIDataTable from "mui-datatables";

import { useData } from "./useData";

export default function Activity() {
  const { options, columns, customerActivity } = useData();

  return (
    <MUIDataTable
      columns={columns}
      options={options}
      title={"Activity"}
      data={customerActivity}
    />
  );
}
