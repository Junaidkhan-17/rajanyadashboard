import { ChevronLeft, ChevronRight } from "lucide-react";
import "./PaginationPayment.css";

const PaginationPayment = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-payment">
      <p className="pagination-payment-info">
        Page {currentPage} of {totalPages}
      </p>

      <div className="pagination-payment-controls">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="pagination-payment-button pagination-payment-arrow"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="pagination-payment-pages">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              type="button"
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`pagination-payment-button ${
                currentPage === i + 1
                  ? "pagination-payment-button-active"
                  : "pagination-payment-button-number"
              }`}
              aria-label={`Go to page ${i + 1}`}
              aria-current={currentPage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-payment-button pagination-payment-arrow"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PaginationPayment;