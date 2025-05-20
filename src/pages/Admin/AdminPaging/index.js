import React from "react";
import pagingLine from '../../../assets/icons/paging-line.png';
import constants from "../../../Util/constants";

import './AdminPaging.scss';

const AdminPaging = props => {
  const {totalItems, currentPage, onChangePage, perPage} = props;

  const onPrevPage = () => {
    onChangePage(currentPage - 1);
  };

  const onNextPage = () => {
    onChangePage(currentPage + 1);
  };

  const onGotoPage = page => {
    onChangePage(page);
  };

  const generatePaginationLinks = (currentPage, totalPages) => {
    let links = [];

    // Link to previous page
    if (currentPage > 1) {
      links.push(<div key={-1} className="paging-prev-next" onClick={onPrevPage}>Prev</div>);
    }

    // Link to first page
    if (currentPage > 3) {
      links.push(<div key={-2} className="paging-prev-next" onClick={() => onGotoPage(0)}>1</div>);
      links.push(<div key={-3}>. . .</div>);
    }

    // Links to plus/minus 3 pages from current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      if (i === currentPage) {
        links.push(<div key={i} className="paging-number-selected">{i}</div>);
      } else {
        links.push(<div key={i} className="paging-number" onClick={() => onGotoPage(i - 1)}>{i}</div>);
      }
    }

    // Link to next page
    if (currentPage < totalPages) {
      links.push(<div key={-4} className="paging-prev-next" onClick={onNextPage}>Next</div>)
    }

    return links;
  };

  const pageSize = perPage || constants.PAGING_PAGE_SIZE;
  const pageCount = Math.ceil(totalItems / pageSize);

  const paginationLinks = generatePaginationLinks(currentPage + 1, pageCount);

  return (
    <>
      <div className="m-3">
        {totalItems > 0 ? (
          <img src={pagingLine} alt="paging" />
        ) : ''}
      </div>
      {paginationLinks}
    </>
  );
};

export default AdminPaging;
