import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import "./CustomTable.css";

//nested data is ok, see accessorKeys in ColumnDef below

const Example = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "Name", //access nested data with dot notation
        header: "Field Name",
      },
      {
        accessorKey: "email", //normal accessorKey
        header: "Field Value",
      },
      {
        accessorKey: "phone",
        header: "Type",
      },
      {
        accessorKey: "approved",
        header: "Max capacity",
      },
    ],
    []
  );

  return (
    <div className="w-100 custom-table">
      <MaterialReactTable
        columns={columns}
        enableFilters={false}
        enablePagination={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableHiding={false}
        enableBottomToolbar={false}
        enableTopToolbar={false}
        muiTableHeadProps={{
          sx: {
            "& tr": {
              backgroundColor: "#f2f9fc",
            },
          },
        }}
        muiTableBodyProps={{
          sx: {
            //stripe the rows, make odd rows a darker color
            "& tr:nth-of-type(odd)": {
              backgroundColor: "#f2f9fc",
            },
            "& tr:nth-of-type(even)": {
              backgroundColor: "#f2f9fc",
            },
          },
        }}
      // enableTableHead={false}
      />
    </div>
  );
};

export default Example;
