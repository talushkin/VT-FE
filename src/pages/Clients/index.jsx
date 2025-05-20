import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import Icon from "react-web-vector-icons";
import searchLogo from "../../assets/icons/search.png";
import Button from "../../components/Buttons/Button/Button";
import pageBg from "../../assets/SigninPicNew_resize.png";
import { data } from "./makeData.js";
import axios from "axios";
import { baseURL } from "../../core/index.js";
import PageHeader from "../../components/PageHeader";
import "./Clients.scss";
import Datatable from "../../components/Datatable";
import Popup from "../../components/Popup";
import ClientOfferLog from "./ClientOfferLog";
import EditClient from "./EditClient";
import ClientSavedSearch from "./ClientSavedSearch";
import Paging from "../../components/Paging";
import constants from "../../Util/constants";
import closeIcon from "../../assets/icons/closeIcon.png";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import AuthService from "../../services/auth.service";
import swal from "sweetalert";
import LoadingBox from "../../components/LoadingBox/index.js";

const NEW_CLIENT = {
  id: "-1",
  firstName: "",
  lastName: "",
  email: "",
  state: "",
  phone: "",
};

const Clients = (props) => {
  const { agent, agency, token } = props;
  const [searchInputes, setsearchInputes] = useState({
    customerName: "",
    customerEmail: "",
  });
  const [emailLog, setemailLog] = useState("");
  const [NickNameLog, setNickNameLog] = useState("");
  const [phoneLog, setePhoneLog] = useState("");
  const [singleClientData, setsingleClientData] = useState([]);
  const [selectedClientToShowOffers, setSelectedClientToShowOffers] = useState({});
  const [selectedClientToShowSavedSearch, setSelectedClientToShowSavedSearch] =
    useState(null);
  const [selectedClientToEdit, setSelectedClientToEdit] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => data);
  const [clients, setClients] = useState([]);
  const [sortedClients, setSortedClients] = useState(clients);
  const [isRefresh, setIsRefresh] = useState(false);
  const [sortingName, setSortingName] = useState("firstName");
  const [modalData, setModalData] = useState({
    title: "Add new Client",
  });
  const [filterClients, setFilterClients] = useState(null);
  const [searchClients, setSearchClients] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [sortColumn, setSortColumn] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [totalClients, setTotalClients] = useState(0); // State for total clients

  const agentId = localStorage.getItem("agent_id");
  const clientPagingSize = 4; // Set the limit to 4

  const doSearch = (pageNumber) => {
    getAllClients(pageNumber);
  };

  const onChangePage = (pageNumber) => {
    setPageNumber(pageNumber);
    doSearch(pageNumber);
  };

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const getAllClients = async (pageNumber) => {
    const agentID = localStorage.getItem("agent_id");
    const clientResponse = await userRequest.get(
      `/client/get-clients?agent_id=${agentID}`,
      {
        params: {
          limit: clientPagingSize,
          skip: pageNumber * clientPagingSize,
        },
      }
    );
    console.log(sortDirection, sortingName, pageNumber)
    setSortedClients(clientResponse.data.clients);
    setClients(clientResponse.data.clients);
    setFilterClients(clientResponse.data.clients);
    setTotalClients(clientResponse.data.totalClient); // Set total clients
  };

  const handleSorting = async (orderBy) => {
    const agentID = localStorage.getItem("agent_id");
    const authToken = localStorage.getItem("jToken");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.get(
        `${baseURL}/client/get-clients?agent_id=${agentID}&sortBy=${sortingName}:${orderBy}&limit=${clientPagingSize}&skip=${pageNumber * clientPagingSize}`,
        config
      );
      // response.data.clients
      // const sortedClients = response.data.clients.sort((a, b) => {
      //   if (sortDirection === 'asc') {
      //     return a[orderBy].localeCompare(b[orderBy]);
      //   } else {
      //     return b[orderBy].localeCompare(a[orderBy]);
      //   }
      // });
      return { clients: response.data.clients, totalClient: response.data.totalClient };
    } catch (error) {
      console.error("Error fetching sorted clients:", error);
      throw error;
    }
  };

  useEffect(() => {
    // getAllClients(pageNumber);
    setSelectedClientToShowOffers(null)
  }, [isRefresh]);

  useEffect(() => {
    const fetchSortedData = async () => {
      try {
        setLoading(true);
        const { clients, totalClient } = await handleSorting(sortDirection);
        setSortedClients(clients);
        setTotalClients(totalClient); // Set total clients
      } catch (error) {
        console.error("Error fetching sorted data:", error);
      } finally {
        setLoading(false);
      }
    };
    console.log(sortDirection, sortingName, pageNumber)
    fetchSortedData();
  }, [sortDirection, sortingName, pageNumber]);

  const handleSearchClients = (name, value) => {
    setsearchInputes({ ...searchInputes, [name]: value });
  };

  const handleSearchButton = () => {
    AuthService.GetClientCstApi(
      searchInputes.customerName,
      searchInputes.customerEmail,
      agentId
    )
      .then((response) => {
        if (response) {
          setClients(response.clients);
          setSortedClients(response.clients);
          setTotalClients(response.totalClient); // Set total clients
          if (response.clients.length === 0) {
            swal({
              show: true,
              icon: "error",
              title: "Oops!!",
              text: "No Data Found",
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const headerSearchRow = () => {
    return (
      <div className="clients-search-container test-container row mb-0">
        <div className="col-sm-2 m-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Client name / Nick name"
            onChange={(e) =>
              handleSearchClients("customerName", e.target.value)
            }
          />
        </div>
        <div className="col-sm-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Enter customer email"
            onChange={(e) =>
              handleSearchClients("customerEmail", e.target.value)
            }
          />
        </div>
        <div className="col-sm-1 m-2">
          <Button
            style={{ height: "42px", fontSize: "25px" }}
            variant="green"
            text="Search"
            fullwidth={true}
            icon={<img src={searchLogo} style={{ width: "20px" }} />}
            onClick={handleSearchButton}
          />
        </div>
        <div className="col-sm-2 d-flex align-items-center">
          <span className="clients-search-separator"></span>
          <div
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center text-center"
            onClick={handleClientsModalOpen}
          >
            <Icon
              name="pluscircle"
              font="AntDesign"
              color="white"
              size={30}
              style={{ cursor: "pointer" }}
            />
            <p
              style={{
                paddingLeft: "10px",
                color: "white",
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer",
                marginTop: "10px",
              }}
              data-bs-toggle="modal"
              href="#exampleModalToggle"
            >
              Add New Client
            </p>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      id: "firstName",
      name: "Name",
      headerStyle: { paddingLeft: "50px", backgroundColor: "#F5F5F2" },
      selector: (row) => row.firstName,
      cell: (row) => (
        <div className="link18" onClick={() => setSelectedClientToEdit(row)}>
          {row.firstName}
        </div>
      ),
      width: "1fr",
    },
    {
      id: "lastName",
      name: "Last Name",
      sortable: true,
      selector: (row) => row.lastName,
      cell: (row) => <div>{row.lastName||''}</div>,
      width: "1fr",
    },
    {
      id: "nickName",
      name: "Nick Name",
      sortable: true,
      selector: (row) => row.nick,
      cell: (row) => <div>{row.nickName}</div>,
      width: "1fr",
    },
    {
      id: "email",
      name: "Email Address",
      sortable: true,
      selector: (row) => row.email,
      cell: (row) => row.email,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "1fr",
    },
    {
      id: "phone",
      name: "Phone No.",
      sortable: true,
      selector: (row) => row.phone,
      cell: (row) => <div>{row.phone}</div>,
      width: "1fr",
    },
    {
      id: "offers",
      name: "Offers",
      width: "1fr",
      header: (column, index) => (
        <div
          key={index}
          style={{
            color: "#1B9C5D",
            backgroundColor: "#F5F5F2",
            fontSize: "22px",
            fontWeight: 500,
          }}
        >
          Offers
        </div>
      ),
      headerStyle: { backgroundColor: "#F5F5F2" },
      sortable: true,
      selector: (row) => row.offers,
      cell: (row) => (
        <div
          onClick={() => setSelectedClientToShowOffers(row)}
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            backgroundColor: "#F9F9F8",
            justifyContent: "center",
          }}
        >
          <Icon
            name="calendar-check"
            font="MaterialCommunityIcons"
            color="#1B9C5D"
            size={26}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
      width: "150px",
    },    
    {
      id: "savedSearch",
      name: "Saved search",
      header: (column, index) => (
        <div
          key={index}
          style={{
            color: "#1B9C5D",
            backgroundColor: "#F5F5F2",
            fontSize: "21px",
            lineHeight: "21px",
            fontWeight: 500,
          }}
        >
          Saved search
        </div>
      ),
      headerStyle: { backgroundColor: "#F5F5F2" },
      sortable: true,
      selector: (row) => row.savedSearch,
      cell: (row) => (
        <div
          onClick={() => setSelectedClientToShowSavedSearch(row)}
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            backgroundColor: "#F9F9F8",
            justifyContent: "center",
          }}
        >
          <Icon
            name="search"
            font="MaterialIcons"
            color="#1B9C5D"
            size={26}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
      width: "150px",
    },
  ];

  const clientsPagingFrom = 1 + pageNumber * clientPagingSize;
  let clientsPagingTo = (pageNumber + 1) * clientPagingSize;
  if (totalClients < clientsPagingTo) {
    clientsPagingTo = totalClients;
  }

  const handleEditmodel = (agentId, agencyId, clientId) => {
    setSelectedClientToEdit(agentId, agencyId, clientId);

    AuthService.GetSingleClientApi(agentId, agencyId, clientId)
      .then((response) => {
        if (response) {
          setsingleClientData(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handeClaenderButton = (agent_id, email, client_id, nickName, phone) => {
    setSelectedClientToShowOffers(agent_id, email, nickName, phone, client_id);
    localStorage.setItem('client_id', client_id)
    setemailLog(email);
    setNickNameLog(nickName);
    setePhoneLog(phone);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedClientsData = [...sortedClients].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn].localeCompare(b[sortColumn]);
    } else {
      return b[sortColumn].localeCompare(a[sortColumn]);
    }
  });

  const handleClientsModalOpen = () => {
    setSelectedClientToEdit(NEW_CLIENT);
    document.body.style.overflow = "hidden";
  };
  const handleClientsModalClosed = () => {
    setSelectedClientToEdit(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="clients-container">
      {selectedClientToShowOffers && (
        <ClientOfferLog
          emailLog={emailLog}
          NickNameLog={NickNameLog}
          phoneLog={phoneLog}
          token={token}
          client={selectedClientToShowOffers}
          onClose={() => setSelectedClientToShowOffers(null)}
        />
      )}

      {selectedClientToShowSavedSearch && (
        <ClientSavedSearch
          emailLog={emailLog}
          NickNameLog={NickNameLog}
          phoneLog={phoneLog}
          token={token}
          client={selectedClientToShowSavedSearch}
          onClose={() => setSelectedClientToShowSavedSearch(null)}
        />
      )}

      {
        selectedClientToEdit && (
          <EditClient
            singleClientData={singleClientData}
            token={token}
            agency={agency}
            agent={agent}
            client={selectedClientToEdit}             
            onClose={handleClientsModalClosed}
            getAllClients= {getAllClients}
          />
        )
      }
      <div style={{ backgroundImage: `url(${pageBg})`, "background-size": "cover" }}>
        <div style={{ backgroundColor: 'rgba(19, 59, 113, 0.8)' }}>
          <PageHeader
            agent={agent}
            agency={agency}
            searchOpen={null}
            topBgColor="#16395C"
          ></PageHeader>
          {headerSearchRow()}
        </div>
      </div>

      <div className={selectedClientToEdit ? "content-hidden" : "clients-main p-4"}>
        <div className="clients-title">          
          <h3 className="page-title">Client List </h3>
        </div>
        <div className="clients-paging">
          Displaying clients {clientsPagingFrom}-{clientsPagingTo} of {totalClients ? totalClients : "?"}
        </div>

        <Paging
          perPage={clientPagingSize}
          totalItems={totalClients}
          currentPage={pageNumber}
          onChangePage={onChangePage}
        />
        {loading && (
          <div>
            <LoadingBox visible={loading} />
          </div>
        )}
        {!loading && (
            <div className="table-responsive">
            <table className="table">
              <thead className="sticky-top">
                <tr>
                  {columns?.map((iteam, index) => {
                    return (
                      <>
                        <th
                          key={index}
                          scope="col"
                          className={
                            (
                              iteam.id === "offers" ||
                              iteam.id === "savedSearch"
                            ) ? "offers-saved-search" :""
                          }
                          onClick={() => {
                            if (
                              iteam.id === "offers" ||
                              iteam.id === "savedSearch"
                            ) {
                              // handleSort(iteam)
                            } else {
                              handleSort('firstName');
                            }
                          }}
                        >
                          {iteam.name}
                          {iteam.id === "offers" ||
                          iteam.id === "savedSearch" ? (
                            ""
                          ) : (
                            <>
                              {sortColumn === iteam.id ? (
                                sortDirection === "asc" ? (
                                  <BsChevronDown />
                                ) : (
                                  <BsChevronUp />
                                )
                              ) : (
                                ''// <BsChevronDown /> 
                              )}
                            </>
                          )}
                        </th>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                
                {!loading && sortedClientsData.length > 0 ? (
                  sortedClientsData?.map((iteam, index) => {
                    return (
                      <>
                        <tr>
                          <td className="text-primary text-decoration-underline cst-cursor"  onClick={() =>
                                handleEditmodel(
                                  iteam.agent_id,
                                  iteam.agency_id,
                                  iteam.client_id
                                )
                              }>
                            
                              {iteam.firstName !== null ? iteam.firstName : "-"}
                            
                          </td>
                          <td className="text-primary text-decoration-underline cst-cursor"  onClick={() =>
                                handleEditmodel(
                                  iteam.agent_id,
                                  iteam.agency_id,
                                  iteam.client_id
                                )
                              }>
                            
                              {iteam.lastName !== null ? iteam.lastName : "-"}
                            
                          </td>
                          <td>
                          
                              {iteam.nickName !== null ? iteam.nickName : "-"}
                          
                          </td>
                          <td>
                          {iteam.email !== null ? iteam.email : "-"} 
                          </td>
                          <td>
                          {iteam.phone !== null ? iteam.phone : "-"} 
                          </td>
                          <th className="cst-cursor text-center"  onClick={() =>
                                handeClaenderButton(
                                  iteam.agent_id,
                                  iteam.email,
                                  iteam.client_id,
                                  iteam.nickName,
                                  iteam.phone
                                )
                              }>
                          
                              <BiCalendarCheck
                                style={{ color: "green", fontSize: "26px" }}
                              />
                          
                          </th>
                          <th
                            className="cst-cursor text-center"
                            onClick={() =>
                              setSelectedClientToShowSavedSearch(iteam)
                            }
                          >
                          
                              <IoIosSearch
                                style={{ color: "green", fontSize: "26px" }}
                              />
                            
                          </th>
                        </tr>
                      </>
                    );
                  })):""}
              </tbody>
            </table>
          </div>
        )}
        
      </div>

      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        modalData={modalData}
      />
    </div>
  );
};

// Example of creating a MUI dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  modalData,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        textAlign="center"
        className="font-color"
        style={{ background: "#F2F9FC" }}
      >
        {modalData.title}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "500px" },
              gap: "1.5rem",
            }}
          >
            <div className="row g-3 pt-3">
              <div className="col-md-6 px-4">
                <div className="row mb-2">
                  <label htmlFor="inputText4" className="form-label mb-1 ps-0">
                    Client Name*
                  </label>
                  <input
                    type="name"
                    className="form-control rounded-0 py-2"
                    id="inputText4"
                    placeholder="Smiling House"
                  />
                </div>
                <div className="row mb-2">
                  <label htmlFor="inputText14" className="form-label mb-1 ps-0">
                    Client Email Address*
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-0 py-2"
                    id="inputText14"
                    placeholder="Ttravel@Smilinghouse.ch"
                  />
                </div>
                <div className="row mb-2">
                  <label
                    htmlFor="inputAddress"
                    className="form-label mb-1 ps-0"
                  >
                    Client Phone*
                  </label>
                  <input
                    type="phone"
                    className="form-control rounded-0 py-2"
                    id="inputAddress"
                    placeholder="+41-79-489-7021"
                    maxLength={11}
                  />
                </div>
              </div>
              <div className="col-md-6 px-4">
                <div className="row mb-2">
                  <label
                    htmlFor="inputAddress"
                    className="form-label mb-1 ps-0"
                  >
                    Nick Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0 py-2"
                    id="inputAddress"
                    placeholder="Smiling"
                  />
                </div>
                <div className="row mb-2">
                  <label
                    for="exampleFormControlTextarea1"
                    class="form-label mb-1 ps-0"
                  >
                    Notes
                  </label>
                  <textarea
                    class="form-control rounded-0 py-2"
                    id="exampleFormControlTextarea1"
                    rows="4"
                  ></textarea>
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

export default Clients;
