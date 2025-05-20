import React, { useState } from "react";
import NameInput from "../Forms/Fields/NameInput/NameInput";
import Button from "../Buttons/Button/Button";
import Popup from "../Popup";

import "./AddToWishList.scss";

const AddToWishList = (props) => {
  const [destination, setDestination] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const { onClearSearch } = props;

  return (
    <div className="add-to-wishlist-container">
      <div className="add-to-wishlist-bg">
        <Popup
          width="800px"
          onClose={onClearSearch}
          style={{ backgroundColor: "transparent" }}
        >
          <div style={{ textAlign: "center" }}>
            <div className="add-to-wishlist-title">
              Add a destination to your wish list
            </div>

            <div style={{ padding: "20px 50px 50px 50px", color: "#707070" }}>
              <NameInput
                label="Destination"
                inputName="destination"
                placeholder={"Destination"}
                value={destination}
                setValue={setDestination}
              />

              <NameInput
                label="Customer Name*"
                inputName="customerName"
                placeholder={"Customer Name"}
                value={customerName}
                setValue={setCustomerName}
              />

              <NameInput
                label="Description"
                inputName="description"
                placeholder={"Description"}
                value={description}
                setValue={setDescription}
              />

              <div className="add-to-wishlist-footer">
                <Button
                  style={{ fontSize: "18px", marginRight: "30px" }}
                  variant="link"
                  text="Cancel"
                  onClick={onClearSearch}
                />
                <Button
                  style={{ fontSize: "18px" }}
                  text="Add to Wish List"
                  onClick={onClearSearch}
                />
              </div>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default AddToWishList;
