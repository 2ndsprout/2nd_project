import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  let viewPageList: number[];
  
  if (totalPages <= 5) {
    // 전체 페이지가 5 이하인 경우 모든 페이지 표시
    viewPageList = Array.from({ length: totalPages }, (_, index) => index + 1);
  } else if (currentPage <= 3) {
    // 현재 페이지가 3 이하인 경우 처음 5페이지 표시
    viewPageList = [1, 2, 3, 4, 5];
  } else if (currentPage >= totalPages - 2) {
    // 현재 페이지가 마지막에서 2번째 페이지 이후인 경우 마지막 5페이지 표시
    viewPageList = Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
  } else {
    // 현재 페이지를 중심으로 ±2 페이지 범위 표시
    viewPageList = Array.from({ length: 5 }, (_, index) => currentPage - 2 + index);
  }

  const onPageClickHandler = (page: number) => {
    onPageChange(page);
  };

  const onPreviousClickHandler = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNextClickHandler = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex gap-5 mb-10" id="pagination-wrapper">
      <div className="flex items-center gap-2 cursor-pointer pagination-change-link-box">
        <div
          className={`pagination-change-link-text ${currentPage <= 1 ? "cursor-not-allowed text-gray-500" : "cursor-pointer text-yellow-600"}`}
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
            className="pagination-text text-gray-400 font-semibold text-lg mx-2 cursor-pointer hover:text-yellow-600"
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
          className={`pagination-change-link-text ${currentPage >= totalPages ? "cursor-not-allowed text-gray-500" : "cursor-pointer text-yellow-600"}`}
          onClick={onNextClickHandler}
        >
          다음
        </div>
      </div>
    </div>
  );
};

export default Pagination;