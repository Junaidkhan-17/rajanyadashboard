
import {
  ArrowLeft,
  Pencil,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LoaderCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import CancelBooking from "../delete/CancelBooking";
import { updateBooking } from "../../services/bookingService";

import "./BookingsDetailsAction.css";

const BookingsDetailsAction = ({ booking, onBookingUpdated }) => {
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!booking) return null;

  const bookingId = booking._id || booking.bookingId;
  const status = String(booking.bookingStatus || "").toLowerCase();

  // ========================================
  // Shared Booking Update Handler
  // ========================================

  const updateBookingStatus = async ({
    nextStatus,
    successMessage,
    errorMessage,
    payload = {},
  }) => {
    if (!bookingId || updating) return;

    setUpdating(true);

    try {
      const response = await updateBooking(bookingId, {
        bookingStatus: nextStatus,
        ...payload,
      });

      console.log(`BOOKING ${nextStatus.toUpperCase()}:`, response);

      toast.success(successMessage);

      if (onBookingUpdated) {
        await onBookingUpdated();
      }

      return true;
    } catch (error) {
      console.error(`Failed to update booking to ${nextStatus}:`, error);

      toast.error(error.response?.data?.message || errorMessage);

      return false;
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // Confirm Booking
  // ========================================

  const handleConfirmBooking = async () => {
    await updateBookingStatus({
      nextStatus: "confirmed",
      successMessage: "Booking confirmed successfully.",
      errorMessage: "Failed to confirm booking.",
    });
  };

  // ========================================
  // Cancel Booking
  // ========================================

  const handleCancelBooking = async (data) => {
    const success = await updateBookingStatus({
      nextStatus: "cancelled",
      successMessage: "Booking cancelled successfully.",
      errorMessage: "Failed to cancel booking.",
      payload: {
        cancellationReason: data?.reason || "",
        admin: {
          ...(booking.admin || {}),
          notes: data?.remark || "",
        },
      },
    });

    if (success) {
      setShowCancelModal(false);
    }
  };

  // ========================================
  // Request Return
  // ========================================

  const handleOrderReturn = async () => {
    await updateBookingStatus({
      nextStatus: "return_requested",
      successMessage: "Return request created successfully.",
      errorMessage: "Failed to request return.",
    });
  };

  // ========================================
  // Mark Booking as Returned
  // ========================================

  const handleMarkAsReturned = async () => {
    await updateBookingStatus({
      nextStatus: "returned",
      successMessage: "Booking marked as returned successfully.",
      errorMessage: "Failed to mark booking as returned.",
    });
  };

  // ========================================
  // Complete Booking
  // ========================================

  const handleCompleteBooking = async () => {
    await updateBookingStatus({
      nextStatus: "completed",
      successMessage: "Booking completed successfully.",
      errorMessage: "Failed to complete booking.",
    });
  };

  // ========================================
  // Cancel Modal Booking Data
  // ========================================

  const cancellationBooking = {
    ...booking,
    rentDate:
      booking.rentStartDate ||
      booking.rental?.requestDate ||
      "-",
    returnDate:
      booking.returnDate ||
      booking.rental?.returnDate ||
      "-",
  };

  return (
    <section
      className="booking-details-action"
      aria-label="Booking management actions"
    >
      {/* Left: Back Navigation */}

      <div className="booking-details-action__navigation">
        <button
          type="button"
          onClick={() => navigate("/rent-bookings")}
          className="booking-action-btn booking-action-btn--back"
          aria-label="Back to bookings"
        >
          <ArrowLeft size={18} aria-hidden="true" />

          <span>Back to Bookings</span>
        </button>
      </div>

      {/* Right: Booking Actions */}

      <div className="booking-details-action__buttons">
        {/* Edit Booking */}

        <button
          type="button"
          onClick={() =>
            navigate(`/rent-bookings/edit/${bookingId}`)
          }
          disabled={updating || !bookingId}
          className="booking-action-btn booking-action-btn--edit"
        >
          <Pencil size={17} aria-hidden="true" />

          <span>Edit Booking</span>
        </button>

        {/* Pending Booking */}

        {status === "pending" && (
          <>
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={updating}
              className="booking-action-btn booking-action-btn--success"
            >
              {updating ? (
                <LoaderCircle
                  size={18}
                  className="booking-action-btn__spinner"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2 size={18} aria-hidden="true" />
              )}

              <span>
                {updating ? "Confirming..." : "Confirm Booking"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              disabled={updating}
              className="booking-action-btn booking-action-btn--danger"
            >
              <XCircle size={18} aria-hidden="true" />

              <span>Cancel Booking</span>
            </button>
          </>
        )}

        {/* Confirmed Booking */}

        {status === "confirmed" && (
          <>
            <button
              type="button"
              onClick={handleOrderReturn}
              disabled={updating}
              className="booking-action-btn booking-action-btn--success"
            >
              {updating ? (
                <LoaderCircle
                  size={18}
                  className="booking-action-btn__spinner"
                  aria-hidden="true"
                />
              ) : (
                <RotateCcw size={18} aria-hidden="true" />
              )}

              <span>
                {updating ? "Processing..." : "Order Return"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              disabled={updating}
              className="booking-action-btn booking-action-btn--danger"
            >
              <XCircle size={18} aria-hidden="true" />

              <span>Cancel Booking</span>
            </button>
          </>
        )}

        {/* Return Requested */}

        {status === "return_requested" && (
          <button
            type="button"
            onClick={handleMarkAsReturned}
            disabled={updating}
            className="booking-action-btn booking-action-btn--success"
          >
            {updating ? (
              <LoaderCircle
                size={18}
                className="booking-action-btn__spinner"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2 size={18} aria-hidden="true" />
            )}

            <span>
              {updating ? "Updating..." : "Mark as Returned"}
            </span>
          </button>
        )}

        {/* Returned Booking */}

        {status === "returned" && (
          <button
            type="button"
            onClick={handleCompleteBooking}
            disabled={updating}
            className="booking-action-btn booking-action-btn--success"
          >
            {updating ? (
              <LoaderCircle
                size={18}
                className="booking-action-btn__spinner"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2 size={18} aria-hidden="true" />
            )}

            <span>
              {updating ? "Completing..." : "Complete Booking"}
            </span>
          </button>
        )}
      </div>

      {/* Cancellation Modal */}

      <CancelBooking
        open={showCancelModal}
        booking={cancellationBooking}
        onClose={() => {
          if (!updating) {
            setShowCancelModal(false);
          }
        }}
        onConfirm={handleCancelBooking}
      />
    </section>
  );
};

export default BookingsDetailsAction;
