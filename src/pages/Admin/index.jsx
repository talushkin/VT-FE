import React, { useEffect, useState } from "react";
import Icon from "react-web-vector-icons";
import Button from "../../components/Buttons/Button/Button";
import pageBg from "../../assets/SigninPicNew_resize.png";
import editIcon from "../../assets/icons/admin-edit-icon.png";
import editAdminIcon from "../../assets/icons/admin/menu/edit.svg";
import addAdminIcon from "../../assets/icons/admin/menu/add.svg";
import deleteAdminIcon from "../../assets/icons/admin/menu/delete.svg";
import PageHeader from "../../components/PageHeader";
import Datatable from "../../components/Datatable";
import Popup from "../../components/Popup";
import EditAgency from "./EditAgency";
import { data } from "./makeData.js";
import "./Admin.scss";
import ApproveAgent from "./ApproveAgent";
import DisApproveAgent from "./DisApproveAgent";
import DeleteAgency from "./DeleteAgency";
import axios from "axios";
import { baseURL } from "../../core/index.js";
import Paging from "../../components/Paging";
import AdminPaging from "./AdminPaging/index.js";
import constants from "../../Util/constants";
import countryList from "../../Util/data/countries.json";
import { BorderColor, RawOff } from "@mui/icons-material";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import LoadingBox from "../../components/LoadingBox/index.js";
import moment from "moment";
import { iteratee, startCase } from "lodash";
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AgentLog from "./AgentLog";
import AgencyActionDropdown from "./AgencyActionDropDown/index.js";

const NEW_AGENCY = {
  id: "-1",
  agencyName: "",
  agentName: "",
  address: "",
  email: "",
  country: "",
  city: "",
  postalCode: "",
  notes: "",
  phone: "",
};

const Admin = (props) => {
  const { agency, token, agent } = props
  const divRefs = React.useRef([]);
  const [searchInputes, setsearchInputes] = useState({
    agencyName: "",
    agencyId: "",
  });
  const [editClickedId, seteditClickedId] = useState("");
  const [editAgencyId, seteditAgencyId] = useState("");
  const [selectedRowToEdit, setSelectedRowToEdit] = useState(null);
  const [selectedAgencyToEdit, setSelectedAgencyToEdit] = useState(null);
  const [selectedAgencyToDelete, setSelectedAgencyToDelete] = useState(null);
  const [agencyToApprove, setAgencyToApprove] = useState(null);
  const [agencyToDisApprove, setAgencyToDisApprove] = useState(null);
  const [totalAgencies, setTotalAgencies] = useState(0);
  const [agencies, setAgencies] = useState([]);
  const [filterAgencies, setFilterAgencies] = useState();
  const [searchAgencies, setSearchAgencies] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortedAgencies, setSortedAgencies] = useState(agencies);
  const [agentLog, setAgentLog] = useState({});
  const [showAgentLog, setShowAgentLog] = useState(false);
  const [selectedClientToShowOffers, setSelectedClientToShowOffers] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortingName, setSortingName] = useState("status");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
    
  };

  useEffect(() => {
    getAllAgencies();
  }, [statusFilter])

  const getAllAgencies = async () => {
    const status = statusFilter;
    setLoading(true);
    const params = {
      limit: constants.PAGING_AGENCIES_SIZE,
      skip: agenciesPagingFrom - 1,
      sortBy: `agencyDetails.${sortingName}:${sortDirection}`,
    };
    if (status !== "all") {
      if(status !== 'deleted') {
        params.status = status; 
      }
      
    }
    const agenciesResponse = await userRequest.get(`travel-agency/get-travel-agencies`, {params});
   
    let filteredAgencies = agenciesResponse.data.agencies;
    if(status !== 'all') {
      filteredAgencies = agenciesResponse.data.agencies.filter((agency) => {
        return !( agency.agencyDetails[0]?.status !== status);
      });
    }


  // console.log('filteredagenciescount', filteredAgencies.length)
    localStorage.setItem("agencyCount", agenciesResponse.data?.totalAgencies);
    setTotalAgencies(agenciesResponse.data?.totalAgencies ?? 0);
    // console.log(`sort BY: agencyDetails.${sortingName}:${sortDirection}`, agenciesResponse)
    setAgencies(filteredAgencies);
    setSortedAgencies(filteredAgencies);
    setLoading(false);
  };

  const getSearchAgencies = async () => {
    const agenciesResponse = await userRequest.get(
      `travel-agency/get-travel-agencies`,
      {
        params: {
          limit: constants.PAGING_AGENCIES_SIZE,
          skip: agenciesPagingFrom - 1,
          agencyName: searchInputes.agencyName,
          agency_id: searchInputes.agencyId,
        },
      }
    );
    localStorage.setItem("agencyCount", agenciesResponse.data?.totalAgencies);
    setTotalAgencies(agenciesResponse.data?.totalAgencies ?? 0);
    setAgencies(agenciesResponse.data.agencies);
    setSortedAgencies(agenciesResponse.data.agencies);
  };

  const onDeleteAgency = async (agencyId, item) => {
    setSelectedAgencyToDelete(agencyId);
    setSelectedRowData(item); // Set the agency data to the selected row's data
    console.log(agencyId);
  };
  // useEffect(() => {
  //   console.log("Updated Agency ID:", selectedAgencyToDelete);
  //   console.log("Updated Row Data:", selectedRowData);
  // }, [selectedAgencyToDelete, selectedRowData]);

  const onDeleteAgencyConfirm = async (agencyId) => {
    try {
      await userRequest.delete(
        `travel-agency/delete-travel-agencies?agency_id=${agencyId}`
      );
      console.log(`Agency with ID ${agencyId} has been deleted.`);
      getAllAgencies();
    } catch (error) {
      console.error("Error deleting agency:", error);
    }
    setSelectedAgencyToDelete(selectedRowToEdit);
    clearEditMenu();
  };

  const onHardDelete = async (agencyId) => {
    try {
      await userRequest.delete(
        `travel-agency/hard-delete-travel-agencies?agency_id=${agencyId}`
      );
      console.log(`Agency with ID ${agencyId} has been deleted.`);
      getAllAgencies();
    } catch (error) {
      console.error("Error deleting agency:", error);
    }
    setSelectedAgencyToDelete(selectedRowToEdit);
    clearEditMenu();
  };

  const handleSorting = async (orderBy) => {
    const authToken = localStorage.getItem("jToken");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.get(
        `${baseURL}/travel-agency/get-travel-agencies/?sortBy=agencyDetails.${sortingName}:${orderBy}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getAllAgencies();
  }, []);

  useEffect(() => {
    // const fetchSortedData = async () => {
    //   try {
    //     // doSearch(pageNumber)
    //     getAllAgencies();
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    // fetchSortedData();
    getAllAgencies();
  }, [sortDirection]);

  const doSearch = (pageNumber) => {
    setPageNumber(pageNumber);
    getAllAgencies();
  };

  let agenciesPagingFrom = 1 + pageNumber * constants.PAGING_AGENCIES_SIZE;
  let agenciesPagingTo = (pageNumber + 1) * constants.PAGING_AGENCIES_SIZE;

  let filteredagenciesPagingTo = (pageNumber + 1) * agencies.length;

  const onChangePage = (pageNumber) => {
    console.log("page=", pageNumber);
    setPageNumber(pageNumber);
    agenciesPagingFrom = 1 + pageNumber * constants.PAGING_AGENCIES_SIZE;
    agenciesPagingTo = (pageNumber + 1) * constants.PAGING_AGENCIES_SIZE;
    doSearch(pageNumber);
  };

  const menuStyle = () => {
    const pos = divRefs.current[selectedRowToEdit.id].getBoundingClientRect();
    const top = pos.top > window.innerHeight ? window.innerHeight : pos.top;
    return { top: `${top}px`, left: `${pos.left - 170}px` };
  };

  const clearEditMenu = () => {
    setSelectedRowToEdit(null);
  };

  const onShowEditMenu = (row) => {
    setSelectedRowToEdit(row);
  };


  const onAgentLog = (item) => {
    console.log('open Agent Log', item.agencyDetails[0])
    setAgentLog(item.agencyDetails[0])
    setShowAgentLog(true) //show agent log
    clearEditMenu();
  };

  const onEditAgency = (id, agencyidd, item) => {
    seteditClickedId(id);
    seteditAgencyId(agencyidd);
    setSelectedAgencyToEdit(id);
    setSelectedRowData(item);
    clearEditMenu();
  };


  const onAddAgency = () => {
    setSelectedAgencyToEdit(NEW_AGENCY);
    document.body.style.overflow = "hidden";
    clearEditMenu();
  };

  const onAgencyToApprove = (row) => {
    setAgencyToApprove(row);
    const ccIndex = countryList.findIndex((i) => i.name === row.country);
    const cc = ccIndex ? countryList[ccIndex]?.code : "";
  };

  function getCountryCode(row) {
    const ccIndex = countryList.findIndex((i) => i.name === row.country);
    const cc = ccIndex ? countryList[ccIndex].code : "";
    return cc;
  }

  const columns = [
    {
      id: "sl",
      name: "#",
      selector: (row) => (`#`),
      cell: (row) => (
          <div className="link18" onClick={() => {}}>
              {`#`}
          </div>
        ),
      width: "80px",
    },
    {
      id: "id",
      name: "ID",
      selector: (row) => row.agency_id,
      cell: (row) =>
        row.agency_id ? String(row.agency_id).padStart(4, "0") : "---",
      width: "80px",
    },
    {
      id: "status",
      name: "Status",
      width: "180px",
      sortable: true,
      cell: (row) =>
        row.status == "pending" ? (
          <div className="link18" onClick={() => onAgencyToApprove(row)}>
            {row.status}
          </div>
        ) : (
          <div
            className="link18-no-line"
            onClick={() => setAgencyToDisApprove(row)}
          >
            {row.status}
          </div>
        ),
    },
    {
      id: "agencyName",
      name: "Agency Name",
      selector: (row) => row.agencyName,
      cell: (row) => (
        <div className="link18" onClick={() => setSelectedAgencyToEdit(row)}>
          {row.agencyName}
        </div>
      ),
      width: "350px",
    },
    {
      id: "firstName",
      name: "Manager",
      sortable: true,
      selector: (row) => row.firstName,
      cell: (row) => (
        <div className="link18" onClick={() => setSelectedAgencyToEdit(row)}>
          {row.firstName + " " + row.lastName||''}
        </div>
      ),
      width: "250px",
    },
    {
      id: "subAgent",
      name: "Sub Agent",
      sortable: true,
      cell: (row) => (
        <div className="link18" onClick={() => { }}>
          {row.subAgent}
        </div>
      ),
      width: "250px",
    },
    {
      id: "email",
      name: "Email Address",
      sortable: true,
      selector: (row) => row.email,
      cell: (row) => row.email,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "250px",
    },
    {
      id: "website",
      name: "Website",
      sortable: true,
      selector: (row) => row.website,
      cell: (row) => row.website,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "250px",
    },
    {
      id: "phone",
      name: "Phone No.",
      sortable: true,
      selector: (row) => row.phone,
      cell: (row) => <div>{row.phone}</div>,
      width: "250px",
    },
    {
      id: "country",
      name: "Country",
      sortable: true,
      selector: (row) => row.country,
      cell: (row) => (
        <div>
          {row.country ? row.country : ""}
          {row.countryCode && (
            <img
              width="50px"
              src={
                "https://purecatamphetamine.github.io/country-flag-icons/3x2/" +
                row.countryCode +
                ".svg"
              }
            />
          )}
        </div>
      ),
      width: "180px",
    },
    {
      id: "approvedAt",
      name: "Approved At",
      sortable: true,
      cell: (row) =>
        row.status == "pending" ? (
          ""
        ) : (
          <div className="link18-date">{row.approvedAt}</div>
        ),
      width: "150px",
    },
    {
      id: "firstSignIn",
      name: "First Log In",
      sortable: true,
      cell: (row) =>
        row.status == "pending" ? (
          ""
        ) : (
          <div className="link18-date">{row.firstSignIn}</div>
        ),
      width: "150px",
    },
    {
      id: "lastSignIn",
      name: "Last Log In",
      sortable: true,
      cell: (row) =>
        row.status == "pending" ? (
          ""
        ) : (
          <div className="link18-date">{row.lastSignIn}</div>
        ),
      width: "150px",
    },
    {
      id: "subAgent",
      name: "Actions Log",
      sortable: true,
      cell: (row) => (
        <div className="link18" onClick={() => { }}>
          {row.subAgent}
        </div>
      ),
      width: "250px",
    },
    {
      id: "edit",
      name: "Edit",
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
          Edit
        </div>
      ),
      headerStyle: { paddingLeft: "50px", backgroundColor: "#F5F5F2" },
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => onShowEditMenu(row)}
          className="agencies-edit-icon"
          key={row.id}
          ref={(element) => (divRefs.current[row.id] = element)}
        >
          <img src={editIcon} alt="" />
        </div>
      ),
      width: "100px",
    },
  ];

  const handleSearchFuntionality = (value, name) => {
    setsearchInputes({ ...searchInputes, [name]: value });
  };

  const handlSearchButtonAdmin = () => {
    getSearchAgencies();
  };

  function handekanda(status) {
    if (status !== "pending") {
      setAgencyToDisApprove("null");
    }
  }

  const handleSort = (column) => {
    console.log('column to sort',column)
    const { id, name } = column;
    let value = id;
    if (id == "id") {
      value = "_id";
    } else {
      value = id;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
      setSortingName(value);
      setSortColumn(name);
    } else {
      setSortColumn(name);
      setSortDirection("asc");
      setSortingName(value);
    }
  };

  const handleAgencyModalClosed = () => {
    setSelectedAgencyToEdit(null);
    document.body.style.overflow = "auto";
  };
 
  return (
    <div className="agencies-container" style={{ backgroundImage: `url(${pageBg})`, "background-size": "cover" }}>
      {showAgentLog && (
        <AgentLog
          token={token}
          selectedAgency={agentLog}
          agency_id={agentLog.agency_id}
          onClose={() => setShowAgentLog(false)}
        />
      )}
      <PageHeader
        handleSearchFuntionality={handleSearchFuntionality}
        searchInputes={searchInputes}
        handlSearchButtonAdmin={handlSearchButtonAdmin}
        addUser={onAddAgency}
        searchOpen={null}
        topBgColor="#16395C"
      />
      {selectedRowToEdit && (
        <>
          <div
            className="agencies-floating-edit-menu-floater"
            onClick={clearEditMenu}
          />
          <div className="agencies-floating-edit-menu" style={menuStyle()}>
            <div
              className="agencies-floating-edit-menu-row"
              onClick={() => onDeleteAgency(selectedRowToEdit?._id, selectedRowToEdit)}
            >
              <img src={deleteAdminIcon} alt="" />
              &nbsp;&nbsp;Delete Agency
            </div>
            <div
              className="agencies-floating-edit-menu-row"
              onClick={onAddAgency}
            >
              <img src={addAdminIcon} alt="" />
              &nbsp;&nbsp;Add Agency
            </div>
            <div
              className="agencies-floating-edit-menu-row"
              onClick={clearEditMenu}
            >
              &nbsp;&nbsp;close X
            </div>
          </div>
        </>
      )}
      {agencyToApprove && (
        <Popup width={820} onClose={() => setAgencyToApprove(null)}>
          <ApproveAgent
            agency={agencyToApprove}
            onClose={() => setAgencyToApprove(null)}
            getAllAgencies={getAllAgencies}
            onDeleteAgency={() => onDeleteAgencyConfirm(agencyToApprove?.agencyDetails[0]?.agency_id)}
          />
        </Popup>
      )}
      {agencyToDisApprove && (
        <Popup width={820} onClose={() => setAgencyToDisApprove(null)}>
          <DisApproveAgent
            agency={agencyToDisApprove}
            onClose={() => setAgencyToDisApprove(null)}
          />
        </Popup>
      )}
      {selectedAgencyToDelete && (
        <Popup left={40} width={820} onClose={() => setSelectedAgencyToDelete(null)}>
          <DeleteAgency
            agency={selectedAgencyToDelete}
            onClose={() => onDeleteAgencyConfirm(selectedAgencyToDelete)}
            onCancel={() => setSelectedAgencyToDelete(null)}
            onHardDelete={() => onHardDelete(selectedAgencyToDelete)}
            agencyData={selectedRowData}
          />
        </Popup>
      )}
      {selectedAgencyToEdit && (
        <div className="popup-wrapper">
          <div className="popup-container p-2" style={{ width: "830px" }}>
            <EditAgency
              editClickedId={editClickedId}
              editAgencyId={editAgencyId}
              agency={agency}
              agent={agent}
              agencies={agencies}
              agencyToEdit={selectedRowData}
              onClose={() => {
                seteditClickedId("");
                seteditAgencyId("");
                setSelectedAgencyToEdit(null);
                setSelectedRowData(null);
              }}
              getAllAgencies={getAllAgencies}
            />
          </div>
        </div>
      )}
      <div className={selectedAgencyToEdit ? "content-hidden" : "agencies-main p-4"}>
        <div className="agencies-title">
          <h3 className="page-title">Admin Dashboard</h3>
        </div>
        <div className="agencies-main-subtitle">
          Displaying agencies {agenciesPagingFrom}-{filteredagenciesPagingTo} of{" "}
          {localStorage.getItem("agencyCount") ? localStorage.getItem("agencyCount") : "?"}
        </div>
        <div className="paging-container">
          <div className="filter-container">
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusChange}
              className="status-filter-select"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="deleted">Declined</option>
            </select>
          </div>
          <AdminPaging
            perPage={constants.PAGING_AGENCIES_SIZE}
            totalItems={totalAgencies}
            currentPage={pageNumber}
            onChangePage={onChangePage}
          />
        </div>
        
         {loading && (
            <div>
              <LoadingBox visible={loading} />
            </div>
          )}
         {!loading && (
            <div className="table-responsive">
              <table class="table agents-list">
                <thead>
                  <tr>
                    {columns?.map((item, index) => {
                      return (
                        <>
                          <th
                            scope="col"
                            className="nav-dropdown"
                            onClick={() => handleSort(item)}
                          >
                            {item.name}
                            {item.id !== "edit" ? (sortColumn === item.name ? (
                              sortDirection == "asc" ? (
                                <BsChevronDown />
                              ) : (
                                <BsChevronUp />
                              )
                            ) : (
                              ''// <BsChevronDown />
                            )) : ""}
                          </th>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                
                  {!loading &&
                    sortedAgencies?.map((item, index) => {
                      
                      if (item.agencyDetails?.length > 0) {
                        // Example date object
                        const dateObj = item.agencyDetails[0].lastAgentLog
    
                        // Extract the ISO string
                        const isoDate = dateObj;
    
                        // Create a JavaScript Date object
                        const date = new Date(isoDate);
                        let formattedDate;
                        if(isoDate === null || isoDate === undefined) {
                          formattedDate = null;
                        } else {
                          formattedDate = moment(isoDate).utc().format('DD/MM/YYYY');
                        }
                        //console.log('LOG', index, dateObj, moment(dateObj),formattedDate, item.agencyDetails[0].lastAgentAction)
                        //checking for missing country code
                        if(item.agencyDetails[0].country !== null && item?.agencyDetails[0]?.countryCode === "") {
                          const selectedCountry = countryList.find(country => country.name === item.agencyDetails[0].country);
                          if (selectedCountry) {
                            const countryCode = selectedCountry.code
                            item.agencyDetails[0].countryCode = countryCode
                          }
                          
                        }
    
                        return (
                          <>
                            <tr>
                              <td>{agenciesPagingFrom + index || "-"}</td>
                              <td>{item._id || "-"}</td>
                              <td className="text-primary text-decoration-underline cst-cursor" onClick={() => onAgencyToApprove(item)}>
                                {startCase(item.agencyDetails[0].status) || "-"}
                              </td>
                              <td className="text-primary text-decoration-underline cst-cursor" onClick={() =>
                                onEditAgency(
                                  item?._id || 0,
                                  item?.agencyDetails[0]?.agency_id || 0,
                                  item.agencyDetails[0]
                                )
                              }>
                                {startCase(item.agencyDetails[0].agencyName) || "-"}
                              </td>
                              <td className="text-primary text-decoration-underline cst-cursor" onClick={() =>
                                onEditAgency(
                                  item?._id || 0,
                                  item?.agencyDetails[0]?.agency_id || 0,
                                  item.agencyDetails[0]
                                )
                              }>
                                {`${startCase(item.agencyDetails[0].firstName)} ${startCase(item.agencyDetails[0].lastName)}` || "-"}
                              </td>
                              {/* this is agent actions */}
                              
                              {/* this is subagent count */}
                              <td>{item.count || "-"}</td>
                              <td><a href={`mailto:${item.agencyDetails[0].email}`}>{item.agencyDetails[0].email || "-"}</a></td>
                              <td><a target="_blank" href={`https://${item.agencyDetails[0].website}`}>{item.agencyDetails[0].website || "-"}</a></td>
                              <td>{item.agencyDetails[0].phone || "-"}</td>
                              <td>
                                {item.agencyDetails[0].country !== null && item?.agencyDetails[0]?.countryCode !== "" ? (
                                  <img
                                    alt=''
                                    style={{
                                      borderStyle: "solid",
                                      borderColor: "grey",
                                      borderWidth: "0px",
                                    }}
                                    width="50px"
                                    src={
                                      item?.agencyDetails[0]?.countryCode
                                        ? `https://purecatamphetamine.github.io/country-flag-icons/3x2/${item?.agencyDetails[0]?.countryCode
                                          ?.slice(0, 2)
                                          .toUpperCase()}.svg`
                                        : ""
                                    }
                                  />
                                ) : (
                                  ""
                                )}
                                <span style={{display: 'block', fontWeight: 'normal'}}>{item.agencyDetails[0].countryCode || item.agencyDetails[0].country}</span>
                              </td>
                              
                              <td>
                                {item.agencyDetails[0].createdAt != null &&
                                  item.agencyDetails[0].createdAt !== undefined
                                  ? moment(item.agencyDetails[0].createdAt).format("DD/MM/YYYY")
                                  : "-"
                                }
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {item.agencyDetails[0].firstSignIn != null &&
                                  item.agencyDetails[0].firstSignIn !== undefined &&
                                  item.agencyDetails[0].firstSignIn !== ""
                                  ? moment(item.agencyDetails[0].firstSignIn).format("DD/MM/YYYY")
                                  : "-"
                                }
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {item.agencyDetails[0].lastSignIn != null &&
                                  item.agencyDetails[0].lastSignIn !== undefined &&
                                  item.agencyDetails[0].lastSignIn !== ""
                                  ? moment(item.agencyDetails[0].lastSignIn).format("DD/MM/YYYY")
                                  : "-"
                                }
                              </td>
                              <td className="text-primary text-decoration-underline cst-cursor" data-bs-toggle="tooltip" data-bs-placement="top" title={item.agencyDetails[0].lastAgentAction} onClick={() => onAgentLog(item)}>
                                {moment(item.lastAgentLog).isValid() ? formattedDate !== null ? formattedDate : '-' : '-'}
                              </td>
                              <td>
                                {/* <Nav>
                                  <Button 
                                    variant="light" 
                                    className="dropdown-toggle-button"
                                    onClick={() => setShowActionDropdown(!showActionDropdown)}
                                  >
                                    <img src={editIcon} alt="editIcon" />
                                  </Button>
                                  <NavDropdown 
                                    id="nav-dropdown-dark-example" 
                                    className="nav-dropdown"
                                    show={showActionDropdown}
                                    onToggle={(isOpen) => setShowActionDropdown(isOpen)}
                                  >
                                    <img src={editIcon} alt="editIcon" menuVariant="light" id="dropdown-basic"></img>
                                    <NavDropdown.Item href="#" onClick={onAddAgency}>
                                      <img src={addAdminIcon} /> Add Agency
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#" onClick={() =>
                                      onEditAgency(
                                        item?._id || 0,
                                        item?.agencyDetails[0]?.agency_id || 0,
                                        item.agencyDetails[0]
                                      )
                                    }>
                                      <img src={editAdminIcon} /> Edit Agency
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#" onClick={() => onDeleteAgency(item?._id, item)}>
                                      <img src={deleteAdminIcon} /> Delete Agency
                                    </NavDropdown.Item>
                                  </NavDropdown>
                                </Nav> */}
                                <AgencyActionDropdown
                                  item={item}
                                  onDeleteAgency={(agencyId, item) => onDeleteAgency(agencyId, item)}
                                  onAddAgency={() => onAddAgency()}
                                  onEditAgency={(id, agencyId, item) => onEditAgency(id, agencyId, item)}
                                />
                              </td>
                            </tr>
                          </>
                        );
                      }
                      // return 1
                    })}
                </tbody>
              </table>
            </div>
          )}
        
      </div>
    </div>
  );
};

export default Admin;
