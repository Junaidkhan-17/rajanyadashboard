import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getCategories } from "../../services/categoryService";
import "./ProductFilters.css";

const SIZES = ["S", "M", "L", "XL", "XXL", "Free Size"];

const PRICE_RANGES = [
  { value: "0-2000", label: "₹0 - ₹2,000" },
  { value: "2000-5000", label: "₹2,000 - ₹5,000" },
  { value: "5000-10000", label: "₹5,000 - ₹10,000" },
  { value: "10000+", label: "₹10,000+" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "rented", label: "Rented" },
  { value: "out-of-stock", label: "Out of Stock" },
  { value: "coming-soon", label: "Coming Soon" },
  { value: "discontinued", label: "Discontinued" },
];

export default function ProductFilters({
  filters,
  setFilters,
  onSearchChange,
}) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRefs = useRef({});

  /* =========================================================
     FETCH CATEGORIES
  ========================================================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await getCategories();

        if (response?.success) {
          setCategories(response.categories || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!openDropdown) return;

      const currentRef = dropdownRefs.current[openDropdown];

      if (currentRef && !currentRef.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openDropdown]);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =========================================================
     ACTIVE FILTER COUNT
  ========================================================= */

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters?.search?.trim()) count++;
    if (filters?.category) count++;
    if (filters?.size) count++;
    if (filters?.priceRange) count++;
    if (filters?.selectedDate) count++;
    if (filters?.status) count++;

    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  /* =========================================================
     SELECTED CATEGORY
  ========================================================= */

  const selectedCategory = useMemo(() => {
    if (!filters?.category) return null;

    return categories.find(
      (category) =>
        String(category?._id) === String(filters.category),
    );
  }, [categories, filters?.category]);

  /* =========================================================
     SELECTED SIZE
  ========================================================= */

  const selectedSize = filters?.size || "";

  /* =========================================================
     SELECTED PRICE
  ========================================================= */

  const selectedPrice = useMemo(() => {
    return PRICE_RANGES.find(
      (price) => price.value === filters?.priceRange,
    );
  }, [filters?.priceRange]);

  /* =========================================================
     SELECTED STATUS
  ========================================================= */

  const selectedStatus = useMemo(() => {
    return STATUS_OPTIONS.find(
      (status) => status.value === filters?.status,
    );
  }, [filters?.status]);

  /* =========================================================
     UPDATE FILTER
  ========================================================= */

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =========================================================
     TOGGLE DROPDOWN
  ========================================================= */

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((previous) =>
      previous === dropdownName ? null : dropdownName,
    );
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (event) => {
    const value = event.target.value;

    setFilters((previous) => ({
      ...previous,
      search: value,
    }));

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const clearSearch = () => {
    setFilters((previous) => ({
      ...previous,
      search: "",
    }));

    if (onSearchChange) {
      onSearchChange("");
    }
  };

  /* =========================================================
     CATEGORY
  ========================================================= */

  const handleCategorySelect = (value) => {
    updateFilter("category", value);
    setOpenDropdown(null);
  };

  /* =========================================================
     SIZE
  ========================================================= */

  const handleSizeSelect = (value) => {
    updateFilter("size", value);
    setOpenDropdown(null);
  };

  /* =========================================================
     PRICE
  ========================================================= */

  const handlePriceSelect = (value) => {
    updateFilter("priceRange", value);
    setOpenDropdown(null);
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const handleStatusSelect = (value) => {
    updateFilter("status", value);
    setOpenDropdown(null);
  };

  /* =========================================================
     DATE
  ========================================================= */

  const handleDateChange = (event) => {
    updateFilter(
      "selectedDate",
      event.target.value || null,
    );
  };

  /* =========================================================
     CLEAR FILTER
  ========================================================= */

  const clearFilter = (key) => {
    if (key === "search") {
      clearSearch();
      return;
    }

    if (key === "selectedDate") {
      updateFilter("selectedDate", null);
      return;
    }

    updateFilter(key, "");
  };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "",
      size: "",
      priceRange: "",
      selectedDate: null,
      status: "",
    });

    if (onSearchChange) {
      onSearchChange("");
    }

    setOpenDropdown(null);
  };

  /* =========================================================
     DROPDOWN REF
  ========================================================= */

  const setDropdownRef = (name) => (element) => {
    dropdownRefs.current[name] = element;
  };

  /* =========================================================
     RENDER DROPDOWN
  ========================================================= */

  const renderDropdown = ({
    name,
    label,
    valueLabel,
    hasValue,
    children,
  }) => {
    const isOpen = openDropdown === name;

    return (
      <div
        className={`product-filter-field product-custom-dropdown ${
          isOpen ? "is-open" : ""
        }`}
        ref={setDropdownRef(name)}
      >
        <span className="product-filter-label">
          {label}
        </span>

        <button
          type="button"
          className={`product-filter-select ${
            hasValue ? "has-value" : ""
          }`}
          onClick={() => toggleDropdown(name)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="product-filter-select__value">
            {valueLabel}
          </span>

          <ChevronDown
            size={16}
            className={`product-filter-select__icon ${
              isOpen ? "rotate" : ""
            }`}
          />
        </button>

        {/* Keep menu mounted so opening/closing can animate smoothly */}
        <div
          className={`product-filter-dropdown-menu ${
            isOpen ? "is-visible" : ""
          }`}
          role="listbox"
          aria-hidden={!isOpen}
        >
          {children}
        </div>
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="product-filters">
      <div className="product-filters__top">

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="product-filter-search">
          <Search
            size={18}
            strokeWidth={2}
            className="product-filter-search__icon"
          />

          <input
            type="text"
            value={filters?.search || ""}
            onChange={handleSearch}
            placeholder="Search product name..."
            aria-label="Search products"
          />

          {filters?.search && (
            <button
              type="button"
              className="product-filter-search__clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ===================================================
            FILTER CONTROLS
        =================================================== */}

        <div className="product-filter-controls">

          {/* =================================================
              CATEGORY
          ================================================= */}

          {renderDropdown({
            name: "category",
            label: "Category",
            valueLabel:
              selectedCategory?.name || "All Categories",
            hasValue: Boolean(filters?.category),
            children: (
              <>
                <button
                  type="button"
                  role="option"
                  aria-selected={!filters?.category}
                  className={`product-filter-option ${
                    !filters?.category ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleCategorySelect("")
                  }
                >
                  <span>All Categories</span>

                  {!filters?.category && (
                    <span className="product-filter-option__check">
                      ✓
                    </span>
                  )}
                </button>

                {categoriesLoading ? (
                  <div className="product-filter-dropdown-message">
                    Loading categories...
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => {
                    const categoryId = String(
                      category?._id,
                    );

                    const isSelected =
                      String(filters?.category || "") ===
                      categoryId;

                    return (
                      <button
                        key={category?._id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={`product-filter-option ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleCategorySelect(categoryId)
                        }
                      >
                        <span>
                          {category?.name ||
                            "Unnamed Category"}
                        </span>

                        {isSelected && (
                          <span className="product-filter-option__check">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="product-filter-dropdown-message">
                    No categories found
                  </div>
                )}
              </>
            ),
          })}

          {/* =================================================
              SIZE
          ================================================= */}

          {renderDropdown({
            name: "size",
            label: "Size",
            valueLabel: selectedSize || "All Sizes",
            hasValue: Boolean(selectedSize),
            children: (
              <>
                <button
                  type="button"
                  role="option"
                  aria-selected={!selectedSize}
                  className={`product-filter-option ${
                    !selectedSize ? "selected" : ""
                  }`}
                  onClick={() => handleSizeSelect("")}
                >
                  <span>All Sizes</span>

                  {!selectedSize && (
                    <span className="product-filter-option__check">
                      ✓
                    </span>
                  )}
                </button>

                {SIZES.map((size) => {
                  const isSelected =
                    selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`product-filter-option ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleSizeSelect(size)
                      }
                    >
                      <span>{size}</span>

                      {isSelected && (
                        <span className="product-filter-option__check">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ),
          })}

          {/* =================================================
              PRICE
          ================================================= */}

          {renderDropdown({
            name: "price",
            label: "Price",
            valueLabel:
              selectedPrice?.label || "All Prices",
            hasValue: Boolean(filters?.priceRange),
            children: (
              <>
                <button
                  type="button"
                  role="option"
                  aria-selected={!filters?.priceRange}
                  className={`product-filter-option ${
                    !filters?.priceRange ? "selected" : ""
                  }`}
                  onClick={() =>
                    handlePriceSelect("")
                  }
                >
                  <span>All Prices</span>

                  {!filters?.priceRange && (
                    <span className="product-filter-option__check">
                      ✓
                    </span>
                  )}
                </button>

                {PRICE_RANGES.map((price) => {
                  const isSelected =
                    filters?.priceRange ===
                    price.value;

                  return (
                    <button
                      key={price.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`product-filter-option ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() =>
                        handlePriceSelect(
                          price.value,
                        )
                      }
                    >
                      <span>{price.label}</span>

                      {isSelected && (
                        <span className="product-filter-option__check">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ),
          })}

          {/* =================================================
              DATE
          ================================================= */}

          <div className="product-filter-field product-filter-date-field">
            <span className="product-filter-label">
              Date
            </span>

            <div
              className={`product-filter-date ${
                filters?.selectedDate
                  ? "has-value"
                  : ""
              }`}
            >
              <CalendarDays
                size={15}
                className="product-filter-date__icon"
              />

              <input
                type="date"
                value={filters?.selectedDate || ""}
                onChange={handleDateChange}
                aria-label="Filter by date"
              />

              {filters?.selectedDate && (
                <button
                  type="button"
                  className="product-filter-date__clear"
                  onClick={() =>
                    clearFilter("selectedDate")
                  }
                  aria-label="Clear date"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          {renderDropdown({
            name: "status",
            label: "Status",
            valueLabel:
              selectedStatus?.label || "All Status",
            hasValue: Boolean(filters?.status),
            children: (
              <>
                <button
                  type="button"
                  role="option"
                  aria-selected={!filters?.status}
                  className={`product-filter-option ${
                    !filters?.status ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect("")
                  }
                >
                  <span>All Status</span>

                  {!filters?.status && (
                    <span className="product-filter-option__check">
                      ✓
                    </span>
                  )}
                </button>

                {STATUS_OPTIONS.map((status) => {
                  const isSelected =
                    filters?.status ===
                    status.value;

                  return (
                    <button
                      key={status.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`product-filter-option ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleStatusSelect(
                          status.value,
                        )
                      }
                    >
                      <span>{status.label}</span>

                      {isSelected && (
                        <span className="product-filter-option__check">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ),
          })}

          {/* =================================================
              CLEAR
          ================================================= */}

          {hasActiveFilters && (
            <button
              type="button"
              className="product-filter-clear"
              onClick={clearAllFilters}
            >
              <X size={15} />

              <span>Clear</span>

              <span className="product-filter-clear__count">
                {activeFilterCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          ACTIVE FILTERS
      ===================================================== */}

      {hasActiveFilters && (
        <div className="product-active-filters">
          <div className="product-active-filters__heading">
            <SlidersHorizontal size={14} />
            <span>Active Filters</span>
          </div>

          <div className="product-active-filters__list">

            {filters?.search?.trim() && (
              <button
                type="button"
                className="product-filter-chip"
                onClick={() =>
                  clearFilter("search")
                }
              >
                <span>
                  Search: {filters.search}
                </span>

                <X size={13} />
              </button>
            )}

            {filters?.category && (
              <button
                type="button"
                className="product-filter-chip"
                onClick={() =>
                  clearFilter("category")
                }
              >
                <span>
                  Category:{" "}
                  {selectedCategory?.name ||
                    "Selected"}
                </span>

                <X size={13} />
              </button>
            )}

            {filters?.size && (
              <button
                type="button"
                className="product-filter-chip"
                onClick={() =>
                  clearFilter("size")
                }
              >
                <span>
                  Size: {selectedSize}
                </span>

                <X size={13} />
              </button>
            )}

            {filters?.priceRange && (
              <button
                type="button"
                className="product-filter-chip"
                onClick={() =>
                  clearFilter("priceRange")
                }
              >
                <span>
                  Price: {selectedPrice?.label}
                </span>

                <X size={13} />
              </button>
            )}

            {filters?.selectedDate && (
              <button
                type="button"
                className="product-filter-chip"
                onClick={() =>
                  clearFilter("selectedDate")
                }
              >
                <span>
                  Date: {filters.selectedDate}
                </span>

                <X size={13} />
              </button>
            )}

            {filters?.status && (
              <button
                type="button"
                className="product-filter-chip"
                onClick={() =>
                  clearFilter("status")
                }
              >
                <span>
                  Status: {selectedStatus?.label}
                </span>

                <X size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}