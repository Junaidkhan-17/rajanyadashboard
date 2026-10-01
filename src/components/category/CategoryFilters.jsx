import { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
} from "lucide-react";

import "./CategoryFilters.css";

const CategoryFilters = ({
  search,
  setSearch,
  featured,
  setFeatured,
  sortBy,
  setSortBy,
  parentCategoryOptions,
  date,
  setDate,
  status,
  setStatus,
}) => {
  /* =====================================================
     DROPDOWN STATE
     ===================================================== */

  const [openDropdown, setOpenDropdown] =
    useState(null);

  const dropdownRefs = useRef({});

  /* =====================================================
     DROPDOWN OPTIONS
     ===================================================== */

  const featuredOptions = [
    {
      value: "true",
      label: "Yes",
    },
    {
      value: "false",
      label: "No",
    },
  ];

  const statusOptions = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Inactive",
      label: "Inactive",
    },
  ];

  /* =====================================================
     OUTSIDE CLICK + ESCAPE
     ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!openDropdown) {
        return;
      }

      const currentRef =
        dropdownRefs.current[openDropdown];

      if (
        currentRef &&
        !currentRef.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [openDropdown]);

  /* =====================================================
     REF SETTER
     ===================================================== */

  const setDropdownRef = (name) => (element) => {
    dropdownRefs.current[name] =
      element;
  };

  /* =====================================================
     TOGGLE DROPDOWN
     ===================================================== */

  const toggleDropdown = (name) => {
    setOpenDropdown((current) =>
      current === name
        ? null
        : name,
    );
  };

  /* =====================================================
     FEATURED LABEL
     ===================================================== */

  const featuredLabel =
    featured === "true"
      ? "Yes"
      : featured === "false"
        ? "No"
        : "Featured";

  /* =====================================================
     CATEGORY TYPE LABEL
     ===================================================== */

  const sortLabel =
    sortBy || "Category Type";

  /* =====================================================
     STATUS LABEL
     ===================================================== */

  const statusLabel =
    status || "Status";

  /* =====================================================
     GENERIC DROPDOWN
     ===================================================== */

  const renderDropdown = ({
    name,
    label,
    value,
    valueLabel,
    hasValue,
    options,
    onSelect,
  }) => {
    const isOpen =
      openDropdown === name;

    return (
      <div
        ref={setDropdownRef(name)}
        className={`category-filter-field category-custom-dropdown ${
          isOpen
            ? "is-open"
            : ""
        }`}
      >
        {/* Label */}

        <span className="category-filter-label">
          {label}
        </span>

        {/* Trigger */}

        <button
          type="button"
          className={`category-filter-select ${
            hasValue
              ? "has-value"
              : ""
          }`}
          onClick={() =>
            toggleDropdown(name)
          }
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="category-filter-select__value">
            {valueLabel}
          </span>

          <ChevronDown
            size={17}
            strokeWidth={2}
            className={`category-filter-select__icon ${
              isOpen
                ? "rotate"
                : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}

        <div
          className={`category-filter-dropdown-menu ${
            isOpen
              ? "is-visible"
              : ""
          }`}
          role="listbox"
          aria-hidden={!isOpen}
        >
          {/* Default / Clear Option */}

          <button
            type="button"
            role="option"
            aria-selected={!value}
            className={`category-filter-option ${
              !value
                ? "selected"
                : ""
            }`}
            onClick={() =>
              onSelect("")
            }
          >
            <span>
              {label}
            </span>

            {!value && (
              <span className="category-filter-option__check">
                ✓
              </span>
            )}
          </button>

          {/* Options */}

          {options.map((option) => {
            const isSelected =
              value ===
              option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={
                  isSelected
                }
                className={`category-filter-option ${
                  isSelected
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  onSelect(
                    option.value,
                  )
                }
              >
                <span>
                  {option.label}
                </span>

                {isSelected && (
                  <span className="category-filter-option__check">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* =====================================================
     CATEGORY TYPE OPTIONS
     ===================================================== */

  const categoryTypeOptions =
    (parentCategoryOptions || []).map(
      (parentCategory) => ({
        value: parentCategory,
        label: parentCategory,
      }),
    );

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="category-filters-card">
      <div className="category-filters-row">

        {/* =================================================
            SEARCH
            ================================================= */}

        <div className="category-filter-search">
          <Search
            size={18}
            strokeWidth={2}
            className="category-filter-search__icon"
            aria-hidden="true"
          />

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            className="category-filter-search__input"
            aria-label="Search category"
          />
        </div>

        {/* =================================================
            FEATURED
            ================================================= */}

        {renderDropdown({
          name: "featured",
          label: "Featured",
          value: featured,
          valueLabel:
            featuredLabel,
          hasValue:
            featured !== "",
          options:
            featuredOptions,
          onSelect: (value) => {
            setFeatured(value);
            setOpenDropdown(null);
          },
        })}

        {/* =================================================
            CATEGORY TYPE
            ================================================= */}

        {renderDropdown({
          name: "categoryType",
          label: "Category Type",
          value: sortBy,
          valueLabel: sortLabel,
          hasValue:
            sortBy !== "",
          options:
            categoryTypeOptions,
          onSelect: (value) => {
            setSortBy(value);
            setOpenDropdown(null);
          },
        })}

        {/* =================================================
            DATE
            ================================================= */}

        <div className="category-filter-date">
          <label
            htmlFor="category-filter-date"
            className="category-filter-label"
          >
            Date
          </label>

          <input
            id="category-filter-date"
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value,
              )
            }
            className="category-filter-date__input"
          />
        </div>

        {/* =================================================
            STATUS
            ================================================= */}

        {renderDropdown({
          name: "status",
          label: "Status",
          value: status,
          valueLabel: statusLabel,
          hasValue:
            status !== "",
          options:
            statusOptions,
          onSelect: (value) => {
            setStatus(value);
            setOpenDropdown(null);
          },
        })}

      </div>
    </div>
  );
};

export default CategoryFilters;