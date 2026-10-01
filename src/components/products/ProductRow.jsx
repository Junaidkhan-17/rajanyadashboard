import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./ProductRow.css";

const FALLBACK_IMAGE =
  "https://placehold.co/100x100?text=Product";

const formatCurrency = (value) => {
  const numericValue = Number(value) || 0;

  return `₹${numericValue.toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) {
    return "Unavailable";
  }

  return status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
};

const getStatusClass = (status) => {
  switch (status) {
    case "available":
      return "product-status-available";

    case "rented":
      return "product-status-rented";

    case "out-of-stock":
      return "product-status-out";

    case "coming-soon":
      return "product-status-coming";

    case "discontinued":
      return "product-status-discontinued";

    default:
      return "product-status-default";
  }
};

export default function ProductRow({
  product,
  selectedProducts = [],
  setSelectedProducts,
  onDeleteClick,
}) {
  const navigate = useNavigate();

  const productId = product?._id;

  const isSelected =
    selectedProducts.includes(productId);

  const availabilityStatus =
    product?.availabilityStatus || "unavailable";

  const categoryName =
    typeof product?.category === "object"
      ? product.category?.name || "-"
      : product?.category || "-";

  const productImage =
    product?.thumbnailImage ||
    product?.mainImage ||
    product?.virtualTryOnImage ||
    FALLBACK_IMAGE;

  const rentalPrice =
    Number(product?.rentalOptions?.[0]?.price) || 0;

  const originalPrice =
    Number(product?.originalPrice) || 0;

  /*
   * Rental price is the primary price shown in the
   * management table. Original price is used only
   * when rental options are unavailable.
   */
  const displayPrice =
    rentalPrice || originalPrice;

  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : typeof product?.sizes === "string"
      ? product.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean)
      : [];

  const handleSelect = () => {
    if (!productId) {
      return;
    }

    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter(
          (id) => id !== productId,
        ),
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        productId,
      ]);
    }
  };

  const handleView = () => {
    if (!productId) {
      return;
    }

    navigate(`/products/view/${productId}`);
  };

  const handleEdit = () => {
    if (!productId) {
      return;
    }

    navigate(`/products/edit/${productId}`);
  };

  const handleDelete = () => {
    if (!productId) {
      return;
    }

    onDeleteClick(product);
  };

  return (
    <>
      {/* ==================================================
          DESKTOP / TABLET ROW
          ================================================== */}

      <tr className="product-desktop-row">
        {/* CHECKBOX */}
        <td className="product-row-select-cell">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="product-row-checkbox"
            aria-label={`Select ${
              product?.name || "product"
            }`}
          />
        </td>

        {/* IMAGE */}
        <td className="product-row-image-cell">
          <button
            type="button"
            className="product-row-image-button"
            onClick={handleView}
            aria-label={`View ${
              product?.name || "product"
            }`}
          >
            <img
              src={productImage}
              alt={product?.name || "Product"}
              className="product-row-image"
              onError={(event) => {
                event.currentTarget.src =
                  FALLBACK_IMAGE;
              }}
            />
          </button>
        </td>

        {/* PRODUCT NAME */}
        <td className="product-row-name-cell">
          <div className="product-row-name-wrapper">
            <h3
              className="product-row-name"
              title={product?.name || ""}
            >
              {product?.name || "Unnamed Product"}
            </h3>

            <p
              className="product-row-description"
              title={
                product?.shortDescription ||
                product?.description ||
                ""
              }
            >
              {product?.shortDescription ||
                product?.description ||
                "No description"}
            </p>
          </div>
        </td>

        {/* CATEGORY */}
        <td className="product-row-category-cell">
          <span
            className="product-category-badge"
            title={categoryName}
          >
            {categoryName}
          </span>
        </td>

        {/* PRICE */}
        <td className="product-row-price-cell">
          <span className="product-row-price">
            {formatCurrency(displayPrice)}
          </span>
        </td>

        {/* SIZES */}
        <td className="product-row-sizes-cell">
          {sizes.length > 0 ? (
            <div className="product-row-sizes">
              {sizes.map((size, index) => (
                <span
                  key={`${size}-${index}`}
                  className="product-size-badge"
                >
                  {size}
                </span>
              ))}
            </div>
          ) : (
            <span className="product-row-empty-value">
              -
            </span>
          )}
        </td>

        {/* STOCK */}
        <td className="product-row-stock-cell">
          <span
            className={`product-row-stock ${
              Number(product?.stock) > 15
                ? "product-stock-high"
                : Number(product?.stock) > 0
                  ? "product-stock-low"
                  : "product-stock-zero"
            }`}
          >
            {Number(product?.stock) || 0}
          </span>
        </td>

        {/* STATUS */}
        <td className="product-row-status-cell">
          <span
            className={`product-status-badge ${getStatusClass(
              availabilityStatus,
            )}`}
          >
            <span className="product-status-dot" />

            {formatStatus(availabilityStatus)}
          </span>
        </td>

        {/* DATE */}
        <td className="product-row-date-cell">
          {formatDate(product?.createdAt)}
        </td>

        {/* ACTIONS */}
        <td className="product-row-actions-cell">
          <div className="product-row-actions">
            <button
              type="button"
              onClick={handleView}
              className="product-action-button product-view-button"
              aria-label={`View ${
                product?.name || "product"
              }`}
              title="View Product"
            >
              <Eye size={17} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={handleEdit}
              className="product-action-button product-edit-button"
              aria-label={`Edit ${
                product?.name || "product"
              }`}
              title="Edit Product"
            >
              <Pencil
                size={16}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="product-action-button product-delete-button"
              aria-label={`Delete ${
                product?.name || "product"
              }`}
              title="Delete Product"
            >
              <Trash2
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </td>
      </tr>

      {/* ==================================================
          MOBILE PRODUCT CARD
          ================================================== */}

      <tr className="product-mobile-row">
        <td colSpan={10}>
          <article className="product-mobile-card">
            {/* ------------------------------------------
                MOBILE CARD TOP
                ------------------------------------------ */}

            <div className="product-mobile-top">
              {/* SELECT */}
              <div className="product-mobile-select">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={handleSelect}
                  className="product-row-checkbox"
                  aria-label={`Select ${
                    product?.name || "product"
                  }`}
                />
              </div>

              {/* IMAGE */}
              <button
                type="button"
                className="product-mobile-image-button"
                onClick={handleView}
                aria-label={`View ${
                  product?.name || "product"
                }`}
              >
                <img
                  src={productImage}
                  alt={
                    product?.name || "Product"
                  }
                  className="product-mobile-image"
                  onError={(event) => {
                    event.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />
              </button>

              {/* NAME */}
              <div className="product-mobile-heading">
                <h3
                  title={product?.name || ""}
                >
                  {product?.name ||
                    "Unnamed Product"}
                </h3>

                <p
                  title={
                    product?.shortDescription ||
                    product?.description ||
                    ""
                  }
                >
                  {product?.shortDescription ||
                    product?.description ||
                    "No description"}
                </p>
              </div>
            </div>

            {/* ------------------------------------------
                CATEGORY + PRICE
                SINGLE HORIZONTAL LINE
                ------------------------------------------ */}

            <div className="product-mobile-detail-row">
              <div className="product-mobile-detail-item product-mobile-category">
                <span className="product-mobile-label">
                  Category
                </span>

                <span
                  className="product-category-badge"
                  title={categoryName}
                >
                  {categoryName}
                </span>
              </div>

              <div className="product-mobile-detail-item product-mobile-price">
                <span className="product-mobile-label">
                  Price
                </span>

                <strong>
                  {formatCurrency(displayPrice)}
                </strong>
              </div>
            </div>

            {/* ------------------------------------------
                SIZES + STOCK
                SINGLE HORIZONTAL LINE
                ------------------------------------------ */}

            <div className="product-mobile-detail-row">
              <div className="product-mobile-detail-item product-mobile-sizes">
                <span className="product-mobile-label">
                  Sizes
                </span>

                <div className="product-mobile-size-list">
                  {sizes.length > 0 ? (
                    sizes.map(
                      (size, index) => (
                        <span
                          key={`${size}-${index}`}
                          className="product-size-badge"
                        >
                          {size}
                        </span>
                      ),
                    )
                  ) : (
                    <span className="product-row-empty-value">
                      -
                    </span>
                  )}
                </div>
              </div>

              <div className="product-mobile-detail-item product-mobile-stock">
                <span className="product-mobile-label">
                  Stock
                </span>

                <strong
                  className={
                    Number(product?.stock) > 15
                      ? "product-stock-high"
                      : Number(product?.stock) > 0
                        ? "product-stock-low"
                        : "product-stock-zero"
                  }
                >
                  {Number(product?.stock) || 0}
                </strong>
              </div>
            </div>

            {/* ------------------------------------------
                STATUS + DATE
                SINGLE HORIZONTAL LINE
                ------------------------------------------ */}

            <div className="product-mobile-detail-row">
              <div className="product-mobile-detail-item product-mobile-status">
                <span className="product-mobile-label">
                  Status
                </span>

                <span
                  className={`product-status-badge ${getStatusClass(
                    availabilityStatus,
                  )}`}
                >
                  <span className="product-status-dot" />

                  {formatStatus(
                    availabilityStatus,
                  )}
                </span>
              </div>

              <div className="product-mobile-detail-item product-mobile-date">
                <span className="product-mobile-label">
                  Date
                </span>

                <span>
                  {formatDate(
                    product?.createdAt,
                  )}
                </span>
              </div>
            </div>

            {/* ------------------------------------------
                ACTIONS
                SINGLE HORIZONTAL LINE
                ------------------------------------------ */}

            <div className="product-mobile-actions-row">
              <span className="product-mobile-label">
                Actions
              </span>

              <div className="product-row-actions">
                <button
                  type="button"
                  onClick={handleView}
                  className="product-action-button product-view-button"
                  aria-label={`View ${
                    product?.name ||
                    "product"
                  }`}
                  title="View Product"
                >
                  <Eye
                    size={17}
                    strokeWidth={1.8}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="product-action-button product-edit-button"
                  aria-label={`Edit ${
                    product?.name ||
                    "product"
                  }`}
                  title="Edit Product"
                >
                  <Pencil
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="product-action-button product-delete-button"
                  aria-label={`Delete ${
                    product?.name ||
                    "product"
                  }`}
                  title="Delete Product"
                >
                  <Trash2
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          </article>
        </td>
      </tr>
    </>
  );
}