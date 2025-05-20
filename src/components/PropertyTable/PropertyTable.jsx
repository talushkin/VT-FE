import MaterialReactTable from "material-react-table";
import React, { useMemo } from "react";
import "./PropertyTable.css";
//nested data is ok, see accessorKeys in ColumnDef below

const PropertyTable = ({ row, token }) => {
  const [propertyLogs, setPropertyLogs] = React.useState([]);

  const constructPropertyData = () => {
    const propertValue = row.original;
    const propertyData = [];
    Object.entries(propertValue).forEach(([key, value]) => {
      if (
        key === "_id" ||
        key === "id" ||
        key === "name" ||
        key === "internalName" ||
        key === "street" ||
        key === "city"
      )
        return;

        
      propertyData.push({ fieldKey: key, fieldValue: value });
    });
    //console.log({ propertyData });
    setPropertyLogs(propertyData);
  };

  React.useEffect(() => {
    constructPropertyData();
  }, []);

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "fieldKey", //access nested data with dot notation
        header: "Field Key",
        size: 200
      },
      {
        accessorKey: "fieldValue", //normal accessorKey
        header: "Field Value",
        size: 400
      },
    ],
    []
  );

  return (
    <div className="w-100 custom-table">
      <MaterialReactTable
        columns={columns}
        data={propertyLogs}
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

export default PropertyTable;
