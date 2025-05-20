import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import pageBg from "../../assets/SigninPicNew_resize.png";
import searchLogo from "../../assets/icons/search.png";
import Button from "../../components/Buttons/Button/Button";
import PageHeader from "../../components/PageHeader";
import constants from "../../Util/constants";
import LoadingBox from "../../components/LoadingBox";
import axios from "axios";
import { baseURL } from "../../core";
import moment from "moment";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Paging from "../../components/Paging";
import { startCase } from "lodash";
import DatePickerComponent from "../../components/Forms/Fields/DatePickerComponent/DatePickerComponent";
import EditReservation from "./EditReservation";

import "./Reservations.scss";

const Reservations = (props) => {
  const { agent, agency } = props;
  const [reservationId, setReservationId] = useState(0);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editRes, setEditRes] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortColumn, setSortColumn] = useState("reservationID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalReservation, setTotalReservation] = useState(0);
  const [resFilter, setResFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const history = useHistory();

  const recordsPerPage = 4;

  const onEditRes = (item) => {
    if (item.status === "declined") {
      return;
    }
    setSelectedReservation(JSON.stringify(item));
    setEditRes(true);
  };

  const setFilter = (filter) => {
    setResFilter(filter);
    setPageNumber(0); // Reset to first page when filter changes
  };

  const fetchReservations = async (orderBy, sortColumn, filter) => {
    let agent = JSON.parse(localStorage.getItem("agent"));
    let q = '';
    if (agent?.role === "manager") {
      q = agent?.agency_id ? `&agency_id=${parseInt(agent?.agency_id)}` : '';
    }
    if (agent?.role === "agent") {
      q += agent?.agent_id ? `&agent_id=${parseInt(agent?.agent_id)}` : '';
    }
    q += filter ? `&filter=${filter}` : '';

    const authToken = localStorage.getItem("jToken");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.get(
        `${baseURL}/reservation/get-reservations/?sortBy=${sortColumn}:${orderBy}${q}`,
        config
      );
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchReservations(sortDirection, sortColumn, resFilter);
        setReservations(data.reservations.reverse());
        setTotalReservation(data.totalReservation);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortDirection, sortColumn, resFilter]);

  const refreshReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchReservations(sortDirection, sortColumn, resFilter);
      setReservations(data.reservations.reverse());
      setTotalReservation(data.totalReservation);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshReservations();
  }, [sortDirection, sortColumn, resFilter]);


  const handleReservationSearch = (name, value) => {
    setReservationId(value);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSearchClick = async () => {
    let agent = JSON.parse(localStorage.getItem("agent"));
    const params = new URLSearchParams();
    if (agent?.role === "manager") {
      params.append("agency_id", agent.agency_id);
    }
    if (agent?.role === "agent") {
      params.append("agent_id", agent.agent_id);
    }
    params.append("reservationID", reservationId);
    const query = params.toString();
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/reservation/get-reservations?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jToken")}`,
        }
      });
      setReservations(response.data.reservations.reverse());
      setTotalReservation(response.data.totalReservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangePage = (page) => {
    setPageNumber(page);
  };

  const columns = [
    {
      id: "reservationID",
      name: "ResID",
      selector: (row) => row.reservationID,
      cell: (row) => row.reservationID,
      width: "1fr",
    },
    {
      id: "startDate",
      name: "From→To",
      sortable: true,
      selector: (row) => row.startDate,
      cell: (row) => <div>{row.startDate}</div>,
      width: "1fr",
    },
    {
      id: "nights",
      name: "Nights",
      sortable: true,
      selector: (row) => row.nights,
      cell: (row) => <div>{row.nights}</div>,
      width: "1fr",
    },
    {
      id: "status",
      name: "Status",
      sortable: true,
      selector: (row) => row.guestBookingStatus,
      cell: (row) => row.guestBookingStatus,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "1fr",
    },
    {
      id: "destination",
      name: "Destination",
      sortable: true,
      selector: (row) => row.destination,
      cell: (row) => <div>{row.destination}</div>,
      width: "1fr",
    },
    {
      id: "bookedAt",
      name: "Created At",
      sortable: true,
      selector: (row) => row.bookedAt,
      cell: (row) => <div>{moment(row.bookedAt).format("YYYY-MM-DD")}</div>,
      width: "1fr",
    },
    {
      id: "by Agent",
      name: "by",
      sortable: true,
      selector: (row) => row.propertyName,
      cell: (row) => (
        <div className="link18" onClick={() => { }}>
          {row.propertyName}
        </div>
      ),
      width: "1fr",
    },     {
      id: "clientName",
      name: "Client Name",
      sortable: true,
      selector: (row) => row.guestFirstName,
      cell: (row) => <div>{row.guestFirstName}</div>,
      width: "1fr",
    },
    {
      id: "propertyName",
      name: "Property name",
      sortable: true,
      selector: (row) => row.propertyName,
      cell: (row) => (
        <div className="link18" onClick={() => { }}>
          {row.propertyName}
        </div>
      ),
      width: "1fr",
    }, {
      id: "paymentStatus",
      name: "FLYWIRE Status",
      sortable: true,
      selector: (row) => row.guestBookingStatus,
      cell: (row) => row.guestBookingStatus,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "1fr",
    },
    {
      id: "total",
      name: "Total Price",
      sortable: true,
      selector: (row) => row.taxAmount,
      cell: (row) => <div>{row.taxAmount}</div>,
      width: "1fr",
    }
  ];

  const renderHeader = () => {
    return (
      <div style={{ "backgroundColor": "rgba(19, 59, 113, 0.8)" }}>
        <PageHeader
          agent={agent}
          agency={agency}
          searchOpen={null}
          topBgColor="#16395C"
        />
        <div className="mt-4 row p-3">
          <div className=" col-sm-2 m-2 ">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter reservation ID"
              onChange={(e) =>
                handleReservationSearch("reservationId", e.target.value)
              }
            />
          </div>
          <div className="col-sm-4 m-2 ">
            <DatePickerComponent />
          </div>
          <div className="col-sm-1 m-2">
            <Button
              style={{ height: "42px", fontSize: "25px" }}
              variant="green"
              text="Search"
              fullwidth={true}
              icon={<img src={searchLogo} style={{ width: "20px" }} />}
              onClick={handleSearchClick}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="reserve-container"
        style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover' }}
      >
        {renderHeader()}

        <div className="reservations-main-title" style={{ backgroundColor: "#FFF" }}>
          <h3 className="page-title">Reservations</h3>
          <div className="row filter-buttons" style={{marginLeft: '15px'}}>
            {/* <div className="col-sm-2 m-4 filter-btn"> */}
            <div className="col-md-2 col-sm-2 col-2 custom-button-margin  filter-btn">
              <Button
                style={{ height: "42px", fontSize: "25px", backgroundColor: "#32CDD2" }}
                text="Pending"
                fullwidth={true}
                onClick={() => setFilter('pending')}
              />
            </div>
            <div className="col-md-2 col-sm-2 col-2 custom-button-margin  filter-btn">
              <Button
                style={{ height: "42px", fontSize: "25px", backgroundColor: "#1B469C" }}
                text="Future"
                fullwidth={true}
                onClick={() => setFilter('future')}
              />
            </div>
            <div className="col-md-2 col-sm-2 col-2 custom-button-margin  filter-btn">
              <Button
                style={{ height: "42px", fontSize: "25px", backgroundColor: "#6588B5" }}
                variant="green"
                text="Past"
                fullwidth={true}
                onClick={() => setFilter('past')}
              />
            </div>
            <div className="col-md-2 col-sm-2 col-2 custom-button-margin  filter-btn">
              <Button
                style={{ height: "42px", fontSize: "25px", backgroundColor: "#1B9C5D" }}
                variant="green"
                text="Currently staying"
                fullwidth={true}
                onClick={() => setFilter('current')}
              />
            </div>
            <div className="col-md-2 col-sm-2 col-2 custom-button-margin  filter-btn">
              <Button
                style={{ height: "42px", fontSize: "25px", backgroundColor: "#9C1B35" }}
                variant="green"
                text="Declined"
                fullwidth={true}
                onClick={() => setFilter('declined')}
              />
            </div>
          </div>
        </div>

        <div className="reservations-results p-4" style={{ backgroundColor: "#FFF" }}>
          {/* <LoadingBox visible={loading} /> */}
          <div className="reservations-paging">
            Displaying Reservation {1 + pageNumber * recordsPerPage}-{Math.min((pageNumber + 1) * recordsPerPage, totalReservation)} of {totalReservation}
          </div>
          <Paging
            perPage={recordsPerPage}
            totalItems={totalReservation}
            currentPage={pageNumber}
            onChangePage={onChangePage}
          />
          {selectedReservation && (
            <div className="popup-wrapper">
              <div className="popup-container p-2" style={{ width: "830px" }}>
                <EditReservation
                  reservationJSON={selectedReservation}
                  agent={agent}
                  agency={agency}
                  onClose={() => {
                    setSelectedReservation(null);
                    refreshReservations();
                  }}
                />
              </div>
            </div>
          )}
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
                    {columns.map((item) => (
                      <th
                        key={item.id}
                        scope="col"
                        style={{ cursor: "pointer", alignItems: "center" }}
                        onClick={() => handleSort(item.id)}
                      >
                        {item.name}
                        {sortColumn === item.id ? (
                          sortDirection === "asc" ? (
                            <BsChevronDown style={{ marginLeft: "5px" }} />
                          ) : (
                            <BsChevronUp style={{ marginLeft: "5px" }} />
                          )
                        ) : (
                          ''// <BsChevronDown style={{ marginLeft: "5px" }} />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  
                  {!loading && reservations.length > 0 ? (
                    reservations.slice(pageNumber * recordsPerPage, (pageNumber + 1) * recordsPerPage).map((item, index) => {
                      //console.log('res:',index,' ',item)
                      let clientname = `${item.client[0]?.firstName !== null &&
                        item.client[0]?.firstName !== undefined
                        ? item.client[0]?.firstName
                        : ""
                        } ${item.client[0]?.lastName !== null &&
                          item.client[0]?.lastName !== undefined
                          ? item.client[0]?.lastName
                          : "-"
                        }`;
                        
                      return (
                        <tr key={index}>
                          <td>{item.reservationID !== null ? item.reservationID : "-"}</td>
                          <td>{item.startDate !== null && item.startDate !== undefined ?
                            (moment(item.startDate).format("YYYY-MM-DD") + ' → '+
                            moment(item.endDate).format("YYYY-MM-DD"))
                          : "-"}</td>
                          <td>{item.nights !== null ? item.nights : "-"}</td>
                          <td
                            className={`text-primary ${item.status !== "declined" ? "text-decoration-underline cst-cursor" : ""}`}
                            onClick={() => {
                              console.log('onstatusclick',item.status, item)
                              item.status !== "declined" && onEditRes(item)
                            }}
                            style={{
                              cursor: item.status !== "declined" ? "pointer" : "default",
                              color: item.status === "declined" ? "red" : "inherit",
                            }}
                          >
                            {item.status !== null ? startCase(item.status) : "-"}
                          </td>
                          <td>{item?.destination !== null && item?.destination !== undefined ? startCase(item?.destination) : "-"}</td>
                          <td>{item.bookedAt != null && item.bookedAt !== undefined ? moment(item.bookedAt).format("YYYY-MM-DD") : "-"}</td>
                          <td>{item?.agentName !== null && item?.agentName !== undefined ? item?.agentName + '(' + item?.agencyName + ')' : "-"}</td>
                          <td>{startCase(clientname)}</td>
                          <td className="text-primary text-decoration-underline">{item.propertyName !== null && item.propertyName !== undefined ? item.propertyName : "-"}</td>
                          <td className="text-primary text-decoration">{item.flywire !== null && item.flywire?.data?.status !== undefined ? item.flywire?.data?.status : "-"}</td>
                          <td>{item.total !== null ? item.currency +' '+ item.total : "-"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10">No data available</td>
                    </tr>
                  )}
                </tbody>


              </table>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default Reservations;
