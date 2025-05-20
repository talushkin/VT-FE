import React from "react";
import Button from "../../../components/Buttons/Button/Button";
import deleteTitleIcon from "../../../assets/icons/admin/delete-title-icon.svg";
import "./DeleteAgency.scss";

const DeleteAgency = (props) => {
  const { agency, onCancel, onClose, agencyData, onHardDelete } = props;
  return (
    <div className="delete-agency-container">
      <div className="delete-agency-header">
        <img style={{ marginTop: "-8px" }} src={deleteTitleIcon} alt="" />
        <div className="delete-title">
          <h4 className="delete-agency-title">Delete Agency</h4>
          <h5>{agencyData?.agencyDetails[0].agencyName}</h5>
        </div>
      </div>
	
      <div className="delete-agency-main">
        Are you sure you want to delete this relation?
      </div>
	  <div className="hard-delete">
	  <Button
          style={{ fontSize: "18px", padding: "0 31px" }}
          text="Hard Delete"
          onClick={onHardDelete}
        />
		</div>
      <div className="delete-agency-footer">
        <Button
          style={{ fontSize: "18px", marginRight: "30px" }}
          variant="link"
          text="Cancel"
          onClick={onCancel}
        />
        <Button
          style={{ fontSize: "18px" }}
          text="Delete Agency"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default DeleteAgency;
