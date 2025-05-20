import { useEffect, useState } from "react";
import axios from "axios";

export const getHouseRules = (props) => {

  const {
    property
  } = props;

  function processHouseRules() {
    let rulesArray = []
    if (property?.houseRules?.childrenRules?.suitableForChildren === false) {
      rulesArray.push("Children Not Allowed");
    } else if (property?.houseRules?.childrenRules?.suitableForChildren === true) {
      rulesArray.push("Suitable for Children");
    }

    if (property.houseRules?.childrenRules?.suitableForInfants === false) {
      rulesArray.push("Infants Not Allowed");
    } else if (property?.houseRules?.childrenRules?.suitableForInfants === true) {
      rulesArray.push("Suitable for Infants");
    }

    if (property.houseRules?.petsAllowed?.enabled === false) {
      rulesArray.push("Pets Not Allowed");
    } else if (property?.houseRules?.petsAllowed?.enabled === true) {
      rulesArray.push("Pets Allowed");
      rulesArray.push("Pets Has a Charge");
    }

    if (property?.houseRules?.quietBetween?.enabled === false) {
      rulesArray.push("No Quiet Hours");
    } else if (property?.houseRules?.quietBetween?.enabled === true) {
      const { start, end } = property?.houseRules?.quietBetween?.hours;
      rulesArray.push(`Quiet Hours: ${start}(start) - ${end}(end)`);
    }

    if (property?.houseRules?.smokingAllowed?.enabled === false) {
      rulesArray.push("Smoking Not Allowed");
    } else if (property?.houseRules?.smokingAllowed?.enabled === true) {
      rulesArray.push("Smoking Allowed");
    }

    if (property?.houseRules?.suitableForEvents?.enabled === false) {
      rulesArray.push("Events Not Allowed");
    } else if (property?.houseRules?.suitableForEvents?.enabled === true) {
      rulesArray.push("Events Permitted");
    }

    if (property?.houseRules?.additionalRules) {
      rulesArray.push(property?.houseRules?.additionalRules);
    }
    return rulesArray
  }

  localStorage.setItem("rulesArray", JSON.stringify(processHouseRules()));
}

export default getHouseRules;
