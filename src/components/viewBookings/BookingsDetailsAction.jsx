import {
  ArrowLeft,
  Pencil,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import CancelBooking from "../delete/CancelBooking";
import { updateBooking } from "../../services/bookingService";

const BookingsDetailsAction = ({ booking, onBookingUpdated }) => {
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!booking) return null;

  const status = booking.bookingStatus;

  // ========================================
  // Confirm Booking
  // ========================================

  const handleConfirmBooking = async () => {
    try {
      setUpdating(true);

      const response = await updateBooking(booking._id, {
        bookingStatus: "confirmed",
      });

      console.log("BOOKING CONFIRMED:", response);

      toast.success("Booking confirmed successfully.");

      if (onBookingUpdated) {
        await onBookingUpdated();
      }

      setUpdating(false);
    } catch (error) {
      console.error("Failed to confirm booking:", error);

      toast.error(
        error.response?.data?.message || "Failed to confirm booking.",
      );

      setUpdating(false);
    }
  };

  // ========================================
  // Cancel Booking
  // ========================================

  const handleCancelBooking = async (data) => {
    try {
      setUpdating(true);

      const response = await updateBooking(booking._id, {
        bookingStatus: "cancelled",

        cancellationReason: data.reason || "",

        admin: {
          notes: data.remark || "",
        },
      });

      console.log("BOOKING CANCELLED:", response);

      toast.success("Booking cancelled successfully.");

      setShowCancelModal(false);

      if (onBookingUpdated) {
        await onBookingUpdated();
      }

      setUpdating(false);
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      toast.error(error.response?.data?.message || "Failed to cancel booking.");

      setUpdating(false);
    }
  };

  const handleOrderReturn = async () => {
    try {
      setUpdating(true);

      const response = await updateBooking(booking._id, {
        bookingStatus: "return_requested",
      });

      console.log("RETURN REQUESTED:", response);

      toast.success("Return request created successfully.");

      if (onBookingUpdated) {
        await onBookingUpdated();
      }
    } catch (error) {
      console.error("Failed to request return:", error);

      toast.error(error.response?.data?.message || "Failed to request return.");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsReturned = async () => {
    try {
      setUpdating(true);

      const response = await updateBooking(booking._id, {
        bookingStatus: "returned",
      });

      console.log("BOOKING RETURNED:", response);

      toast.success("Booking marked as returned successfully.");

      if (onBookingUpdated) {
        await onBookingUpdated();
      }
    } catch (error) {
      console.error("Failed to mark booking as returned:", error);

      toast.error(
        error.response?.data?.message || "Failed to mark booking as returned.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteBooking = async () => {
  try {
    setUpdating(true);

    const response = await updateBooking(booking._id, {
      bookingStatus: "completed",
    });

    console.log("BOOKING COMPLETED:", response);

    toast.success("Booking completed successfully.");

    if (onBookingUpdated) {
      await onBookingUpdated();
    }
  } catch (error) {
    console.error(
      "Failed to complete booking:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        "Failed to complete booking."
    );
  } finally {
    setUpdating(false);
  }
};

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
      {/* Left Button */}

      <button
        onClick={() => navigate("/rent-bookings")}
        className="h-11 px-5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition"
      >
        <ArrowLeft size={18} />
        Back to Bookings
      </button>

      {/* Right Buttons */}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Edit */}

        <button
          onClick={() =>
            navigate(`/rent-bookings/edit/${booking._id || booking.bookingId}`)
          }
          className="h-11 px-5 border border-rose-500 text-rose-600 rounded-xl hover:bg-rose-50 flex items-center gap-2 font-medium transition"
        >
          <Pencil size={17} />
          Edit Booking
        </button>

        {/* Pending */}

        {status === "pending" && (
          <>
            <button
              onClick={handleConfirmBooking}
              disabled={updating}
              className="h-11 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 font-medium transition"
            >
              <CheckCircle2 size={18} />

              {updating ? "Confirming..." : "Confirm Booking"}
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              disabled={updating}
              className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 font-medium transition"
            >
              <XCircle size={18} />
              Cancel Booking
            </button>
          </>
        )}

        {/* Confirmed */}

        {status === "confirmed" && (
          <>
            <button
              onClick={handleOrderReturn}
              disabled={updating}
              className="h-11 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 font-medium transition"
            >
              <RotateCcw size={18} />
              Order Return
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              disabled={updating}
              className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 font-medium transition"
            >
              <XCircle size={18} />
              Cancel Booking
            </button>
          </>
        )}

        {status === "return_requested" && (
          <button
            onClick={handleMarkAsReturned}
            disabled={updating}
            className="h-11 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 font-medium transition"
          >
            <CheckCircle2 size={18} />

            {updating ? "Updating..." : "Mark as Returned"}
          </button>
        )}

        {status === "returned" && (
  <button
    onClick={handleCompleteBooking}
    disabled={updating}
    className="h-11 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 font-medium transition"
  >
    <CheckCircle2 size={18} />

    {updating
      ? "Completing..."
      : "Complete Booking"}
  </button>
)}
      </div>

      <CancelBooking
        open={showCancelModal}
        booking={{
          ...booking,
          rentDate: booking.rentStartDate || booking.rental?.requestDate || "-",
          returnDate: booking.returnDate || booking.rental?.returnDate || "-",
        }}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
};

export default BookingsDetailsAction;
