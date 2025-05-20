import React from "react";
import { useHistory } from "react-router-dom";
import "./Map.scss";

const Map = () => {
  const history = useHistory();
  const token = localStorage.getItem("jToken");
  const mapUrl = `https://interactive-map-tjxs.vercel.app?token=${encodeURIComponent(
    token
  )}`;
  window.addEventListener("message", (event) => {
    if (event.data.type === "markerClicked") {
      const singleVillas = {
        country: event.data.country,
        villa: event.data.villa,
        lat: event.data.lat,
        lng: event.data.lng,
      };
      const searchParams = new URLSearchParams(singleVillas).toString();
      history.push(`/search?${searchParams}`);
    }
  });

  return (
    <iframe
      title="Villa Tracker Map"
      className="iframe-map"
      src={mapUrl}
    ></iframe>
  );
};

export default Map;
