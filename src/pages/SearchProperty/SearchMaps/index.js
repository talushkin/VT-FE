import React, {useState, useCallback, memo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, OverlayView } from '@react-google-maps/api';
import './searchmaps.css';

const MapContainer = ({properties}) => {
  
  
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDJZiBl3NStDg82QA7I1t4La0Dqnwj7cb0',
        libraries: ['places']
    })

    const [map, setMap] = useState(null)
    const [activeMarker, setActiveMarker] = useState(null);
    const tooltipRef = useRef(null);
 

    const [mapcenter] = useState(
        properties?.listings?.[0]?.xdata 
        ? { lat: properties.listings[0].xdata.lat, lng: properties.listings[0].xdata.lng }
        : { lat: 40.7128, lng: -74.0060 }
    );

    const propertymarkers = properties?.listings?.map((property, index) => ({
        id: index + 1,
        position: { lat: property.xdata.lat, lng: property.xdata.lng },
        title: property.listing.title,
        image: property.listing.picture.thumbnail
    })) || [];

    const CustomTooltip = ({ position, title, image }) => (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div className="info-window" ref={tooltipRef} style={{transform: 'translateY(-100%)', marginTop: '-20px'}}>
                <div style={{textAlign: 'right'}}>
                    <button className="close-btn" onClick={() => setActiveMarker(null)}>
                        ×
                    </button>
                </div>
                <div>
                    <h4>{title}</h4>
                    <img src={image} alt={title} className="info-image" />
                </div>
            </div>
        </OverlayView>
    );

    const onLoad = useCallback((map) => {
        if (!propertymarkers.length) return;

        const bounds = new window.google.maps.LatLngBounds();
        propertymarkers.forEach(marker => bounds.extend(marker.position));
        map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });

        setMap(map);
    }, [propertymarkers]);

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])
  
    return isLoaded && propertymarkers.length > 0 ? (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "600px" }}
            center={mapcenter}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                mapTypeId: "terrain",
                mapTypeControl: false,
                zoomControl: true,
                fullscreenControl: false,
                rotateControl: false,
                streetViewControl: false,
            }}
        >
        
            {
                propertymarkers.map((marker) => (
                    <MarkerF 
                        key={marker.id}
                        position={marker.position}
                        onMouseOver={() => setActiveMarker(marker.id)}
                        // onMouseOut={() => setActiveMarker(null)}
                        // onClick={() => setActiveMarker(marker.id)}
                    >
                        {
                            activeMarker  === marker.id && (
                                <CustomTooltip
                                    position={marker.position}
                                    title={marker.title}
                                    image={marker.image}
                                />
                            )
                        }
                        
                    </MarkerF>
                ))
            }
        </GoogleMap>
    ) : (
        <></>
    )
};

export default memo(MapContainer);