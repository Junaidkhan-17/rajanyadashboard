import { User } from "lucide-react";
import "./CustomerInfoCard.css";

const CustomerInfoCard = ({ booking }) => {
  if (!booking) return null;

  const customer = booking.customer || {};
  const address = booking.address || {};
  const rawAddress = booking.rawBooking?.address || {};

  // Resolve street address from available booking data.
  const streetAddress =
    address.streetAddress ||
    address.street ||
    address.fullAddress ||
    rawAddress.streetAddress ||
    rawAddress.street ||
    rawAddress.fullAddress ||
    customer.streetAddress ||
    customer.address?.streetAddress ||
    customer.address?.street ||
    "-";

  const customerName =
    customer.name || customer.fullName || "-";

  const mobileNumber =
    customer.phone || customer.mobileNumber || "-";

  const emailAddress =
    customer.email || customer.emailAddress || "-";

  const city =
    customer.city || address.city || rawAddress.city || "-";

  const state =
    customer.state || address.state || rawAddress.state || "-";

  const pinCode =
    customer.pin ||
    customer.pinCode ||
    customer.pincode ||
    address.pinCode ||
    address.pincode ||
    rawAddress.pinCode ||
    rawAddress.pincode ||
    "-";

  const InfoRow = ({ label, value, className = "" }) => (
    <div className={`customer-info-card__row ${className}`}>
      <span className="customer-info-card__label">
        {label}
      </span>

      <span className="customer-info-card__value">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <section className="customer-info-card">
      {/* Header */}
      <div className="customer-info-card__header">
        <div className="customer-info-card__icon">
          <User size={18} aria-hidden="true" />
        </div>

        <h2 className="customer-info-card__title">
          Customer Information
        </h2>
      </div>

      {/* Customer Details */}
      <div className="customer-info-card__body">
        <div className="customer-info-card__list">
          <InfoRow
            label="Customer Name :"
            value={customerName}
          />

          <InfoRow
            label="Mobile Number :"
            value={mobileNumber}
          />

          <InfoRow
            label="Email Address :"
            value={emailAddress}
            className="customer-info-card__row--email"
          />

          <InfoRow
            label="Street Address :"
            value={streetAddress}
            className="customer-info-card__row--address"
          />

          <InfoRow
            label="City :"
            value={city}
          />

          <InfoRow
            label="State :"
            value={state}
          />

          <InfoRow
            label="Pin Code :"
            value={pinCode}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomerInfoCard;
