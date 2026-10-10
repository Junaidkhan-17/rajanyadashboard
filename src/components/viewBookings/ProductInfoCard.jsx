
import { ShoppingBag } from "lucide-react";
import "./ProductInfoCard.css";

const ProductInfoCard = ({ booking }) => {
  if (!booking || !booking.product) return null;

  const { product } = booking;

  return (
    <div className="product-info-card">
      {/* Header */}
      <div className="product-info-card__header">
        <div className="product-info-card__icon">
          <ShoppingBag size={17} strokeWidth={2} />
        </div>

        <h2 className="product-info-card__title">
          Product Information
        </h2>
      </div>

      {/* Body */}
      <div className="product-info-card__body">
        {/* Product Image */}
        <div className="product-info-card__image-wrapper">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name || "Product"}
              className="product-info-card__image"
              loading="lazy"
            />
          ) : (
            <div className="product-info-card__image-placeholder">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="product-info-card__details">
          <div className="product-info-card__list">
            {/* Product Name */}
            <div className="product-info-card__row">
              <span className="product-info-card__label">
                Product Name
              </span>

              <span className="product-info-card__value">
                {product.name || "-"}
              </span>
            </div>

            {/* Category */}
            <div className="product-info-card__row">
              <span className="product-info-card__label">
                Category
              </span>

              <span className="product-info-card__value">
                {product.category || "-"}
              </span>
            </div>

            {/* Collection */}
            <div className="product-info-card__row">
              <span className="product-info-card__label">
                Collection
              </span>

              <span className="product-info-card__value">
                {product.collection || "-"}
              </span>
            </div>

            {/* Selected Size */}
            <div className="product-info-card__row">
              <span className="product-info-card__label">
                Selected Size
              </span>

              <span className="product-info-card__value">
                {product.size || "-"}
              </span>
            </div>

            {/* SKU */}
            <div className="product-info-card__row">
              <span className="product-info-card__label">
                SKU
              </span>

              <span className="product-info-card__value">
                {product.sku || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoCard;
