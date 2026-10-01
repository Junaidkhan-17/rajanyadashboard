import {
  Eye,
  Pencil,
  Trash2,
  Star,
  Home,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./CategoryRow.css";

const CategoryRow = ({
  category,
  index,
  selectedRows,
  setSelectedRows,
}) => {
  const navigate = useNavigate();

  const data = {
    _id: category?._id || String(index + 1),
    image: category?.image || null,
    categoryName:
      category?.categoryName ||
      category?.name ||
      "",
    parentCategory:
      category?.parentCategory ||
      "No Parent",
    productsCount:
      category?.productsCount ?? 0,
    featured:
      category?.featured ??
      category?.isFeatured ??
      false,
    showOnHomepage:
      category?.showOnHomepage ?? false,
    showInNavigation:
      category?.showInNavigation ?? false,
    status:
      category?.status ||
      (category?.isActive
        ? "Active"
        : "Inactive"),
    createdAt:
      category?.createdAt ||
      "2026-06-24",
  };

  return (
    <tr className="category-row">
      {/* =================================================
          CHECKBOX
          ================================================= */}

      <td className="category-row__cell category-row__checkbox-cell">
        <div className="category-row__cell-inner category-row__checkbox-wrapper">
          <input
            type="checkbox"
            checked={selectedRows.includes(
              data._id,
            )}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows([
                  ...selectedRows,
                  data._id,
                ]);
              } else {
                setSelectedRows(
                  selectedRows.filter(
                    (item) =>
                      item !== data._id,
                  ),
                );
              }
            }}
            className="category-row__checkbox"
            aria-label={`Select ${data.categoryName}`}
          />
        </div>
      </td>

      {/* =================================================
          SERIAL
          ================================================= */}

      <td className="category-row__cell category-row__serial-cell">
        <div className="category-row__cell-inner">
          <span className="category-row__serial">
            {index + 1}
          </span>
        </div>
      </td>

      {/* =================================================
          IMAGE
          ================================================= */}

      <td className="category-row__cell category-row__image-cell">
        <div className="category-row__cell-inner category-row__image-wrapper">
          {data.image ? (
            <img
              src={data.image}
              alt={data.categoryName}
              className="category-row__image"
            />
          ) : (
            <div className="category-row__image-placeholder">
              No Image
            </div>
          )}
        </div>
      </td>

      {/* =================================================
          CATEGORY
          ================================================= */}

      <td className="category-row__cell category-row__category-cell">
        <div className="category-row__cell-inner category-row__category-content">
          <h3 className="category-row__category-name">
            {data.categoryName}
          </h3>

          <p className="category-row__parent">
            {data.parentCategory}
          </p>
        </div>
      </td>

      {/* =================================================
          PRODUCTS
          ================================================= */}

      <td className="category-row__cell category-row__products-cell">
        <div className="category-row__cell-inner category-row__center-content">
          <span className="category-row__products-count">
            {data.productsCount}
          </span>
        </div>
      </td>

      {/* =================================================
          FEATURED
          ================================================= */}

      <td className="category-row__cell category-row__featured-cell">
        <div className="category-row__cell-inner category-row__center-content">
          <div className="category-row__boolean-status">
            <Star
              size={16}
              fill={
                data.featured
                  ? "#FACC15"
                  : "none"
              }
              className={
                data.featured
                  ? "category-row__featured-icon category-row__featured-icon--active"
                  : "category-row__featured-icon category-row__featured-icon--inactive"
              }
              aria-hidden="true"
            />

            <span className="category-row__boolean-text">
              {data.featured
                ? "Yes"
                : "No"}
            </span>
          </div>
        </div>
      </td>

      {/* =================================================
          HOMEPAGE
          ================================================= */}

      <td className="category-row__cell category-row__homepage-cell">
        <div className="category-row__cell-inner category-row__center-content">
          <div className="category-row__boolean-status">
            <Home
              size={16}
              className={
                data.showOnHomepage
                  ? "category-row__boolean-icon category-row__boolean-icon--active"
                  : "category-row__boolean-icon category-row__boolean-icon--inactive"
              }
              aria-hidden="true"
            />

            <span className="category-row__boolean-text">
              {data.showOnHomepage
                ? "Yes"
                : "No"}
            </span>
          </div>
        </div>
      </td>

      {/* =================================================
          NAVIGATION
          ================================================= */}

      <td className="category-row__cell category-row__navigation-cell">
        <div className="category-row__cell-inner category-row__center-content">
          <div className="category-row__boolean-status">
            <Menu
              size={16}
              className={
                data.showInNavigation
                  ? "category-row__boolean-icon category-row__boolean-icon--active"
                  : "category-row__boolean-icon category-row__boolean-icon--inactive"
              }
              aria-hidden="true"
            />

            <span className="category-row__boolean-text">
              {data.showInNavigation
                ? "Yes"
                : "No"}
            </span>
          </div>
        </div>
      </td>

      {/* =================================================
          STATUS
          ================================================= */}

      <td className="category-row__cell category-row__status-cell">
        <div className="category-row__cell-inner category-row__center-content">
          <span
            className={`category-row__status-badge ${
              data.status === "Active"
                ? "category-row__status-badge--active"
                : data.status ===
                    "Inactive"
                  ? "category-row__status-badge--inactive"
                  : "category-row__status-badge--pending"
            }`}
          >
            {data.status}
          </span>
        </div>
      </td>

      {/* =================================================
          DATE
          ================================================= */}

      <td className="category-row__cell category-row__date-cell">
        <div className="category-row__cell-inner category-row__center-content">
          <span className="category-row__date">
            {new Date(
              data.createdAt,
            ).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            )}
          </span>
        </div>
      </td>

      {/* =================================================
          ACTIONS
          ================================================= */}

      <td className="category-row__cell category-row__actions-cell">
        <div className="category-row__cell-inner category-row__actions">
          {/* View */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/categories/view/${data._id}`,
              )
            }
            className="category-row__action-btn category-row__action-btn--view"
            aria-label={`View ${data.categoryName}`}
          >
            <Eye
              size={16}
              className="category-row__action-icon category-row__action-icon--view"
            />
          </button>

          {/* Edit */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/categories/edit/${data._id}`,
              )
            }
            className="category-row__action-btn category-row__action-btn--edit"
            aria-label={`Edit ${data.categoryName}`}
          >
            <Pencil
              size={16}
              className="category-row__action-icon category-row__action-icon--edit"
            />
          </button>

          {/* Delete */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/categories/delete/${data._id}`,
              )
            }
            className="category-row__action-btn category-row__action-btn--delete"
            aria-label={`Delete ${data.categoryName}`}
          >
            <Trash2
              size={16}
              className="category-row__action-icon category-row__action-icon--delete"
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;