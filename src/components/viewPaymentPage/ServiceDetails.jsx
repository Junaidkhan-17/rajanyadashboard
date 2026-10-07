import { ShoppingBag } from "lucide-react";
import "./ServiceDetails.css";

const ServiceDetails = ({ payment }) => {
  if (!payment) return null;

  // Real fields coming from the admin payment API
  const serviceType = payment.service || "N/A";
  const productName = payment.productName || "N/A";
  const category = payment.category || "N/A";
  const selectedSize = payment.size || "N/A";
  const productImage = payment.productImage || "";
  const amount = Number(payment.amount || 0);

  return (
    <div className="service-details-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
      {/* Header */}
      <div className="service-details-header flex items-center gap-2 px-6 py-5 border-b">
        <ShoppingBag
          size={18}
          className="service-details-header-icon shrink-0"
          aria-hidden="true"
        />

        <h3 className="service-details-title text-lg font-bold text-slate-800">
          Service Details
        </h3>
      </div>

      {/* Body */}
      <div className="service-details-body p-6 flex gap-5">
        {/* Product Image */}
        <div className="service-details-image-wrapper shrink-0">
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="service-details-product-image w-28 h-40 rounded-xl border object-cover"
            />
          ) : (
            <div
              className="service-details-image-placeholder w-28 h-40 rounded-xl border flex items-center justify-center bg-slate-100 text-slate-400 text-sm text-center"
              aria-label="Product image unavailable"
            >
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="service-details-content flex-1 flex flex-col justify-between min-w-0">
          <div className="service-details-info-list space-y-3">
            {/* Service Type */}
            <div className="service-details-row flex justify-between gap-4">
              <span className="service-details-label text-slate-400">
                Service Type :
              </span>

              <span className="service-details-value font-semibold text-slate-800 text-right">
                {serviceType}
              </span>
            </div>

            {/* Product Name */}
            <div className="service-details-row flex justify-between gap-4">
              <span className="service-details-label text-slate-400">
                Product Name :
              </span>

              <span className="service-details-value font-semibold text-slate-800 text-right">
                {productName}
              </span>
            </div>

            {/* Category */}
            <div className="service-details-row flex justify-between gap-4">
              <span className="service-details-label text-slate-400">
                Category :
              </span>

              <span className="service-details-value font-semibold text-slate-800 text-right">
                {category}
              </span>
            </div>

            {/* Selected Size */}
            <div className="service-details-row flex justify-between gap-4">
              <span className="service-details-label text-slate-400">
                Selected Size :
              </span>

              <span className="service-details-value font-semibold text-slate-800 text-right">
                {selectedSize}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="service-details-price-row flex justify-between items-end gap-4 pt-6">
            <span className="service-details-price-label text-slate-400">
              Try-On Price
            </span>

            <span className="service-details-price text-3xl font-bold text-slate-900">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;