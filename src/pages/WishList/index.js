import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePickerArrival from "../../components/Forms/Fields/DatePickerArrival/DatePickerArrival";
import DatePickerDeparture from "../../components/Forms/Fields/DatePickerDeparture/DatePickerDeparture";
import pageBg from "../../assets/SigninPicNew_resize.png";
import notesIcon from "../../assets/notes.png";
import pagingLine from "../../assets/icons/paging-line.png";
import searchLogo from "../../assets/icons/search.png";
import Button from "../../components/Buttons/Button/Button";
import PageHeader from "../../components/PageHeader";
import * as propertyActions from "../../store/redux/Property/actions";
import constants from "../../Util/constants";
import LoadingBox from "../../components/LoadingBox";
import Datatable from "../../components/Datatable";
import { data } from "./data";

import "./WishList.scss";
import Row from "../../components/Row";
import AuthService from "../../services/auth.service";
import moment from "moment/moment";
import { Height } from "@mui/icons-material";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import Paging from "../../components/Paging";
import { baseURL } from "../../core";
import axios from "axios";
import { useHistory } from "react-router-dom";
import UploadOffers from "./uploadOffers";

const WishList = (props) => {
  const { agent, agency } = props;
  console.log(agent, agency)
  const [pageNumber, setPageNumber] = useState(0);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.property.isLoading);
  const wishListItems = useSelector((state) => state.property.wishListItems);
  const [showData, setData] = useState([]);
  const [sortedShowData, setSortedShowData] = useState(showData);
  const [sortColumn, setSortColumn] = useState('wishlistNumber');
  const [sortDirection, setSortDirection] = useState("ASC");
  const [totalWishlist, setTotalWishlist] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadoffers, setUploadOffers] = useState(false)
  const [selectedWishlist, setSelectedWishlist] = useState({})
  const wlPagingSize = 10; // Set the limit to 4

  // const userToken = localStorage.getItem('jToken');
  
  const doSearch = (pageNumber) => {
    //console.log("loading page ", pageNumber);
    // dispatch(propertyActions.loadProperties(pageNumber));
    getWishListLogs(pageNumber)
  };
  const history = useHistory();
  let WishListRequestLogPagingFrom = 1 + pageNumber * wlPagingSize;
  let WishListRequestLogPagingTo = (pageNumber + 1) * wlPagingSize;
  if (totalWishlist < WishListRequestLogPagingTo) {
    WishListRequestLogPagingTo = totalWishlist;
  }

  const onChangePage = (pageNumber) => {
    console.log("page=", pageNumber);
    setPageNumber(pageNumber);
    WishListRequestLogPagingFrom = 1 + pageNumber * wlPagingSize;
    WishListRequestLogPagingTo = (pageNumber + 1) * wlPagingSize;
    if (totalWishlist < WishListRequestLogPagingTo) {
      WishListRequestLogPagingTo = totalWishlist;
    }
    doSearch(pageNumber);
  };

  const onPrevPage = () => {
    const pn = pageNumber - 1;
    setPageNumber(pn);
    doSearch(pn);
  };

  const onNextPage = () => {
    const pn = pageNumber + 1;
    setPageNumber(pn);
    doSearch(pn);
  };

  const onGotoPage = (page) => {
    setPageNumber(page);
    doSearch(page);
  };

  const generatePaginationLinks = (currentPage, totalPages) => {
    let links = [];

    // Link to previous page
    if (currentPage > 1) {
      links.push(
        <div
          key={-1}
          className="wishlist-paging-prev-next"
          onClick={onPrevPage}
        >
          Prev
        </div>
      );
    }

    // Link to previous page
    if (currentPage > 3) {
      links.push(
        <div
          key={-2}
          className="wishlist-paging-prev-next"
          onClick={() => onGotoPage(0)}
        >
          1
        </div>
      );
      links.push(<div key={-3}>. . .</div>);
    }

    // Links to plus/minus 3 pages from current page
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      if (i === currentPage) {
        links.push(
          <div key={i} className="wishlist-paging-number-selected">
            {i}
          </div>
        );
      } else {
        links.push(
          <div
            key={i}
            className="wishlist-paging-number"
            onClick={() => onGotoPage(i - 1)}
          >
            {i}
          </div>
        );
      }
    }

    // Link to next page
    if (currentPage < totalPages) {
      links.push(
        <div
          key={-4}
          className="wishlist-paging-prev-next"
          onClick={onNextPage}
        >
          Next
        </div>
      );
    }

    return links;
  };

  const renderPaging = () => {
   
    return (
      <div
         
      >
        <div className="wishlist-main-title"> <h3 className="page-title  mb-4">Wish List Request Log</h3></div>
        {totalWishlist > 0 ?(
          <>
          <div className="wishlist-paging">  
            Displaying clients {WishListRequestLogPagingFrom}-{WishListRequestLogPagingTo} of {totalWishlist ? totalWishlist : "?"}         
          </div>
          {<Paging perPage={wlPagingSize} totalItems={totalWishlist} currentPage={pageNumber} onChangePage={onChangePage} />}
          </>
        ):"" }
          
         
        </div>
    );
  };

  const handleSorting = async (orderBy) => {
    const authToken = localStorage.getItem("jToken");
    const agent_id = localStorage.getItem("agent_id");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      // const agentData = JSON.parse(agent)
      // const agent_id = agentData?.agent_id;
      // ${baseURL}
      console.log('calling in handle sorting')
      const response = await axios.get(`${baseURL}/wishlist/get-wishlists/?agent_id=${agent_id}&agency_id=${agent?.agency_id}&agent_role=${agent?.role}&sortBy=${orderBy}&limit=${wlPagingSize}&skip=${pageNumber*wlPagingSize}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const goToProperty = (propertyId) => {
    history.push(`/property/${propertyId}`);
  };

  const columns = [
    // {
    //   id: "wishlistNumber",
    //   name: "#",
    //   selector: (row) => row.wishlistNumber,
    //   cell: (row) => row.wishlistNumber,
    //   width: "1fr",
    // },
    {
      id: "requestDate",
      name: "Request Date",
      selector: (row) => row.requestDate,
      cell: (row) => row.requestDate,
      width: "1fr",
    },
    {
      id: "agentname",
      name: "Agent Name",
      selector: (row) => row.property_id,
      cell: (row) => (
        <div
          className="text-primary text-decoration-underline"
          style={{ cursor: "pointer" }}
          onClick={() => goToProperty(row.property_id)}
        >
          {row.property_id ? row.property_id : "-"}
        </div>
      ),
      width: "1fr",
    },    
    {
      id: "agencyName",
      name: "Agency Name",
      sortable: true,
      selector: (row) => row.onDemand,
      cell: (row) => <div>{row.onDemand ? "Yes" : "No"}</div>,
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
      id: "clientName",
      name: "Client Name",
      sortable: true,
      selector: (row) => row.clientName,
      cell: (row) => (
        <div className="link18" onClick={() => {}}>
          {row.clientName}
        </div>
      ),
      width: "1fr",
    },
    {
      id: "arrive",
      name: "Arrive",
      sortable: true,
      selector: (row) => row.arrive,
      cell: (row) => row.arrive,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "1fr",
    },
    {
      id: "depart",
      name: "Depart",
      sortable: true,
      selector: (row) => row.depart,
      cell: (row) => row.depart,
      cellStyle: { display: "block", padding: "10px 0px" },
      width: "1fr",
    },
    {
      id: "guests",
      name: "Guests",
      sortable: true,
      selector: (row) => row.guests,
      cell: (row) => <div>{row.guests}</div>,
      width: "1fr",
    },
    {
      id: "bedroom",
      name: "Bed Rooms",
      sortable: true,
      selector: (row) => row.bedrooms,
      cell: (row) => <div>{row.bedrooms}</div>,
      width: "1fr",
    },
    {
      id: "priceRange",
      name: "Price Range",
      sortable: true,
      selector: (row) => row.priceRange,
      cell: (row) => <div>{row.priceRange}</div>,
      width: "1fr",
    },
    {
      id: "offer",
      name: "Villa tracker Offer",
      headerStyle: { color: "#1B9C5D" },
      sortable: true,
      selector: (row) => row.offer,
      cell: (row) => (
        <Row>
          <div>{row.offer} &nbsp;</div>
          <img src={notesIcon} alt="" style={{ cursor: "pointer" }} />
        </Row>
      ),
      width: "1fr",
    },
  ];

  const getWishListLogs = (pageNumber) => {
    AuthService.GetWishListLog(agent?.agent_id, agent?.agency_id, agent?.role, `${sortColumn}:${sortDirection}`, wlPagingSize, pageNumber*wlPagingSize)
      .then((response) => {
        setData(response.wishlists);  
        setSortedShowData(response.wishlists)      
        setTotalWishlist(response?.totalWishlist ?? 0);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getWishListLogs(pageNumber)
  }, []);

  useEffect(() => {
    const fetchSortedData = async () => {
      try {
        setLoading(true);
        // console.log('here')
        // console.log(sortDirection, sortColumn)
        const { wishlists, totalWishlist } = await handleSorting(`${sortColumn}:${sortDirection}`);
        console.log(wishlists)
        setData(wishlists); 
        setSortedShowData(wishlists);
        setTotalWishlist(totalWishlist);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSortedData();
  }, [sortDirection, sortColumn]);

  const handleSort = (column) => {
    console.log(sortColumn, column)
    if (sortColumn == column) {
      const orderBy = sortDirection === "DSC" ? "ASC" : "DSC";
      setSortDirection(orderBy);
      // return;
    } else {
      setSortColumn(column);
      const orderBy = sortDirection === "DSC" ? "ASC" : "DSC";
      setSortDirection("DSC");
      // return;
    }
  };

  const uploadpdf = (itm) => {
    // console.log(itm)
    setSelectedWishlist(itm)
    setUploadOffers(true)
  }

  const onCloseUploadOffers = () => {
    getWishListLogs(pageNumber)
    setSelectedWishlist({})
    setUploadOffers(false)
  }

	return (
		<div className="wishlists-container" style={{
      backgroundImage: `url(${pageBg})`,
      "background-size": "cover",
    }}>
  
  <div className="wishlists-header" style={{height:'174px', backgroundColor:'rgba(19, 59, 113, 0.8)'}}>
			<PageHeader   />
      {
        uploadoffers && (
          <UploadOffers
            title={`Upload Offers`}
            onClose={onCloseUploadOffers}
            wishlist={selectedWishlist}
            agent={agent}
            agency={agency}
          />
        )
      }
      </div>
			{/* <div className="wishlist-top-row row mt-2 pb-4 px-3">
				<div className="col-sm-2 m-2">
					<input type="text" className="wislist-search-input form-control form-control-lg" placeholder="Enter reservation ID" />
				</div>
        
				<div className="col-sm-2 m-2">
					<DatePickerArrival />
				</div>
				<div className="col-sm-2 m-2">
					<DatePickerDeparture />
				</div>
				<div className="col-sm-1 m-2">
					<Button
						onClick={() => doSearch(0)}					 
						icon={<img src={searchLogo} style={{ width: '22px', marginRight: '5px' }} alt="" />}
						fullwidth={true}
						variant="green"
						text="Search"
					/>
				</div>
			</div> */}

      {wishListItems != null && wishListItems.length === 0 ? (
        <div className="wishlist-results p-4" style={{ backgroundColor: "#FFF" }}>
          <LoadingBox visible={isLoading} />

          {wishListItems && renderPaging()}

          {/* <div className="table-responsive px-4">
							<Datatable
							leftPad='50px'
								//bodyHeight="calc(100vh - 160px)"
								data={showData}
								columns={columns}
								patchBgColor="#F5F5F2"
							/>
						</div> */}
          <div className="table-responsive">
            <table class="table">
              <thead className="bg-light sticky-top">
                <tr>
                  {columns?.map((iteam, index) => {
                    return (
                      <>
                        <th
                                              
                          onClick={() => handleSort(iteam.id)}
                          id={iteam.id}
                        >                           
                            {iteam.name}
                            {sortColumn == iteam.id ? (
                              // Display an arrow icon based on the sorting direction
                              sortDirection == "ASC" ? (
                                <BsChevronDown />
                              ) : (
                                <BsChevronUp />
                              )
                            ) : (
                              <BsChevronDown />
                            )}                         
                        </th>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                  {!loading &&
                    showData?.map((iteam, index) => {
                      return (
                        <tr key={index}>
                          {/* <td>{totalWishlist > 0 ? agent.role !== 'admin' ? iteam.wishlistNumber ? iteam.wishlistNumber : "-" : totalWishlist-(pageNumber*wlPagingSize) - index : '-'}</td> */}
                          <td>{iteam.requestDate ? iteam.requestDate : "-"}</td>
                          <td>
                            <div className="text-primary ">
                              {iteam.agentDetails ? `${iteam.agentDetails.firstName} ${iteam.agentDetails.lastName? iteam.agentDetails.lastName : ''}` : "-"}
                            </div>
                          </td>
                          <td>{iteam.agentDetails?.agencyName}</td>
                          <td>{iteam.destination !== "null" ? iteam.destination : "-"}</td>
                          <td className="text-primary">
                            {iteam.clientName && iteam.clientName !== "[object Object]"
                              ? iteam.clientName
                              : "-"}
                          </td>
                          <td>{iteam.arrive ? iteam.arrive : "-"}</td>
                          <td>{iteam.depart ? iteam.depart : "-"}</td>
                          <td>{iteam.guests ? iteam.guests : "-"}</td>
                          <td>
                            {iteam.bedroom && iteam.bedroom !== 0
                              ? `${iteam.bedroom} bedrooms`
                              : "-"}{" "}
                            {iteam.baths &&
                            iteam.baths !== undefined &&
                            iteam.baths !== 0
                              ? `, ${iteam.baths} baths`
                              : ""}
                          </td>
                          <td>{iteam.priceRange ? iteam.priceRange : "-"}</td>
                          <td>
                            <span onClick={()=> uploadpdf(iteam)}><CgFileDocument style={{ color: "#36a76f", fontSize: "26px" }} /></span>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>

            </table>
          </div>
        </div>
      ) : (
        <div className="wishlist-results" style={{ backgroundColor: "#FFF" }}>
          No results
        </div>
      )}
    </div>
  );
};

export default WishList;
