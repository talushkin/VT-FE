import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import "./CustomTableSearch.css";

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
     Name: "Villa in Israel",
     email: "261 Erdman Ford",
    phone: "East Daphne",
    approved: "Kentucky",
    image:"https://s3.amazonaws.com/mybookingpal/pictures/gst/gst/58cab7acd3d0d00400a9c29e/BFF9F62C5ABFAA14105C4F403823EB6D",
  },
  {
    Name: "Villa in Tivon",
    email: "769 Dominic Grove",
    phone: "Columbus",
    approved: "V",
  },
  {
    Name: "Villa in Tiberias",
    email: "566 Brakus Inlet",
    phone: "South Linda",
    approved: "West Virginia",
  },
  {
Name: "Kevin",
    email: "722 Emie Stream",
    phone: "Lincoln",
    approved: "Nebraska",
  },
  {
      Name: "Joshua Rolluffs",
  email: "32188 Larkin Turnpike",
    phone: "Charleston",
    approved: "South Carolina",
  },
];

const Example = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "Name", //access nested data with dot notation
        header: "Name",
      },
      {
        accessorKey: "email", //normal accessorKey
        header: "email",
      },
      {
        accessorKey: "phone",
        header: "phone",
      },
      {
        accessorKey: "approved",
        header: "approved",
      },
    ],
    []
  );

  return (
    <div className="w-100 custom-table">
      <MaterialReactTable
        columns={columns}
        data={data}
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
