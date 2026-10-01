import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./CategoryPagination.css";

const CategoryPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="category-pagination">
      {/* =================================================
          PAGE INFORMATION
          ================================================= */}

      <p className="category-pagination__info">
        Page{" "}
        <span className="category-pagination__current">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="category-pagination__total">
          {totalPages}
        </span>
      </p>

      {/* =================================================
          PAGINATION CONTROLS
          ================================================= */}

      <div className="category-pagination__controls">
        {/* Previous */}

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1,
            )
          }
          className="category-pagination__button category-pagination__arrow"
          aria-label="Previous page"
        >
          <ChevronLeft
            size={18}
            strokeWidth={2}
          />
        </button>

        {/* Numbers */}

        <div className="category-pagination__numbers">
          {pages.map((page) => (
            <button
              type="button"
              key={page}
              onClick={() =>
                setCurrentPage(page)
              }
              className={`category-pagination__button category-pagination__number ${
                currentPage === page
                  ? "category-pagination__number--active"
                  : ""
              }`}
              aria-current={
                currentPage === page
                  ? "page"
                  : undefined
              }
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next */}

        <button
          type="button"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1,
            )
          }
          className="category-pagination__button category-pagination__arrow"
          aria-label="Next page"
        >
          <ChevronRight
            size={18}
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
};

export default CategoryPagination;