import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown, Search, Trash2, Check } from "lucide-react";

import TryOnRow from "./TryOnRow";
import TryOnPagination from "./TryOnPagination";
import api from "../../services/api";

import "./TryOnTable.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statusOptions = ["Pending", "Processing", "Completed", "Failed"];

const sortOptions = ["Latest First", "Oldest First"];

const PER_PAGE = 5;

const TryOnTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const [sortBy, setSortBy] = useState("Latest First");

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    month: "",
    status: "",
  });

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRefs = useRef({});

  /*
  ========================================
  Dropdown Reference
  ========================================
  */

  const setDropdownRef = (name) => (element) => {
    dropdownRefs.current[name] = element;
  };

  /*
  ========================================
  Dropdown Toggle
  ========================================
  */

  const toggleDropdown = (name) => {
    setOpenDropdown((previous) => (previous === name ? null : name));
  };

  /*
  ========================================
  Close Dropdown Outside / Escape
  ========================================
  */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!openDropdown) return;

      const currentRef = dropdownRefs.current[openDropdown];

      if (currentRef && !currentRef.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);

  /*
  ========================================
  Fetch Admin Virtual Try-On Requests
  ========================================
  */

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/virtual-try-on/admin/requests");

        console.log("ADMIN VIRTUAL TRY-ON API RESPONSE:", response.data);

        const virtualTryOnAccounts = response.data?.data || [];

        /*
        ========================================
        Convert VirtualTryOn history[]
        into individual table rows
        ========================================
        */

        const normalizedRequests = [];

        virtualTryOnAccounts.forEach((account) => {
          const user = account.user || {};

          const history = Array.isArray(account.history) ? account.history : [];

          history.forEach((item) => {
            const product = item.product || {};

            /*
  ========================================
  Payment
  ========================================
  */

            const payment = item.paymentId || {};

            const paymentInfo = payment.payment || {};

            const virtualTryOnPayment = payment.virtualTryOn || {};

            const paymentGateway = payment.gateway || {};

            const normalizedPaymentStatus = paymentInfo.paymentStatus || "";

            const paymentStatus =
              normalizedPaymentStatus === "paid"
                ? "Paid"
                : normalizedPaymentStatus === "processing"
                  ? "Processing"
                  : normalizedPaymentStatus === "pending"
                    ? "Pending"
                    : normalizedPaymentStatus === "failed"
                      ? "Failed"
                      : normalizedPaymentStatus === "cancelled"
                        ? "Cancelled"
                        : normalizedPaymentStatus === "refunded"
                          ? "Refunded"
                          : "N/A";

            const paymentAmount = virtualTryOnPayment.amountPaid ?? 0;

            const paymentMethod =
              paymentInfo.paymentMethod ||
              (paymentGateway.paymentId ? "Razorpay" : "N/A");

            normalizedRequests.push({
              /*
                ----------------------------------------
                Request
                ----------------------------------------
                */

              _id: item._id,

              requestId: item._id
                ? `VTO-${item._id.slice(-6).toUpperCase()}`
                : "-",

              /*
                ----------------------------------------
                Customer
                ----------------------------------------
                */

              customer:
                user.fullName ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                "-",

              email: user.email || "-",

              phone: user.phone || "-",

              customerImage: user.profileImage || "",

              /*
                ----------------------------------------
                Product
                ----------------------------------------
                */

              productName: item.productName || product.name || "-",

              sku: "-",

              price: "-",

              productImage: product.mainImage || product.thumbnailImage || "",

              /*
                ----------------------------------------
                Uploaded Photo
                ----------------------------------------
                */

              uploadedPhoto: item.uploadedImage || "",

              /*
----------------------------------------
Payment
----------------------------------------
*/

              paymentStatus,

              paymentAmount:
                paymentAmount > 0
                  ? `₹${paymentAmount.toLocaleString("en-IN")}`
                  : "-",

              paymentMethod,

              /*
                ----------------------------------------
                Status

                The current database does not contain
                a dedicated request status field.

                Since this history record contains a
                generated image, we represent the UI
                state as Completed.
                ----------------------------------------
                */

              status: item.generatedImage ? "Completed" : "Pending",

              statusText: item.generatedImage
                ? "AI Generated"
                : "Awaiting Generation",

              /*
                ----------------------------------------
                Date
                ----------------------------------------
                */

              createdAt: item.generatedAt || account.createdAt || null,

              /*
                ----------------------------------------
                Additional Data
                ----------------------------------------
                */

              generatedImage: item.generatedImage || "",

              tokensUsed: item.tokensUsed || 0,

              productId: product._id || item.product || null,

              virtualTryOnId: account._id || null,

              paymentId: item.paymentId?._id || null,

              paymentNumber: paymentInfo.paymentNumber || "-",

              razorpayPaymentId: paymentGateway.paymentId || "-",

              razorpayOrderId: paymentGateway.orderId || "-",
            });
          });
        });

        console.log("FORMATTED VIRTUAL TRY-ON REQUESTS:", normalizedRequests);

        setRequests(normalizedRequests);
      } catch (error) {
        console.error("Failed to fetch Virtual Try-On requests:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load Virtual Try-On requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  /*
  ========================================
  Filter
  ========================================
  */

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const search = filters.search.toLowerCase().trim();

      const matchesSearch =
        !search ||
        req.productName?.toLowerCase().includes(search) ||
        req.requestId?.toLowerCase().includes(search) ||
        req.customer?.toLowerCase().includes(search) ||
        req.email?.toLowerCase().includes(search);

      const matchesMonth =
        !filters.month ||
        new Date(req.createdAt).toLocaleString("default", {
          month: "long",
        }) === filters.month;

      const matchesStatus = !filters.status || req.status === filters.status;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [requests, filters]);

  /*
  ========================================
  Sort
  ========================================
  */

  const sortedRequests = useMemo(() => {
    const arr = [...filteredRequests];

    if (sortBy === "Latest First") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Oldest First") {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return arr;
  }, [filteredRequests, sortBy]);

  /*
  ========================================
  Pagination
  ========================================
  */

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;

    return sortedRequests.slice(start, start + PER_PAGE);
  }, [sortedRequests, currentPage]);

  /*
  ========================================
  Reset Page
  ========================================
  */

  const handleSetFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  /*
  ========================================
  Delete Selected
  ========================================

  NOTE:
  There is currently no admin delete-history
  endpoint in the backend.

  Therefore we do NOT delete database records
  from here yet.
  ========================================
  */

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;

    console.log("Selected Virtual Try-On records:", selectedRows);

    /*
      Admin delete API will be connected later
      when the backend endpoint is created.
    */
  };

  /*
  ========================================
  Dropdown Selection Helpers
  ========================================
  */

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const handleMonthChange = (value) => {
    handleSetFilters({
      ...filters,
      month: value,
    });

    setOpenDropdown(null);
  };

  const handleStatusChange = (value) => {
    handleSetFilters({
      ...filters,
      status: value,
    });

    setOpenDropdown(null);
  };

  /*
  ========================================
  Reusable Custom Dropdown
  ========================================
  */

  const renderDropdown = ({ name, value, placeholder, options, onChange }) => {
    const isOpen = openDropdown === name;

    return (
      <div
        ref={setDropdownRef(name)}
        className={`try-on-table__dropdown ${
          isOpen ? "try-on-table__dropdown--open" : ""
        }`}
      >
        <button
          type="button"
          className={`try-on-table__dropdown-trigger ${
            value ? "try-on-table__dropdown-trigger--selected" : ""
          }`}
          onClick={() => toggleDropdown(name)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="try-on-table__dropdown-value">
            {value || placeholder}
          </span>

          <ChevronDown
            size={18}
            strokeWidth={2}
            className={`try-on-table__dropdown-icon ${
              isOpen ? "try-on-table__dropdown-icon--open" : ""
            }`}
          />
        </button>

        <div
          className={`try-on-table__dropdown-menu ${
            isOpen ? "try-on-table__dropdown-menu--visible" : ""
          }`}
          role="listbox"
          aria-hidden={!isOpen}
        >
          {options.map((option) => {
            const selected = value === option;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                className={`try-on-table__dropdown-option ${
                  selected ? "try-on-table__dropdown-option--selected" : ""
                }`}
                onClick={() => onChange(option)}
              >
                <span>{option}</span>

                {selected && (
                  <Check
                    size={17}
                    strokeWidth={2.4}
                    className="try-on-table__dropdown-check"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /*
  ========================================
  Loading
  ========================================
  */

  if (loading) {
    return (
      <div className="try-on-table__state-card">
        <div className="try-on-table__loader">
          <span />
          <span />
          <span />
        </div>

        <p className="try-on-table__state-text">
          Loading Virtual Try-On requests...
        </p>
      </div>
    );
  }

  /*
  ========================================
  Error
  ========================================
  */

  if (error) {
    return (
      <div className="try-on-table__state-card try-on-table__state-card--error">
        <div className="try-on-table__error-content">
          <p className="try-on-table__error-message">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="try-on-table__retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="try-on-table">
      {/* =================================================
          TABLE HEADER
          ================================================= */}

      <div className="try-on-table__header">
        <div className="try-on-table__heading">
          <h2 className="try-on-table__title">Virtual Try-On Requests</h2>

          <p className="try-on-table__subtitle">
            Showing <span>{sortedRequests.length}</span> of{" "}
            <span>{requests.length}</span> requests
          </p>
        </div>

        <div className="try-on-table__sort-wrapper">
          {renderDropdown({
            name: "sort",
            value: sortBy,
            placeholder: "Sort",
            options: sortOptions,
            onChange: handleSortChange,
          })}
        </div>
      </div>

      {/* =================================================
          FILTERS
          ================================================= */}

      <div className="try-on-table__filters">
        <div className="try-on-table__filters-grid">
          {/* Search */}

          <div className="try-on-table__search">
            <Search
              size={18}
              strokeWidth={2}
              className="try-on-table__search-icon"
              aria-hidden="true"
            />

            <input
              type="text"
              placeholder="Search product"
              value={filters.search}
              onChange={(e) =>
                handleSetFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
              aria-label="Search Virtual Try-On requests"
            />
          </div>

          {/* Month */}

          {renderDropdown({
            name: "month",
            value: filters.month,
            placeholder: "All Months",
            options: months,
            onChange: handleMonthChange,
          })}

          {/* Status */}

          {renderDropdown({
            name: "status",
            value: filters.status,
            placeholder: "All Status",
            options: statusOptions,
            onChange: handleStatusChange,
          })}

          {/* Delete */}

          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
            className="try-on-table__delete-button"
          >
            <Trash2 size={17} strokeWidth={2} aria-hidden="true" />

            <span>Delete ({selectedRows.length})</span>
          </button>
        </div>
      </div>

      {/* =================================================
          TABLE
          ================================================= */}

      <div className="try-on-table__scroll-wrapper">
        <div className="try-on-table__scroll-area">
          <table className="try-on-table__table">
            <thead className="try-on-table__thead">
              <tr>
                <th className="try-on-table__check-cell">
                  <input
                    type="checkbox"
                    aria-label="Select all visible requests"
                    checked={
                      paginatedRequests.length > 0 &&
                      paginatedRequests.every((r) =>
                        selectedRows.includes(r._id),
                      )
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows((prev) => [
                          ...new Set([
                            ...prev,
                            ...paginatedRequests.map((r) => r._id),
                          ]),
                        ]);
                      } else {
                        setSelectedRows((prev) =>
                          prev.filter(
                            (id) =>
                              !paginatedRequests.map((r) => r._id).includes(id),
                          ),
                        );
                      }
                    }}
                  />
                </th>

                <th>Request</th>

                <th>Customer</th>

                <th>Product</th>

                <th>Uploaded Photo</th>

                <th>Payment</th>

                <th>Status</th>

                <th>Date</th>

                <th className="try-on-table__actions-header">Actions</th>
              </tr>
            </thead>

            <tbody className="try-on-table__tbody">
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <TryOnRow
                    key={request._id}
                    request={request}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="try-on-table__empty-cell">
                    <div className="try-on-table__empty-state">
                      <Search size={24} strokeWidth={1.7} />

                      <span>No requests match your filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          PAGINATION
          ================================================= */}

      <div className="try-on-table__pagination">
        <TryOnPagination
          currentPage={currentPage}
          totalEntries={sortedRequests.length}
          perPage={PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TryOnTable;
