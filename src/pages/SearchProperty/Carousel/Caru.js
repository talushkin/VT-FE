import React from "react";
import "./Caru.css";
import Carousel from "./Carousel";
const images = [
  "https://smilinghouse.ch/wp-content/uploads/2024/06/bk_pool.png",
  "https://smilinghouse.ch/wp-content/uploads/2024/06/bk_poolhouse.png",
  "https://smilinghouse.ch/wp-content/uploads/2024/06/bk_poolsun-1.png",
];
function Caru() {
  return (
        <Carousel images={images} />
  );
}
export default Caru;
