
import { CircleX } from "lucide-react";
import "./CancelInfoCard.css";

const CancelInfoCard = ({ booking }) => {
  // Show this card only for cancelled bookings.
  if (booking?.bookingStatus !== "Cancelled") return null;

  const cancel = booking?.cancelInfo || {};

  return (
    <div className="cancel-info-card">
      {/* Header */}
      <div className="cancel-info-card__header">
        <div className="cancel-info-card__icon">
          <CircleX size={19} strokeWidth={2} />
        </div>

        <h2 className="cancel-info-card__title">
          Cancel Information
        </h2>

        <span className="cancel-info-card__badge">
          Cancelled
        </span>
      </div>

      {/* Body */}
      <div className="cancel-info-card__body">
        {/* Cancellation Summary */}
        <div className="cancel-info-card__grid">
          {/* Cancelled By */}
          <div className="cancel-info-card__field">
            <p className="cancel-info-card__label">
              Cancelled By
            </p>

            <p className="cancel-info-card__value">
              {cancel.cancelledBy || "-"}
            </p>
          </div>

          {/* Cancelled On */}
          <div className="cancel-info-card__field">
            <p className="cancel-info-card__label">
              Cancelled On
            </p>

            <p className="cancel-info-card__value">
              {cancel.cancelledOn || "-"}
            </p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="cancel-info-card__divider" />

        {/* Cancellation Details */}
        <div className="cancel-info-card__grid">
          {/* Reason */}
          <div className="cancel-info-card__field">
            <p className="cancel-info-card__label">
              Reason
            </p>

            <p className="cancel-info-card__value cancel-info-card__value--description">
              {cancel.reason || "-"}
            </p>
          </div>

          {/* Notes */}
          <div className="cancel-info-card__field">
            <p className="cancel-info-card__label">
              Notes
            </p>

            <p className="cancel-info-card__value cancel-info-card__value--description">
              {cancel.notes || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelInfoCard;
