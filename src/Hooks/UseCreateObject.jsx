import countryList from "../Util/data/countries.json";

export const countryCode = (country) => {
  const ccIndex = countryList.findIndex((i) => i.name === country);
  const cc = ccIndex ? countryList[ccIndex]?.code : "";
  //console.log("countryCode=", cc);
  return cc;
};

export const UseCreateObject = (props,xdata) => {
  if (props === undefined) {
    return "props undefined!";
  } else {
    return {
        count: props?.count ? props.count : 1,
        id: props?._id ? props._id : "64e2e67587b042004a4e1338",
        nickName: props?.nickname || "",
        name: props?.title || "",
        roomType: props?.roomType || "",
        bedrooms: props?.bedrooms || 0,
        bedType: props?.bedType || "",
        houseRules: props?.houseRules || "",
        bathrooms: props?.bathrooms || 0,
        beds: props?.beds || 0,
        filename:xdata?.pictures? 
        xdata.pictures[0].thumbnail ||
            xdata.pictures[0].filename ||
            xdata.pictures[0].original ||
            xdata.pictures[0].large  :
            props?.picture?.thumbnail ||
            props?.filename ||
            props?.original ||
            props?.large ||
            "",
        photos: xdata?.pictures||props?.pictures,
        countryCode:
            props?.address?.countryCode || countryCode(props?.address?.country) || props?.listing?.address?.zipcode,
        countryName: props?.address?.country || props?.listing?.address?.country || "",
        city: props?.address?.city || props?.listing?.address?.city || "",
        state: props?.address?.state || props?.listing?.address?.state || "",
        region: props?.address?.region || props?.listing?.address?.region || '',
        subRegion: props?.address?.subRegion || props?.listing?.address?.subRegion || '',
        street: props?.address?.street || props?.listing?.address?.street || "",
        fullAddress: props?.address?.full || props?.listing?.address?.full || "",
        lat: props?.address?.lat + 0.0018,
        lng: props?.address?.lng + 0.0018,
        currency: props?.prices?.currency || props?.listing?.prices?.currency || "",
        basePrice: props?.prices?.basePrice + " " + props?.prices?.currency || props?.listing?.prices?.currency || "",
        basePriceUSD: props?.prices?.basePriceUSD
            ? props?.prices?.basePriceUSD + "$"
            : "" || props?.listing?.prices?.basePriceUSD || "",
        weekendPrice: props?.prices?.basePrice + " " + props?.prices?.currency || props?.listing?.prices?.currency || "",
        interactionWithGuests:
            props?.publicDescription?.interactionWithGuests || props?.listing?.publicDescription?.interactionWithGuests || "",
        neighborhood: props?.publicDescription?.neighborhood || props?.listing?.publicDescription?.neighborhood || "",
        notes: props?.publicDescription?.notes || props?.listing?.publicDescription?.notes || "",
        space: props?.publicDescription?.space || props?.listing?.publicDescription?.space || "",
        summary: props?.publicDescription?.summary || props?.listing?.publicDescription?.summary || "",
        transit: props?.publicDescription?.transit || props?.listing?.publicDescription?.transit || "",
        searchable: props?.address?.searchable || props?.listing?.address?.searchable || "",
        propertyCurrency: props?.prices?.currency || props?.listing?.prices?.currency || "$USD",
        propertyType: props?.propertyType || props?.listing?.propertyType || "",
        type: props?.type || props?.listing?.type || "",
        activate: props?.active === true ? 1 : 0 || props?.listing?.active === true ? 1 : 0 || "",
        created_at: props?.createdAt || props?.listing?.createdAt || "",
        lastActivityAt: props?.lastActivityAt || props?.listing?.lastActivityAt || "",
        lastSyncedAt: props?.lastSyncedAt || props?.listing?.lastSyncedAt || "",
        lastUpdatedAt: props?.lastUpdatedAt || props?.listing?.lastUpdatedAt || "",
        cleaningFee: props?.prices?.cleaningFee || props?.listing?.prices?.cleaningFee || "",
        extraPersonFee: props?.prices?.extraPersonFee || props?.listing?.prices?.extraPersonFee || "",
        guestsIncludedInRegularFee: props?.prices?.guestsIncludedInRegularFee || props?.listing?.prices?.guestsIncludedInRegularFee || "",
        monthlyPriceFactor: props?.prices?.monthlyPriceFactor || props?.listing?.prices?.monthlyPriceFactor || "",
        weeklyPriceFactor: props?.prices?.weeklyPriceFactor || props?.listing?.prices?.weeklyPriceFactor || "",
        allowsChildren:
            props?.houseRules?.childrenRules?.suitableForChildren?.enabled || props?.listing?.houseRules?.childrenRules?.suitableForChildren?.enabled || "",
        allowsEvents: props?.houseRules?.suitableForEvents?.enabled || props?.listing?.houseRules?.suitableForEvents?.enabled || "",
        allowsInfants:
            props?.houseRules?.childrenRules?.suitableForInfants?.enabled || props?.listing?.houseRules?.childrenRules?.suitableForInfants?.enabled || "",
        allowsPets: props?.houseRules?.petsAllowed?.enable || props?.listing?.houseRules?.petsAllowed?.enable || "",
        allowsSmoking:
            props?.houseRules?.smokingAllowed?.enabled || props?.listing?.houseRules?.smokingAllowed?.enabled || "",
        amenities:
            props?.amenities?.length > 1
                ? props?.amenities?.map((item) => item).join(",")
                : props?.listing?.amenities?.length > 1
                ? props?.listing?.amenities?.map((item) => item).join(",")
                : "",
        tags:
            props?.tags?.length > 1
                ? props?.tags?.map((item) => item).join(",")
                : props?.tags?.length === 1
                    ? props?.tags[0]
                    : props?.listing?.tags?.length > 1
                    ? props?.listing?.tags?.map((item) => item).join(",")
                    : props?.listing?.tags?.length === 1
                    ? props?.listing?.tags[0]
                    : "",
        amenitiesNotIncluded:
            props?.amenitiesNotIncluded !== null && props?.amenitiesNotIncluded !== undefined && props?.amenitiesNotIncluded?.length > 1
                ? props?.amenitiesNotIncluded?.map((item) => item).join(",")
                : props?.listing?.amenitiesNotIncluded !== null && props?.listing?.amenitiesNotIncluded !== undefined && props?.listing?.amenitiesNotIncluded?.length > 1
                ? props?.listing?.amenitiesNotIncluded?.map((item) => item).join(",")
                : "",
        rooms: props?.listingRooms || props?.listing?.listingRooms || "",
        accommodates: props?.accommodates || props?.listing?.accommodates || "",
    };
}
};

export default UseCreateObject;
