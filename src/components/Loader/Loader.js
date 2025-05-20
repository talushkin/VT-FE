import React from "react";
import "./loader.css";
import { Triangle } from "react-loader-spinner";

const Loader = ({loading,title}) => {
  return (
    <div className="loader">
      <Triangle
        height="500"
        width="500"
        color="#d3f4ff"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClassName="loader"
        visible={loading}
      />
      <br />
      <h1>{title}</h1>
    </div>
  );
};

export default Loader;
