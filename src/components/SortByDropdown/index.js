import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import arrowDownIcon from '../../assets/icons/arrow-down.png';

import './SortByDropdown.scss';

const SortByDropdown = (props) => {
  const { onSortSelection } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('data.prices.basePrice:-1');
  const [sortTitle, setSortTitle] = useState('Total Nightly Rate');
  const [lowToHigh, setLowToHigh] = useState('High to Low');

  const { width } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      setSort("data.prices.basePrice:-1", "Total Nightly Rate", "High to Low");
      console.log("set sortBy!");
    };
    load();
  }, []);

  const setSort = (order, sortTitle, lowToHigh) => {
    console.log("Order by ", order);
    setIsOpen(false);
    setSortOrder(order);
    setSortTitle(sortTitle);
    setLowToHigh(lowToHigh);
    localStorage.setItem("sortBy", order);
    onSortSelection();
  }

  const SortRow = ({ title, order, onClick }) => {
    return (
      <div className="sort-by-body-row right" onClick={onClick}>
        <div className="sort-by-body-title">{title}</div>
        <div className="sort-by-body-sub-title bold-order">{order}</div>
      </div>
    )
  };

  return (
    <div className="sort-by-container right">
      <div className="sort-by-header" onClick={() => setIsOpen(!isOpen)}>
        <div>Sort By</div>
        <div className="sort-by-header-box"><SortRow title={sortTitle} order={lowToHigh} /></div>
        <img src={arrowDownIcon} style={{ width: '18px', transform: `rotateX(${isOpen ? '180deg' : '0deg'})` }} />
      </div>

      {
        isOpen &&
        <div className="sort-by-body">
          <SortRow title="Total Nightly Rate" order="Low to High" onClick={() => { setSort("data.prices.basePrice:1", "Total Nightly Rate", "Low to High") }} />
          <SortRow title="Total Commission" order="High to Low" onClick={() => { setSort("data.prices.basePrice:-1", "Total Commission", "High to Low") }} />
          <SortRow title="Number of BD" order="High to Low" onClick={() => { setSort("data.bedrooms:-1", "Number of BD", "High to Low") }} />
          <SortRow title="Number of BD" order="Low to High" onClick={() => { setSort("data.bedrooms:1", "Number of BD", "Low to High") }} />
          <SortRow title="Total Nightly Rate" order="High to Low" onClick={() => { setSort("data.prices.basePrice:-1", "Total Nightly Rate", "High to Low") }} />
        </div>
      }
    </div>
  )
};

export default SortByDropdown;
