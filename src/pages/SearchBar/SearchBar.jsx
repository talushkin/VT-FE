import React, { useCallback, useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { data, states } from "./makeData.js";
import CustomTable from "../../components/CustomTableSearch/CustomTableSearch";
import { drawerWidth } from "../index.jsx";
import "./SearchBar.css";
import axios from "axios";
import { baseURL } from "../../core/index.js";
import CountrySelect from "../../components/Forms/Fields/CountryAutocomplete/CountrySelect";
import DatePickerArrival from "../../components/Forms/Fields/DatePickerArrival/DatePicker";
import DatePickerDeparture from "../../components/Forms/Fields/DatePickerDeparture/DatePicker";
import SearchButton from "../../components/Icons/SearchButton/SearchButton";
import DropdownField from "../../components/ProfileComp/DropdownField/DropdownField";
import countryList from "../../Util/data/countries.json";
import PriceRange from "../../Util/data/PriceRange.json";
import PCT from "../../Util/data/PCT.json";
import MustHave from "../../Util/data/MustHave.json";
import Amenities from "../../Util/data/Amenities.json";

//autocomplete
//end autocomplete
const Customers = ({ token }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => data);
  const [validationErrors, setValidationErrors] = useState({});
  // state for customers
  const [customers, setCustomers] = useState([]);
  //console.log("SearchBar >>>>");
  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  //   const handleDeleteRow = useCallback(
  //     (row) => {
  //       //send api delete request here, then refetch or update local table data for re-render
  //       tableData.splice(row.index, 1);
  //       setTableData([...tableData]);
  //     },
  //     [tableData]
  //   );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "phone"
                ? validateAge(+event.target.value)
                : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "Agency Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ row }) => {
          let fullName = row.original.firstName + " " + row.original.lastName;
          // //console.log("fullName >>>", fullName);
          return (
            <div
              className="language-js"
              enableCopyButton={false}
              style={{
                backgroundColor: "transparent",
                fontSize: "0.9rem",
                margin: 0,
                padding: 0,
                minHeight: "unset",
              }}
            >
              {fullName}
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email Address",
        enableClickToCopy: true,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "email",
        }),
      },
      {
        accessorKey: "phone",
        header: "Phone No",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "phone",
        }),
        Cell: ({ row }) => (
          <div
            className="language-js"
            enableCopyButton={false}
            style={{
              backgroundColor: "transparent",
              fontSize: "0.9rem",
              margin: 0,
              padding: 0,
              minHeight: "unset",
            }}
          >
            {"+" + row.original.phone}
          </div>
        ),
      },
      // {
      //   accessorKey: "state",
      //   header: "State",
      //   muiTableBodyCellEditTextFieldProps: {
      //     select: true, //change to select for a dropdown
      //     children: states.map((state) => (
      //       <MenuItem key={state} value={state}>
      //         {state}
      //       </MenuItem>
      //     )),
      //   },
      // },
    ],
    [getCommonEditTextFieldProps]
  );

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const getAllCustomers = async () => {
    const fetchCustomers = await userRequest.get(`/agent/get-agents`);
    ////console.log("fetched customers >>>>", fetchCustomers.data.users);
    setCustomers(fetchCustomers.data.users);
  };

  useEffect(() => {
    getAllCustomers();
  }, []);
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 140,
          left: `${drawerWidth + 20}`,
        }}
      >
        <div className="d-flex align-items-center ps-4 mb-3">
          <div className="form d-flex align-items-center flex-wrap">
            <form className="row d-flex align-items-center pe-3 border-right-One">
              <div className="col-auto m-0 px-2">
                <CountrySelect />
              </div>
              <div className="col-auto m-0 px-1">
                <DatePickerArrival />
              </div>
              <div className="col-auto m-0 px-1">
                <DatePickerDeparture />
              </div>
              <div className="col-auto m-0 px-1">
                <input
                  type="text"
                  className="form-control border-radius-0 py-2"
                  id="GroupList"
                  placeholder="Any Guests, Any Bedrooms"
                />
              </div>
              <div className="col-auto m-0 px-2">
                <button

                  type="submit"
                  className="btn btn-success border-radius-0"
                  style={{ backgroundColor: "#1B9C5D" }}
                >
                  Search
                </button>
              </div>
            </form>
            <div className="button ps-3">
              <div className="">
                <button
                  color="transparent"
                  variant="transparent"
                  className="px-2 text-white d-flex align-items-center bg-transparent border-none"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <span>
                    <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M55 0H5C2.23858 0 0 2.23858 0 5V55C0 57.7614 2.23858 60 5 60H55C57.7614 60 60 57.7614 60 55V5C60 2.23858 57.7614 0 55 0Z" fill="#04BE63" />
                      <path d="M30.906 50.635C42.14 50.635 51.247 41.3042 51.247 29.794C51.247 18.2838 42.14 8.953 30.906 8.953C19.672 8.953 10.565 18.2838 10.565 29.794C10.565 41.3042 19.672 50.635 30.906 50.635Z" fill="white" />
                      <path d="M38.04 21.082C38.04 21.5132 37.9121 21.9347 37.6726 22.2932C37.4331 22.6517 37.0926 22.9311 36.6943 23.0961C36.2959 23.2611 35.8576 23.3043 35.4347 23.2201C35.0118 23.136 34.6234 22.9284 34.3185 22.6235C34.0136 22.3186 33.806 21.9302 33.7219 21.5073C33.6378 21.0844 33.6809 20.6461 33.8459 20.2478C34.0109 19.8494 34.2904 19.509 34.6489 19.2694C35.0074 19.0299 35.4288 18.902 35.86 18.902C36.438 18.9026 36.9922 19.1324 37.4009 19.5411C37.8096 19.9498 38.0395 20.504 38.04 21.082V21.082ZM26.523 28.214C26.0918 28.214 25.6704 28.3419 25.3119 28.5814C24.9534 28.821 24.6739 29.1614 24.5089 29.5598C24.3439 29.9581 24.3008 30.3964 24.3849 30.8193C24.469 31.2422 24.6766 31.6306 24.9815 31.9355C25.2864 32.2404 25.6748 32.448 26.0977 32.5321C26.5206 32.6163 26.9589 32.5731 27.3573 32.4081C27.7556 32.2431 28.0961 31.9637 28.3356 31.6052C28.5751 31.2467 28.703 30.8252 28.703 30.394C28.7025 29.816 28.4726 29.2618 28.0639 28.8531C27.6552 28.4444 27.101 28.2146 26.523 28.214V28.214ZM32.023 37.526C31.5918 37.526 31.1704 37.6539 30.8119 37.8934C30.4534 38.133 30.1739 38.4734 30.0089 38.8718C29.8439 39.2701 29.8008 39.7084 29.8849 40.1313C29.969 40.5542 30.1766 40.9426 30.4815 41.2475C30.7864 41.5524 31.1748 41.76 31.5977 41.8441C32.0206 41.9283 32.4589 41.8851 32.8573 41.7201C33.2556 41.5551 33.5961 41.2757 33.8356 40.9172C34.0751 40.5587 34.203 40.1372 34.203 39.706C34.2025 39.1275 33.9722 38.5729 33.5629 38.1641C33.1535 37.7553 32.5985 37.5258 32.02 37.526H32.023ZM54.45 30.394C54.4498 35.03 53.0749 39.5619 50.4992 43.4166C47.9235 47.2712 44.2626 50.2756 39.9795 52.0497C35.6964 53.8238 30.9833 54.2881 26.4364 53.3837C21.8894 52.4794 17.7127 50.247 14.4344 46.969C11.1561 43.691 8.92344 39.5145 8.01871 34.9676C7.11397 30.4207 7.57782 25.7077 9.35158 21.4244C11.1253 17.1411 14.1294 13.48 17.9838 10.9039C21.8382 8.32789 26.37 6.95262 31.006 6.95203C37.2209 6.95917 43.1792 9.43127 47.5738 13.826C51.9683 18.2207 54.4401 24.1791 54.447 30.394H54.45ZM44.695 39.706C44.695 39.4143 44.5791 39.1345 44.3728 38.9282C44.1665 38.7219 43.8867 38.606 43.595 38.606H36.258C36.0147 37.6671 35.4665 36.8356 34.6994 36.242C33.9324 35.6484 32.9899 35.3263 32.02 35.3263C31.0501 35.3263 30.1076 35.6484 29.3406 36.242C28.5735 36.8356 28.0253 37.6671 27.782 38.606H18.416C18.1243 38.606 17.8445 38.7219 17.6382 38.9282C17.4319 39.1345 17.316 39.4143 17.316 39.706C17.316 39.9978 17.4319 40.2776 17.6382 40.4838C17.8445 40.6901 18.1243 40.806 18.416 40.806H27.783C28.0263 41.7449 28.5745 42.5764 29.3416 43.17C30.1086 43.7637 31.0511 44.0857 32.021 44.0857C32.9909 44.0857 33.9334 43.7637 34.7004 43.17C35.4675 42.5764 36.0157 41.7449 36.259 40.806H43.598C43.8892 40.8052 44.1682 40.689 44.3739 40.4828C44.5795 40.2766 44.695 39.9972 44.695 39.706V39.706ZM44.695 30.394C44.695 30.1023 44.5791 29.8225 44.3728 29.6162C44.1665 29.4099 43.8867 29.294 43.595 29.294H30.765C30.5217 28.3551 29.9735 27.5236 29.2064 26.93C28.4394 26.3364 27.4969 26.0143 26.527 26.0143C25.5571 26.0143 24.6146 26.3364 23.8476 26.93C23.0805 27.5236 22.5323 28.3551 22.289 29.294H18.416C18.1243 29.294 17.8445 29.4099 17.6382 29.6162C17.4319 29.8225 17.316 30.1023 17.316 30.394C17.316 30.6858 17.4319 30.9656 17.6382 31.1718C17.8445 31.3781 18.1243 31.494 18.416 31.494H22.285C22.5283 32.4329 23.0765 33.2644 23.8436 33.858C24.6106 34.4517 25.5531 34.7737 26.523 34.7737C27.4929 34.7737 28.4354 34.4517 29.2024 33.858C29.9695 33.2644 30.5177 32.4329 30.761 31.494H43.597C43.8884 31.4935 44.1677 31.3774 44.3735 31.1711C44.5794 30.9649 44.695 30.6854 44.695 30.394ZM44.695 21.082C44.695 20.7903 44.5791 20.5105 44.3728 20.3042C44.1665 20.0979 43.8867 19.982 43.595 19.982H40.095C39.8517 19.0431 39.3035 18.2116 38.5364 17.618C37.7694 17.0244 36.8269 16.7023 35.857 16.7023C34.8871 16.7023 33.9446 17.0244 33.1776 17.618C32.4105 18.2116 31.8623 19.0431 31.619 19.982H18.416C18.1243 19.982 17.8445 20.0979 17.6382 20.3042C17.4319 20.5105 17.316 20.7903 17.316 21.082C17.316 21.3738 17.4319 21.6536 17.6382 21.8598C17.8445 22.0661 18.1243 22.182 18.416 22.182H31.622C31.8653 23.1209 32.4135 23.9524 33.1806 24.546C33.9476 25.1397 34.8901 25.4617 35.86 25.4617C36.8299 25.4617 37.7724 25.1397 38.5394 24.546C39.3065 23.9524 39.8547 23.1209 40.098 22.182H43.598C43.8892 22.1812 44.1682 22.065 44.3739 21.8588C44.5795 21.6526 44.695 21.3732 44.695 21.082V21.082Z" fill="#04BE63" />
                    </svg>

                  </span>
                  <span className="px-1">Advanced Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 box-shadow-remover r-m-t">
        <MaterialReactTable
          columns={columns}
          // data={tableData}
          data={customers}
          editingMode="modal" //default
          enableFilters={false}
          enablePagination={false}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          enableHiding={false}
          positionExpandColumn="last"
          positionActionsColumn="last"
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Tooltip arrow placement="right" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderDetailPanel={({ row }) => <CustomTable row={row} />}
          muiTableBodyProps={{
            sx: {
              boxShadow: "none",
            },
          }}
          muiTableHeadCellProps={{
            //easier way to create media queries, no useMediaQuery hook needed.
            sx: {
              fontSize: {
                xs: "10px",
                sm: "11px",
                md: "12px",
                lg: "13px",
                xl: "14px",
              },
            },
          }}
        />
      </div>

      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </div>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle
        textAlign="center"
        className="font-color"
        style={{ background: "#F2F9FC" }}
      >Advanced Search Options
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "800px", sm: "1200px", md: "1590px" },
              gap: "1.5rem",
            }}
          >
            <div className="row g-4 pt-4">
              <div className="col-md-4 border-end">
                <div className="g-4">
                  <DropdownField
                    //label={"Price($)"}
                    id="PriceRange"
                    value={""}
                    //   setValue={(e) => e}
                    dropDownObj={PriceRange}
                    placeholder="Price-range"
                  />
                </div>
              </div>
              <div className="col-md-4 border-end">
                <div className="g-4">
                  <DropdownField
                    //label={"Price($)"}
                    id="PCT"
                    value={""}
                    //   setValue={(e) => e}
                    dropDownObj={PCT}
                    placeholder="Property Type"
                  />
                </div>
              </div>
              <div className="col-md-4 border-end">
                <div className="g-4">
                  <DropdownField
                    //label={"Price($)"}
                    id="MustHave"
                    value={""}
                    //   setValue={(e) => e}
                    dropDownObj={MustHave}
                    placeholder="Must Have"
                  />
                </div>
              </div>
              <div className="col-md-4 border-end">
                <div className="g-4">
                  <DropdownField
                    //label={"Price($)"}
                    id="Amenities"
                    value={""}
                    //   setValue={(e) => e}
                    dropDownObj={Amenities}
                    placeholder="Amenities"
                  />
                </div>
              </div>
            </div>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <button
          type="submit"
          className="btn btn-success border-radius-0 w-25 py-2"
          style={{ backgroundColor: "#165093" }}
          onClick={handleSubmit}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Customers;
