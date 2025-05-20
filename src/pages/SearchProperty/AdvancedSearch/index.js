import React, { useEffect, useState } from "react";
import "./AdvancedSearch.scss";
import AdvancedSearchFilter from "../../../components/AdvancedSearchFilter";
import Button from "../../../components/Buttons/Button/Button";

const AdvancedSearch = (props) => {
  const [modalSize, setModalSize] = useState("modal-xl");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1366) {
        setModalSize("modal-xl");
      } else {
        setModalSize("modal-lg");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updatePrices = (selectedPrice) => {
    props.updatePrices(selectedPrice);
  };

  const handleTypeChange = (selectedType) => {
    props.updateTypes(selectedType);
  };

  const handleMustHaveChange = (selectedMustHave) => {
    props.updateMusthave(selectedMustHave);
  };

  const handleAmenitiesChange = (selectedAmenities) => {
    props.updateAmenities(selectedAmenities);
  };

  const className =
    window.innerWidth > 1020
      ? "modal-wrapper"
      : `modal-dialog modal-dialog-centered  ${modalSize}`;

  return (
    <>
      <div class="modal" tabindex="-1">
        <div className={className}>
          <div class="modal-content">
            <button
              type="button"
              class="btn-close position-absolute bottom-0 end-0 m-1"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{top: '-12px', padding: 'revert-layer'}}
              onClick={props.onClose}
            ></button>
            <h4 class="text-dark-blue text-center mt-3" style={{fontSize: 'xx-large'}}>
              Advanced Search Options
            </h4>
            <h5 class="text-center   m-0">Choose multiple if desired</h5>
            <hr className="text-light-muted mt-3" />
            <div class="modal-body">
              <div className="row ">
                <div className="col-12 col-md-3 px-1 mb-2">
                  <AdvancedSearchFilter
                    title="Price($)"
                    items={props.priceItems}
                    selectedItems={props.selectedPrices}
                    onChange={updatePrices}
                    onReset={props.resetUpdatePrices}
                  />
                  <div className="advanced-property-filter-selected-items">
                    {props.selectedPrices.map((item, i) =>
                      props.renderSelectedItem(item, i, () =>
                        props.updatePrices(item)
                      )
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-3 px-1 mb-2">
                  <AdvancedSearchFilter
                    title="Type"
                    items={props.typeItems}
                    selectedItems={props.selectedTypes}
                    onChange={handleTypeChange}
                    onReset={props.resetUpdateTypes}
                  />
                  <div className="advanced-property-filter-selected-items">
                    {props.selectedTypes.map((item, i) =>
                      props.renderSelectedItem(item, i, () =>
                        props.updateTypes(item)
                      )
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-3 px-1 mb-2">
                  <AdvancedSearchFilter
                    title="MustHaves"
                    items={props.mustHaveItems}
                    selectedItems={props.selectedMusthave}
                    onChange={handleMustHaveChange}
                    onReset={props.resetUpdateMustHave}
                  />
                  {props.selectedMusthave.map((item) =>
                    console.log("props.selectedMusthave----------->", item)
                  )}
                  <div className="advanced-property-filter-selected-items">
                    {props.selectedMusthave.map((item, i) =>
                      props.renderSelectedItem(item, i, () =>
                        props.updateMusthave(item)
                      )
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-3 px-1 mb-2">
                  <AdvancedSearchFilter
                    title="Amenities"
                    items={props.amenitiesItems}
                    selectedItems={props.selectedAmenities}
                    onChange={handleAmenitiesChange}
                    onReset={props.resetUpdateAmenities}
                  />
                  <div className="advanced-property-filter-selected-items">
                    {props.selectedAmenities.map((item, i) =>
                      props.renderSelectedItem(item, i, () =>
                        props.updateAmenities(item)
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div className="float-end mt-4">
                <Button
                  style={{ fontSize: "18px", marginRight: "30px" }}
                  variant="link"
                  text="Cancel"
                  onClick={props.onClose}
                />
                <Button
                  style={{ fontSize: "18px" }}
                  text="Search"
                  onClick={props.handleSearchButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdvancedSearch;
