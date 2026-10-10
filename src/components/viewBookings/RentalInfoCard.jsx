
import { CalendarDays } from "lucide-react";
import "./RentalInfoCard.css";

const RentalInfoCard = ({ booking }) => {
  const rental = booking?.rental || {};

  return (
    <div className="rental-info-card">
      {/* Header */}
      <div className="rental-info-card__header">
        <div className="rental-info-card__icon">
          <CalendarDays size={18} strokeWidth={2} />
        </div>

        <h2 className="rental-info-card__title">
          Rental Information
        </h2>
      </div>

      {/* Body */}
      <div className="rental-info-card__body">
        <div className="rental-info-card__list">

          {/* Rental Duration */}
          <div className="rental-info-card__row">
            <span className="rental-info-card__label">
              Rental Duration
            </span>

            <span className="rental-info-card__value">
              {rental.duration || "-"}
            </span>
          </div>

          {/* Requested Rent Date */}
          <div className="rental-info-card__row rental-info-card__row--date">
            <span className="rental-info-card__label">
              Requested Rent Date
            </span>

            <span className="rental-info-card__value">
              {rental.requestDate || "-"}
            </span>
          </div>

          {/* Requested Return Date */}
          <div className="rental-info-card__row rental-info-card__row--date">
            <span className="rental-info-card__label">
              Requested Return Date
            </span>

            <span className="rental-info-card__value">
              {rental.returnDate || "-"}
            </span>
          </div>

          {/* Advance Notice */}
          <div className="rental-info-card__row">
            <span className="rental-info-card__label">
              Advance Notice
            </span>

            <span className="rental-info-card__value">
              {rental.advanceNotice || "-"}
            </span>
          </div>

          {/* Outfit Availability */}
          <div className="rental-info-card__row rental-info-card__row--availability">
            <span className="rental-info-card__label">
              Outfit Availability
            </span>

            <span
              className={`rental-info-card__availability ${
                rental.available
                  ? "rental-info-card__availability--available"
                  : "rental-info-card__availability--unavailable"
              }`}
            >
              <span
                className="rental-info-card__availability-dot"
                aria-hidden="true"
              />

              {rental.available ? "Available" : "Not Reserved"}
            </span>
          </div>

          {/* Special Instructions */}
          <div className="rental-info-card__row rental-info-card__row--instructions">
            <span className="rental-info-card__label">
              Special Instructions
            </span>

            <span className="rental-info-card__value">
              {rental.instructions || "-"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RentalInfoCard;
