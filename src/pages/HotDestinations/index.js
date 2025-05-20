import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import hotBg from '../../assets/hot-destination.png'
import Heart from "../../assets/icons/like-full.png";
import showHotDestinations from "../../assets/btn-show-hot-destinations.png";
import favorite from '../../assets/icons/favorite.png';
import './HotDestinations.scss';
import AuthService from "../../services/auth.service";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
const parser = new DOMParser();
const HotDestinations = props => {
    const { agency, agent } = props
    const history = useHistory()
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [selectedData, setselectedData] = useState(null);
    const [hotdesinationsData, sethotdesinationsData] = useState([])
    const [toogle, settoogle] = useState(true)
    const [checkId, setcheckId] = useState("")
    const [showFullContent, setShowFullContent] = useState(false);
    const [displayCount, setDisplayCount] = useState(9);
    const MAX_DISPLAY_LINES = 3;

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };
    const getDescriptionPreview = () => {
        return selectedData?.description;
    };

    const getParagraphs = () => {
        const description = getDescriptionPreview();
        const div = document.createElement('div');
        div.innerHTML = description;
        const paragraphs = Array.from(div.getElementsByTagName('p')).map((p) => p.innerText);
        return paragraphs;
    };

    const displayContent = () => {
        const paragraphs = getParagraphs();
        if (showFullContent) {
            return paragraphs.join('\n');
        } else {
            return paragraphs.slice(0, MAX_DISPLAY_LINES).join('\n');
        }
    };

    useEffect(() => {
        setTimeout(() => {
            AuthService.getHotDesinationsApi().then((response) => {
                if (response) {
                    var teamp = response.HotDestinations.sort((a, b) => b.likes - a.likes)
                    sethotdesinationsData(teamp)
                }
            }).catch((e) => {
                console.log(e)
            })
        }, 1000);
    }, [toogle])


    const clearSelection = () => {
        window.scrollTo(0, 0);
        setSelectedDestination(null);
    };

    const selectDestination = (iteam) => {
        console.log(iteam, "iteam")
        setSelectedDestination(iteam.destination);
        setselectedData(iteam)
        window.scrollTo(0, 0);
    };

    const parseHtml = (html) => {
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.getElementsByTagName("BODY")[0].innerText;
        console.log(body);
        return body
    }

    const handleSeeAllClick = () => {
        setDisplayCount(hotdesinationsData.length);
    };

    const goToSearch = () => {
        localStorage.setItem('destination', selectedData.destination);
        history.push(`/search?destination=${selectedData.destination}`);
    };

    const renderDestination = (i) => {
        return (
            <div className="hot-destination-selected  px-5 w-100">
                <div className="hot-destinations-selected-top">
                    <div className="hot-destinations-selected-top-left">
                    <span className="number_big" style={{ fontSize: '75px' }} >{i + 1} </span> <span style={{marginLeft: '10px', fontSize: '25px', color: 'rgba(44, 72, 97, 0.3490196078)'}}>/</span> <div className="hot-destinations-selected-top-number" style={{marginLeft: '13px'}}><h1 style={{fontFamily: 'Quicksand'}}>{selectedData.destination}, {selectedData.country}</h1></div>
                        {/* <div className="hot-destinations-selected-top-location"><span style={{ color: '#2C486159', padding: '0 5px' }}>/</span>{selectedData.country}, {selectedData.countryCode}</div> */}
                    </div>
                    <div className="hot-destinations-selected-top-right" style={{marginTop: 'auto'}}>
                        <span style={{ color: '#2C4861', fontSize: '25px', fontWeight: 'bold' }}> {selectedData.likes}&nbsp;</span>
                        <img src={Heart} alt="" style={{ width: '50px' }} />
                    </div>
                </div>
                <div className="hot-destinations-selected-hr"style={{marginLeft: '42px', borderBottom: '1px solid rgba(44, 72, 97, 0.3490196078)'}} />
                <div className="hot-destinations-selected-text">
                    <div>
                        <div style={{marginLeft: '40px', whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{ __html: displayContent() }} />
                        {getParagraphs().length > MAX_DISPLAY_LINES && (
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end',marginRight: '5px' }}>
                                <button
                                    style={{
                                        backgroundColor: '#F7F8F8',
                                        color: '#046AE1',
                                        textDecoration: 'underline',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={toggleContent}
                                >
                                    {showFullContent ? 'Show Less' : 'Read More'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <img src={selectedData.image_url} alt="" style={{ width: '100%', cursor: 'pointer' }} onClick={goToSearch}/>
                <div className="mt-3 mb-3 float-end">
                    <button className="btn btn-primary" style={{ backgroundColor: '#165093', height: '50px', width: '100%', height: '50px', padding: '15px', paddingBottom: '50px' }} onClick={() => clearSelection(null)}>Check More Hot Destinations</button>
                </div>
            </div>
        )
    };
    const renderDestinationBox = (iteam, i) => {
        return (
            <div key={i} className="row hot-destination-selected px-2" >

                <div className="hot-destinations-selected-top" style={{marginLeft: '12px', marginBottom: '-20px', marginTop:'-35px'}}>
                    <div className="hot-destinations-selected-top-left" style={{marginLeft: '12px'}}>
                        <span className="number_big" style={{ fontSize: '45px' }} >{i + 1} </span><span style={{marginLeft: '10px', fontSize: '25px', color: 'rgba(44, 72, 97, 0.3490196078)'}}>/</span> <span className="hot-destinations-selected-top-location">{iteam.destination}</span>
                    </div>
                    <div className="hot-destinations-selected-top-right" style={{marginBottom: '-15px'}}>
                        <div style={{ fontSize: '32px', fontWeight: '', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }} >
                            {iteam.likes + "   "}
                            <img src={Heart} className="img-fluid" alt="favorite" style={{ width: "40px", height: '32px', marginLeft: '10px' }} />
                        </div>
                    </div>
                </div>
                <div
                    className="hot-box-container"
                    onClick={() => selectDestination(iteam)}
                    style={{
                        backgroundImage: `url(${iteam.image_url})`,
                        backgroundSize: "cover",
                        backgroundPositionY: "center",
                        height: "250px",
                        width: "100%",
                        cursor: "pointer",
                        alignItems: "center",
                        marginLeft: '10px'
                    }}
                />
            </div >
        )
    };

    return (
        <div className="hot-destinations-container fluid-container">
            <PageHeader agent={agent} agency={agency} searchOpen={null} bgColor="transparent" topBgColor="#16395C" />
            <div className="hot-destinations-body d-flex">
                <div className="hot-destinations-main">
                    <h1 className="pt-4 text-center" style={{ fontSize: "38px", color: "#304B64" }}>Hot Destinations &nbsp;<span style={{ color: '#0BE70B' }}>~2025~</span></h1>

                    <div className="hot-destinations-subtitle text-center mb-3" >
                        The most luxurious destinations for vacation rentals across the globe. We’ve handpicked these <br />
                        locations and curated an insightful summary for each one - for your inspiration.
                    </div>

                    {/* {selectedDestination ?
                        renderDestination() :
                        <div className="hot-destinations-content p-4">
                            {hotdesinationsData?.map((d, i) => renderDestinationBox(d, i))}
                        </div>
                    } */}
                    {selectedDestination
                        ? renderDestination(0)
                        : (
                            <div className="hot-destinations-content p-4">
                                {hotdesinationsData.slice(0, displayCount).map((d, i) => renderDestinationBox(d, i))}
                                {hotdesinationsData.length > 9 && displayCount < hotdesinationsData.length && (
                                    <button onClick={handleSeeAllClick} className="hot-destinations-content p-4" style={{ fontSize: "38px", color: "#304B64", fontWeight: 'bold' }}>View more..</button>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default HotDestinations;
