import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsChevronDown } from "react-icons/bs";
import { baseURL } from "../../../core/index.js";
import Button from "../../../components/Buttons/Button/Button";
import BlueWhiteButton from "../../../components/Buttons/BlueWhiteButton";
import ShareSelectionPopup from "../../../components/SelectedProperties/ShareSelectionPopup";
import notesIcon from "../../../assets/icons/notes.svg";
import specialEvents from "../../../assets/special-collection/events.svg";
import specialFamilies from "../../../assets/special-collection/families.svg";
import greenIcon from "../../../assets/special-collection/icons/green.svg";
import dogsIcon from "../../../assets/special-collection/icons/dogs.svg";
import shareSelectionOn from "../../../assets/icons/share-selection-on.svg";
import shareSelection from "../../../assets/icons/share-selection.png";
import linkOn from "../../../assets/icons/link-on.svg";
import link from "../../../assets/icons/link.png";
import eventsIcon from "../../../assets/collections/icons/events.png";
import familyIcon from "../../../assets/collections/icons/family.png";
import petsIcon from "../../../assets/collections/icons/pets.png";
import sustainIcon from "../../../assets/collections/icons/sustainable.png";
import * as propertyActions from '../../../store/redux/Property/actions';
import constants from "../../../Util/constants";
import "./ClientSavedSearch.scss";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { PATH_PROPERTY } from "../../../Util/constants";

const ClientSavedSearch = (props) => {
  const { client, onClose, token, property, xdata, fullCalendar } = props;
  const agent = JSON.parse(localStorage.getItem("agent"));
  const agency = JSON.parse(localStorage.getItem("travelAgency"));
  const [clientLogs, setClientLogs] = useState([]);
  const [propertyIds, setPropertyIds] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [filterClientLogs, setFilterClientLogs] = useState([]);
  const [listingState, setListingState] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showShareAsLink, setShowShareAsLink] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedPropertiesData = useSelector((state) => state.property.properties);
  const [isShareSelectionModalOpen, setIsShareSelectionModalOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    if (filterClientLogs) {
      setHasData(filterClientLogs.length > 0);
      setLoading(false);
    }
  }, [filterClientLogs]);

  useEffect(() => {
    if (client && client.email) {
      localStorage.setItem('clientEmail', client.email);
    }
  }, [client]);

  useEffect(() => {
    const storedPropertiesString = localStorage?.getItem("SelectedPropertiesDropdown");
    const storedPropertiesArray = JSON.parse(storedPropertiesString || "[]");
    const listings = storedPropertiesArray?.map((items) => items?.listing) || [];
    setListingState(listings);
  }, []);

  const [searchClientLogs, setSearchClientLogs] = useState("");

  const handleSendOfferNow = () => {
    console.log("Selected properties: ", selectedProperties);
    //load the selected ids to memory 
    if (selectedProperties.length > 0) {
      setIsShareSelectionModalOpen(true);
    } else {
      alert("Please select at least one property.");
    }
  };

  const handleCheckboxChange = (propertyId) => {
    console.log('oapapap');
    setSelectedProperties((prevState) => {
      const updatedProperties = prevState.includes(propertyId)
        ? prevState.filter((id) => id !== propertyId)
        : [...prevState, propertyId];
      dispatch(propertyActions.loadIds(updatedProperties)); // Dispatch the action with updated properties
      return updatedProperties;
    });
  };

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
    const clientLogsResponse = await userRequest.get(`/client-log/getAllLogs`, {
      params: {
        client_id: client.client_id,
        limit: constants.PAGING_CLIENT_SIZE,
        skip: clientPagingFrom - 1,
      },
    });
    const fetchedPropertyIds = clientLogsResponse.data.clientsLogs?.map((item) => item?.property_id) || [];
    setPropertyIds(fetchedPropertyIds);
    clientLogs.totalLogs = clientLogsResponse.data.totalLogs;
    setClientLogs(clientLogsResponse.data.clientsLogs);
    setFilterClientLogs(clientLogsResponse.data.clientsLogs);
  };

  useEffect(() => {
    getAllClientLogs();
  }, [isRefresh]);

  const filter_ids = JSON.stringify([
    { field: "ids", operator: "$in", value: propertyIds },
  ]);

  const params = {
    filters: filter_ids,
    limit: 1,
    skip: 0,
  };

  const queryString = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

  const trianglLuxuryApi = (data) => {
    const token2 =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImlzc3VlZCI6IjE2NzUxMTI3NDYxMzYiLCJleHAiOjE2NzUxMTI4MDYsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6ImVmNzY1MDIyLTZhNzctNGZkMy04Njg1LTFhZTFhZmEzOTJhZSIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.N9MIeiLyrT3hBUtMJsTvwbYW5Z_o7ZSBuZmir2ytrb8DiE4MoXcmh8C6KriWhmnRqUnSMBRtuLcauVbqjFTorOcWMOd2RQGmisPgXBm1tHT30Hl0i57rQuLZHAVW201ot-TdQwW9oEZ3n2HTGu_A6tRhTizVmG6NRAd5KhOB2_c";
    const headersForupdate = {
      Authorization: `Bearer ${token2}`,
    };

    return axios
      .get(constants.SHUB_URL+'/local/listings?'+queryString, {
        headers: headersForupdate,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error in API request:", error);
      });
  };

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

  const renderSpecialCollections = (row) => {
    const specialCollection = localStorage?.getItem("collections");
    const renderIcons = [];

    if (specialCollection?.includes("familyCollection")) {
      renderIcons.push(
        <img
          key="family"
          src={specialFamilies}
          style={{ marginRight: "5px", width: "25px" }}
        />
      );
    }

    if (specialCollection?.includes("petsCollection")) {
      renderIcons.push(
        <img src={dogsIcon} style={{ marginRight: "5px", width: "45px" }} />
      );
    }

    if (specialCollection?.includes("eco friendly")) {
      renderIcons.push(
        <img src={greenIcon} style={{ marginRight: "5px", width: "20px" }} />
      );
    }

    if (specialCollection?.includes("eventCollection")) {
      renderIcons.push(
        <img
          src={specialEvents}
          style={{ marginRight: "5px", width: "25px" }}
        />
      );
    }
    if (renderIcons.length > 0) {
      return <div>{renderIcons}</div>;
    } else {
      // Default case if no special collection is found
    }
  };

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

  const renderCheckRow = (row) => {
    return (
      <div className="saved-search-datagrid-property">
        <input
          type="checkbox"
          style={{ marginRight: "15px", width: "20px" }}
          onChange={() => handleCheckboxChange(row.property_id)}
        />
      </div>
    );
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
      width: "250px",
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
          {row?.propertyName}
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
  ];

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

  const sortedLogs = filterClientLogs.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  const extractedInfo = [];

  var arr = [];
  const handleCheckbox = (value) => {
    const index = arr.indexOf(value);

    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      arr.push(value);
    }
    console.log([...arr], "sdusdusdusnd");
  };

  const test = (propertyId) => {
    history.push(`/property/${propertyId}`);
  };

  const tableData = (item) => {
    return item ? (
      <div className="table-responsive">
        <table className="table text-start">
          <thead>
            <tr>
              {columns?.map((item, index) => {
                if (item.name !== "Booked") {
                  return (
                    <th key={index} scope="col">
                      {item.name} <BsChevronDown />
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {item?.clientLogs?.map((log, logIndex) => {
              if(log.savedSearch) {
                let propertyIds = JSON.parse(log.property_id);
                console.log(propertyIds)
                return (
                  <>
                    {propertyIds.map((propertyId, idx) => (
                      <tr key={`${logIndex}-${idx}`}>
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
                          <div className="id-btn" onClick={() => test(propertyId)}>
                            {propertyId ? propertyId : "-"}
                          </div>
                        </td>
                        <td style={{ flexDirection: "row" }}>
                          <div style={{ display: "flex" }}>
                            {log.listings.length > 0 ? (
                              <>
                                {log.listings.map((tags, index) => (
                                  <React.Fragment key={index}>
                                    {renderCollectionIcon(
                                      tags?.tags,
                                      "familyCollection",
                                      familyIcon
                                    )}
                                    {renderCollectionIcon(
                                      tags?.tags,
                                      "petsCollection",
                                      petsIcon
                                    )}
                                    {renderCollectionIcon(
                                      tags?.tags,
                                      "eventCollection",
                                      eventsIcon
                                    )}
                                    {renderCollectionIcon(
                                      tags?.tags,
                                      "sustainCollection",
                                      sustainIcon
                                    )}
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              " - "
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            color: "#036ae1",
                            textDecoration: "underline",
                            textDecorationColor: "#036ae1",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="id-btn" onClick={() => test(propertyId)}>
                            {log.listings[idx]?.title
                              ? log.listings[idx]?.title
                              : "-"}
                          </div>
                        </td>
                        <td>
                          {log.destination !== null ? log.destination : "-"}
                        </td>
                      </tr>
                    ))}
                  </>
                );
              }
              // let propertyIds = [];
              // console.log('log',log)
              // if (log.property_id?.startsWith('[') && log.property_id?.endsWith(']')) {
              //   // Attempt to parse as JSON array
              //   try {
              //     propertyIds = JSON.parse(log.property_id.replace(/'/g, '"'));
              //   } catch (error) {
              //     console.error("Error parsing property_id as array:", error);
              //     propertyIds = [];
              //   }
              // } else {
              //   // Handle as single value
              //   propertyIds = [log.property_id];

              // }
  
              // if (!log?.listings || log?.listings?.length === 0) {
              //   return null;
              // }
  
              
            })}
          </tbody>
        </table>
      </div>
    ) : (
      "No data available"
    );
  };
  

  const guestCount = (adult, children) => {
    if (adult !== undefined && children !== undefined) {
      return `${adult + children} guests (${adult} adults, ${children} children)`;
    } else if (adult !== undefined) {
      return `${adult} guests`;
    } else if (children !== undefined) {
      return `${children} guests`;
    } else {
      return "0 guests";
    }
  };

  const formatedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const openShareSelectionModal = () => {
    console.log('load ids:',selectedProperties)
    if (selectedProperties.length > 0) {
      dispatch(propertyActions.loadIds(selectedProperties))
        //localStorage.setItem('selectedPropertiesItem',selectedPropertiesData);
      //load properties to memory here
      setIsShareSelectionModalOpen(true);
    } else {
      alert("Please select at least one property.");
    }
    
  };

  const closeShareSelectionModal = () => {
    setIsShareSelectionModalOpen(false);
  };

  const totalSelectedPropertiesItem = selectedProperties.length;

  return (
    <div className="popup-wrapper">
      <div className="modal modal-body" tabIndex="-1" style={{ marginTop: "-15px", overflowY: "auto" }}>
        <div className={`modal-dialog modal-dialog-centered ${modalSize}`}>
          <div className="modal-content saved-search-client">
            <div className="modal-header">
              <h4 className="page-title text-center pt-2 mobile-header" style={{ marginLeft: "auto" }}>
                Saved Search Multiple Log
                <span style={{ color: "#165093" }} className="mx-1">
                  {client.firstName + " " + client.lastName||''}
                </span>
              </h4>
              <button
                type="button"
                style={{ marginTop: "-47px", padding: "initial" }}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={props.onClose}
              ></button>
            </div>

            <div className="modal-body" style={{ marginTop: "-15px" }}>
              <div className="row p-3" style={{ backgroundColor: "#f5f5f2" }}>
                <div className="col-md-4 col-12 mb-2 px-2">
                  <div className="saved-search-header-title">Nick Name</div>
                  <input type="text" className="form-control" value={client?.nickName} readOnly />
                </div>

                <div className="col-md-4 col-12 mb-2 px-2">
                  <div className="saved-search-header-title">Email Address</div>
                  <input type="text" className="form-control" value={client?.email} readOnly />
                </div>

                <div className="col-md-4 col-12 mb-2 px-2">
                  <div className="saved-search-header-title">Phone No</div>
                  <input type="text" className="form-control" value={client?.phone} readOnly />
                </div>
              </div>

              <div className="d-flex data-structer">
                <div className="mobile-ui-width" style={{ width: "74%" }}>
                  {loading ? (
                    <h3 className="modal-center">Loading...</h3>
                  ) : hasData ? (
                    <>
                      {filterClientLogs
                        ?.sort((a, b) => {
                          const dateA = new Date(
                            a?._id.split(".").reverse().join("-")
                          );
                          const dateB = new Date(
                            b?._id.split(".").reverse().join("-")
                          );
                          return dateB - dateA;
                        })
                        ?.map((item, i) => {
                          const formatDate = (date) => {
                            const d = new Date(date);
                            const day = d.getDate().toString().padStart(2, "0");
                            const month = (d.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = d.getFullYear();
                            return `${day}.${month}.${year}`;
                          };
                          if(item?.clientLogs.filter((log) => log.savedSearch && JSON.parse(log.property_id).length).length) {
                            return (
                              <div className="" key={i}>
                                <h5 className="page-title pt-4">
                                  {formatDate(item?._id)}
                                </h5>
                                <hr style={{ borderWidth: "3px" }} />
                                <div className="d-flex justify-content-between travel-section mt-2 mb-2 px-2">
                                  <div className="travel-details">
                                    <span className="title">
                                      Travel Details |
                                    </span>
                                  </div>
                                  <div className="travel-date">
                                    <span className="title">Date: </span>
                                    <span className="title-value">
                                      {" "}
                                      {formatedDate(
                                        item?.clientLogs?.[0]?.createdAt
                                      )}
                                    </span>
                                  </div>
                                  <div className="travel-number-of-guests">
                                    <span className="title">
                                      Number of guests:
                                    </span>
                                    <span className="title-value">
                                      {" "}
                                      {guestCount(
                                        item?.clientLogs?.[0]?.adults,
                                        item?.clientLogs?.[0]?.children
                                      )}
                                    </span>
                                  </div>
                                  <div className="travel-budget">
                                    <span className="title">Budget:</span>
                                    <span className="title-value">
                                      {" "}
                                      {/* {item?.clientLogs?.[0]?.PriceFilter?.substring(
                                        2,
                                        item?.clientLogs?.[0]?.PriceFilter
                                          ?.length - 2
                                      )} */}
                                    </span>
                                  </div>
                                  <div className="travel-destination">
                                    <span className="title">Destination:</span>
                                    <span className="title-value">
                                      {" "}
                                      {item?.clientLogs?.[0]?.destination}
                                    </span>
                                  </div>
                                  <div className="travel-notes">
                                    Note&nbsp;&nbsp;
                                    <img src={notesIcon} alt='note Icon'/>
                                  </div>
                                </div>
                                <hr style={{ borderWidth: "2px" }} />
                                {tableData(item)}
                              </div>
                            );
                          }
                          
                        })}
                    </>
                  ) : (
                    <h3 className="modal-center">No offer is available.</h3>
                  )}
                </div>
                {loading ? (
                  <h3 className="modal-center">Loading...</h3>
                ) : (
                  <div
                    className=""
                    style={{ marginLeft: "12px", marginRight: "-11px" }}
                  >
                    <div className="row py-5">
                      <div className="col-md-12 mobile-action">
                        <h5 className="action-title pb-2">Action Needed:</h5>
                        <div className="d-flex flex-column gap-3">
                          <BlueWhiteButton
                            className="coustome-button clientSavedLog"
                            icon={shareSelectionOn}
                            iconOn={shareSelection}
                            label="Share as PDFs to the client"
                            onClick={() => openShareSelectionModal()}
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
                          {showShareAsLink && (<BlueWhiteButton
                            className="coustome-button clientSavedLog"
                            icon={linkOn}
                            iconOn={link}
                            label="Share as link for the client"
                            onClick={() => setShowShareAsLink(true)}
                          />)}
                          {showShareAsLink && (
                            <ShareSelectionPopup
                              title="Share selection as a link for the client"
                              icon={link}
                              agent={agent}
                              agency={agency}
                              onClose={() => setShowShareAsLink(false)}
                              selectedProperties={selectedProperties}
                              totalSelectedPropertiesItem={totalSelectedPropertiesItem}
                              link={true}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <Button
                  style={{ fontSize: "15px", marginRight: "30px" }}
                  variant="link"
                  text="Cancel"
                  onClick={onClose}
                />
                <Button
                  style={{ fontSize: "15px" }}
                  text="Send offer now"
                  onClick={handleSendOfferNow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSavedSearch;
