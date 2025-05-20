import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import notesIcon from "../../../assets/icons/notes.svg";
import specialEvents from "../../../assets/special-collection/events.svg";
import specialFamilies from "../../../assets/special-collection/families.svg";
import greenIcon from "../../../assets/special-collection/green.svg";
import dogsIcon from "../../../assets/special-collection/pets.svg";
import "./AgentLog.scss";
import Button from "../../../components/Buttons/Button/Button.jsx";
import axios from "axios";
import { baseURL } from "../../../core/index.js";
import constants from "../../../Util/constants.js";
import { TiTickOutline } from "react-icons/ti";
import eventsIcon from "../../../assets/collections/icons/events.png";
import familyIcon from "../../../assets/collections/icons/family.png";
import petsIcon from "../../../assets/collections/icons/pets.png";
import sustainIcon from "../../../assets/collections/icons/sustainable.png";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import * as propertyActions from '../../../store/redux/Property/actions.js';
import ShareSelectionPopup from "../../../components/SelectedProperties/ShareSelectionPopup/index.js";
import BlueWhiteButton from "../../../components/Buttons/BlueWhiteButton/index.js";
import shareSelectionOn from "../../../assets/icons/share-selection-on.svg";
import shareSelection from "../../../assets/icons/share-selection.png";
import moment from "moment";
import LogAccordionItem from "./logaccordionitem.jsx";

const AgentLog = (props) => {
  const { agency_id, selectedAgency, client, onClose, token, phoneLog, emailLog, NickNameLog } = props;
  const agent = JSON.parse(localStorage.getItem("agent"));
  const agency = JSON.parse(localStorage.getItem("travelAgency"));
  const [clientLogs, setClientLogs] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const client_id = localStorage.getItem("client_id") || 1;
  const [filterClientLogs, setFilterClientLogs] = useState(null);
  const [searchClientLogs, setSearchClientLogs] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [listingState, setListingState] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [isShareSelectionModalOpen, setIsShareSelectionModalOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (filterClientLogs) {
      console.log(filterClientLogs.length);
      // console.log(filterClientLogs);
      setHasData(filterClientLogs.length > 0);
      setLoading(false);
    }
  }, [filterClientLogs]);

  useEffect(() => {
    const storedPropertiesString = localStorage?.getItem(
      "SelectedPropertiesDropdown"
    );
    const storedPropertiesArray = JSON.parse(storedPropertiesString || "[]");

    const listings =
      storedPropertiesArray?.map((items) => items?.listing) || [];
    setListingState(listings);
  }, []);

  const doSearch = (pageNumber) => {
    getAllClientLogs();
  };

  let clientPagingFrom = 1 + pageNumber * constants.PAGING_CLIENT_SIZE;
  let clientPagingTo = (pageNumber + 1) * constants.PAGING_CLIENT_SIZE;

  const onChangePage = (pageNumber) => {
    setPageNumber(pageNumber);
    clientPagingFrom = 1 + pageNumber * constants.PAGING_CLIENT_SIZE;
    clientPagingTo = (pageNumber + 1) * constants.PAGING_CLIENT_SIZE;
    doSearch(pageNumber);
  };

  const userRequest = axios.create({
    baseURL: baseURL,
    headers: {
      token: `Bearer ${token}`,
    },
  });

  const getAllClientLogs = async () => {
    const clientLogsResponse = await userRequest.get(
      `/agent/get-agents`,
      {
        params: {
          agency_id,
        },
      }
    );
    console.log('agents log data:',clientLogsResponse)
    setClientLogs(clientLogsResponse?.data?.agents);
    setFilterClientLogs(clientLogsResponse?.data?.agents);
  };

  useEffect(() => {
    getAllClientLogs();
  }, [isRefresh]);

  const handleSearchClientLogs = async (clientLogs) => {
    setSearchClientLogs(clientLogs);

    let matches = [];

    if (clientLogs.length > 0) {
      matches = await clientLogs.filter((filt) => {
        const regex = new RegExp(`${clientLogs}`, "gi");
        return filt.email.match(regex) || filt.name.match(regex);
      });
    }

    if (clientLogs.length > 0) {
      setFilterClientLogs(matches);
    } else {
      setFilterClientLogs(clientLogs);
    }
  };

  const renderSpecialCollections = (row) => (
    <div>
      <img
        src={specialEvents}
        className="img-fluid"
        style={{ marginRight: "5px", width: "25px" }}
      />
      <img
        src={specialFamilies}
        className="img-fluid"
        style={{ marginRight: "5px", width: "25px" }}
      />
      <img
        src={greenIcon}
        className="img-fluid"
        style={{ marginRight: "5px", width: "25px" }}
      />
      <img
        src={dogsIcon}
        className="img-fluid"
        style={{ marginRight: "5px", width: "25px" }}
      />
    </div>
  );

  const renderCollectionIcon = (extractedInfo, collection, icon) => {
    if (!extractedInfo || !Array.isArray(extractedInfo)) {
      return null;
    }

    const tagExists = extractedInfo?.includes(collection);

    if (tagExists) {
      return (
        <div className="property-box-footer-left-icon-small">
          <img src={icon} style={{ marginRight: "5px", width: "25px" }} />
        </div>
      );
    } else {
      return null;
    }
  };

  const renderCheckRow = (row) => (
    <div className="offer-datagrid-property">
      <input
        type="checkbox"
        style={{ marginRight: "15px", width: "20px" }}
        onChange={() => handleCheckboxChange(row.property_id)}
      />
      <div className="link18">{row.property_id}</div>
    </div>
  );

  const handleCheckboxChange = (propertyId) => {
    setSelectedProperties((prevState) => {
      const updatedProperties = prevState.includes(propertyId)
        ? prevState.filter((id) => id !== propertyId)
        : [...prevState, propertyId];
      dispatch(propertyActions.loadIds(updatedProperties));
      return updatedProperties;
    });
  };

  const columns = [
    {
      id: "check",
      name: "",
      cell: (row) => renderCheckRow(row),
      width: "250px",
    },
    {
      id: "propertyId",
      name: "Property Id",
      cell: (row) => renderCheckRow(row),
      width: "220px",
    },
    {
      id: "specialCollection",
      name: "Special Collection",
      cell: (row) => renderSpecialCollections(row),
      width: "220px",
    },
    {
      id: "booked",
      name: "Booked",
      sortable: true,
      cell: (row) => <div>{row.booked ? "Y" : "-"}</div>,
      width: "130px",
    },
    {
      id: "propertyName",
      name: "Property Name",
      sortable: true,
      cell: (row) => (
        <div
          className="link18"
          style={{
            textOverflow: "ellipsis",
            width: "530px",
            overflow: "hidden",
          }}
        >
          {row.propertyName}
        </div>
      ),
      width: "560px",
    },
    {
      id: "whereTo",
      name: "Where To",
      sortable: true,
      cell: (row) => <div>{row.whereTo}</div>,
      width: "200px",
    },
    {
      id: "links",
      name: "Links",
      sortable: true,
      cell: (row) => <div>{row.links ? "Y" : "-"}</div>,
      width: "1fr",
    },
    {
      id: "brochure",
      name: "Brochure",
      sortable: true,
      cell: (row) => <div>{row.brochure ? "Y" : "-"}</div>,
      width: "1fr",
    },
    {
      id: "offerDate",
      name: "Date of offer",
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%", textAlign: "center" }}>
          {row.offerDate}
        </div>
      ),
      width: "1fr",
    },
  ];

  let data = [
    {
      propertyId: 1235043639,
      booked: "5.1.2023",
      propertyName: "Amazing Villa with infinity views & sunsets",
      whereTo: "London, uk",
      links: "Y",
      offerDate: "10.1.2023",
    },
    {
      propertyId: 1235043639,
      booked: "5.1.2023",
      propertyName: "Amazing Villa with infinity views & sunsets",
      whereTo: "London, uk",
      links: "Y",
      offerDate: "10.1.2023",
    },
    {
      propertyId: 1235043639,
      booked: "5.1.2023",
      propertyName: "Amazing Villa with infinity views & sunsets",
      whereTo: "London, uk",
      links: "Y",
      offerDate: "10.1.2023",
    },
    {
      propertyId: 1235043639,
      booked: "5.1.2023",
      propertyName: "Amazing Villa with infinity views & sunsets",
      whereTo: "London, uk",
      links: "Y",
      offerDate: "10.1.2023",
    },
  ];
  const test = (propertyId) => {
    history.push(`/property/${propertyId}`);
  };

  data = [...data, ...data, ...data];

  var arr = [];
  const handleCheckbox = (value) => {
    const index = arr.indexOf(value);

    if (index !== -1) {
      arr.splice(index, 1); // Remove value if it exists
    } else {
      arr.push(value); // Add value if it doesn't exist
    }
    console.log([...arr], "sdusdusdusnd");
  };
  const [modalSize, setModalSize] = useState("modal-xl");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1366) {
        setModalSize("modal-xl");
      } else {
        setModalSize("modal-lg");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isValidJsonArray = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed);
    } catch (e) {
      return false;
    }
  };

  const tableData = (item) => {
    console.log(item);
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns?.map((iteam, index) => (
                <th key={index} scope="col" style={{ cursor: "pointer" }}>
                  {iteam.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item?.map((iteam, index) => {
              let propertyIds = [];
              if (isValidJsonArray(iteam.property_id)) {
                propertyIds = JSON.parse(iteam.property_id);
              }
              if (!iteam?.listings || iteam?.listings?.length === 0) {
                return null;
              }
              const propertyIdsData = Array.isArray(propertyIds)
                ? propertyIds
                : [];
              return (
                <React.Fragment key={`${iteam._id}-${index}`}>
                  {propertyIdsData.map((propertyId, idx) => (
                    <tr key={`${iteam._id}-${index}-${idx}`}>
                      <td className="text-primary text-decoration-underline cst-cursor">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(propertyId)}
                        />
                      </td>
                      <td
                        style={{
                          color: "#036ae1",
                          textDecoration: "underline",
                          textDecorationColor: "#036ae1",
                        }}
                      >
                        {" "}
                        <div
                          className="id-btn"
                          onClick={() => test(propertyId)}
                        >
                          {propertyId ? propertyId : "-"}
                        </div>
                      </td>
                      <td style={{ flexDirection: "row" }}>
                        <div style={{ display: "flex" }}>
                          {iteam?.listings.length > 0 ? (
                            <>
                              {iteam.listings.map((tags, tagsIndex) => (
                                <React.Fragment key={tagsIndex}>
                                  {renderCollectionIcon(
                                    tags.tags,
                                    "familyCollection",
                                    familyIcon
                                  )}
                                  {renderCollectionIcon(
                                    tags.tags,
                                    "petsCollection",
                                    petsIcon
                                  )}
                                  {renderCollectionIcon(
                                    tags.tags,
                                    "eventCollection",
                                    eventsIcon
                                  )}
                                  {renderCollectionIcon(
                                    tags.tags,
                                    "sustainCollection",
                                    sustainIcon
                                  )}
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td>{iteam.booked === true ? "Y" : "-"}</td>
                      <td
                        style={{
                          color: "#036ae1",
                          textDecoration: "underline",
                          textDecorationColor: "#036ae1",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {" "}
                        <div
                          className="id-btn"
                          onClick={() => test(propertyId)}
                        >
                          {iteam.listings[idx]?.title
                            ? iteam.listings[idx]?.title
                            : "-"}
                        </div>
                      </td>
                      <td>
                        {iteam.destination !== null ? iteam.destination : "-"}
                      </td>
                      <td className="cst-cursor">
                        {iteam.links === true ? <TiTickOutline /> : "-"}
                      </td>
                      <td className="cst-cursor">
                        {iteam.brochure === true ? "Y" : "-"}
                      </td>
                      <td
                        style={{ whiteSpace: "nowrap" }}
                        className="cst-cursor"
                      >
                        {iteam.dateAction}{" "}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const guestCount = (adult, children) => {
    if (adult !== undefined && children !== undefined) {
      return adult + children;
    } else if (adult !== undefined) {
      return adult;
    } else if (children !== undefined) {
      return children;
    } else {
      return 0;
    }
  };

  const openShareSelectionModal = () => {
    dispatch(propertyActions.loadIds(selectedProperties));
    setIsShareSelectionModalOpen(true);
  };

  const closeShareSelectionModal = () => {
    setIsShareSelectionModalOpen(false);
  };

  const totalSelectedPropertiesItem = selectedProperties.length;

  const displaySortedActions = (data) => {
    data.forEach((element, index) => {
      let sortedActions = element.actions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    })
  }

  return (
    <>
      <div className="popup-wrapper">
        <div
          className="modal modal-body"
          tabIndex="-1"
          style={{ marginTop: "-15px", overflowY: "auto" }}
        >
          <div className={`modal-dialog modal-dialog-centered ${modalSize}`}>
            <div className="modal-content saved-search-client">
              <div className="modal-header">
                <h3
                  className="text-center page-title"
                  style={{ marginLeft: "auto" }}
                >
                  Agency: {agency_id} "{selectedAgency?.agencyName}" - Agents Actions Log
                </h3>
                <button
                  type="button"
                  style={{ marginTop: "-47px", padding: "initial" }}
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={props.onClose}
                ></button>
              </div>

              <div className="modal-body" style={{ marginTop: "-20px" }}>
                
                <div className="row">
                  <div className="col-md-12 col-12">
                    {
                      loading ? (
                        <h3 className="modal-center">Loading...</h3>
                      ) : hasData ? (
                        filterClientLogs.map((agnt, agntIndx) => (
                          <Accordion defaultActiveKey={null}>
                            <>
                              <LogAccordionItem
                                agentkey={agntIndx}
                                agent={agnt}
                              />
                              <hr className="mx-3" />
                            </>
                          </Accordion>
                        ))
                      ) : ('')
                    }
                    
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="float-end mt-4">
                  <Button
                    style={{ fontSize: "15px", marginRight: "30px" }}
                    variant="link"
                    text="Close"
                    onClick={onClose}
                  />
                  {isShareSelectionModalOpen && (
                    <ShareSelectionPopup
                      title="Share selection as PDFs for the client"
                      icon={shareSelection}
                      onClose={closeShareSelectionModal}
                      client={client}
                      agent={agent}
                      agency={agency}
                      showShareAsPdf={true}
                      selectedProperties={selectedProperties}
                      totalSelectedPropertiesItem={totalSelectedPropertiesItem}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentLog;
