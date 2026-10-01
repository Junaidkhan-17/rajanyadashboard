import "./TryOnPagination.css";

const TryOnPagination = ({
  currentPage,
  totalEntries,
  perPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(
    totalEntries / perPage
  );

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    if (currentPage <= 3) {
      return [
        1,
        2,
        3,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        1,
        "...",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const startEntry =
    totalEntries > 0
      ? Math.min(
          (currentPage - 1) * perPage + 1,
          totalEntries
        )
      : 0;

  const endEntry = Math.min(
    currentPage * perPage,
    totalEntries
  );

  return (
    <div className="try-on-pagination">
      {/* =================================================
          LEFT — ENTRY INFORMATION
          ================================================= */}

      <p className="try-on-pagination__info">
        Showing{" "}
        <span>{startEntry}</span>{" "}
        to{" "}
        <span>{endEntry}</span>{" "}
        of{" "}
        <span>{totalEntries}</span>{" "}
        entries
      </p>

      {/* =================================================
          RIGHT — PAGINATION CONTROLS
          ================================================= */}

      <div className="try-on-pagination__controls">
        {/* Previous */}

        <button
          type="button"
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          disabled={currentPage === 1}
          className="try-on-pagination__button try-on-pagination__arrow"
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page Numbers */}

        {getPages().map(
          (page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="try-on-pagination__ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={page}
                onClick={() =>
                  onPageChange(page)
                }
                aria-label={`Go to page ${page}`}
                aria-current={
                  currentPage === page
                    ? "page"
                    : undefined
                }
                className={`try-on-pagination__button ${
                  currentPage === page
                    ? "try-on-pagination__button--active"
                    : ""
                }`}
              >
                {page}
              </button>
            )
        )}

        {/* Next */}

        <button
          type="button"
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          disabled={
            currentPage === totalPages
          }
          className="try-on-pagination__button try-on-pagination__arrow"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default TryOnPagination;