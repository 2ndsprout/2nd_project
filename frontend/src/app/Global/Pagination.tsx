import React, { Dispatch, SetStateAction } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const viewPageList = Array.from({ length: totalPages }, (_, index) => index + 1);

  const onPageClickHandler = (page: number) => {
    onPageChange(page);
  };

  const onPreviousClickHandler = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 1) return;
    onPageChange(prevPage);
  };

  const onNextClickHandler = () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;
    onPageChange(nextPage);
  };

  return (
    <div className="flex gap-5 mb-10" id="pagination-wrapper">
      <div className="flex items-center gap-2 cursor-pointer pagination-change-link-box">
        <div
          className={`pagination-change-link-text ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={onPreviousClickHandler}
        >
          이전
        </div>
      </div>
      <div className="pagination-divider text-gray-500 mx-2">|</div>
      {viewPageList.map((page) =>
        page === currentPage ? (
          <div className="pagination-text-active text-yellow-600 font-semibold text-lg mx-2" key={page}>
            {page}
          </div>
        ) : (
          <div
            className="pagination-text text-gray-400 font-semibold text-lg mx-2 cursor-pointer"
            key={page}
            onClick={() => onPageClickHandler(page)}
          >
            {page}
          </div>
        )
      )}
      <div className="pagination-divider text-gray-500 mx-2">|</div>
      <div className="flex items-center gap-2 cursor-pointer pagination-change-link-box">
        <div
          className={`pagination-change-link-text ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={onNextClickHandler}
        >
          다음
        </div>
      </div>
    </div>
  );
};

export default Pagination;
