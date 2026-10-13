import { NavLink } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

import EditCustomerInfo from "../../components/EditBookings/EditCustomerInfo";
import EditProductInfo from "../../components/EditBookings/EditProductInfo";
import EditRentalInfo from "../../components/EditBookings/EditRentalInfo";
import EditBookStatusNote from "../../components/EditBookings/EditBookStatusNote";
import EditActionButtons from "../../components/EditBookings/EditActionButtons";
import CancelBooking from "../../components/delete/CancelBooking";

import "./EditBookings.css";

const EditBookings = () => {
  const [booking, setBooking] = useState({
    bookingId: "RB-001248",
    bookingStatus: "Cancelled",

    customer: {
      name: "Priya Sharma",
      phone: "+91 9876543210",
      email: "priya.sharma@email.com",
      city: "Mumbai",
      state: "Maharashtra",
      pin: "400001",
    },

    product: {
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      name: "Bridal Lehenga",
      category: "Bridal Wear",
      size: "M (Medium)",
      sku: "BRD-LEH-001",
    },

    rental: {
      duration: "5 Days",
      rentDate: "15 Aug 2025",
      returnDate: "20 Aug 2025",
      notice: "3",
      availability: "Available",
    },

    cancelInfo: {
      cancelledBy: "Admin Rajanya",
      cancelledOn: "16 Aug 2025, 02:30 PM",
      reason: "Outfit not available on requested dates.",
      notes: "Customer informed via WhatsApp.",
    },
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleSave = async () => {
    try {
      // Demo implementation: replace this with the booking update API
      // when connecting this page to the backend.
      console.log("Booking Payload =>", booking);

      toast.success("Booking Updated Successfully");
    } catch (error) {
      console.error("Failed to update booking:", error);
      toast.error("Failed to update booking. Please try again.");
    }
  };

  const handleCancelConfirm = (data) => {
    setBooking((prev) => ({
      ...prev,
      bookingStatus: "Cancelled",
      cancelInfo: {
        cancelledBy: "Admin Rajanya",
        cancelledOn: new Date().toLocaleString(),
        reason: data.reason,
        notes: data.remark,
      },
    }));

    setShowCancelModal(false);
    toast.success("Booking cancelled successfully");
  };

  return (
    <div className="edit-bookings-page space-y-3 px-3 sm:px-4 lg:px-0">
      {/* Breadcrumb */}
      <div className="edit-bookings-breadcrumb text-sm text-gray-500">
        <NavLink
          to="/"
          className="text-pink-500 hover:text-pink-600"
        >
          Dashboard
        </NavLink>

        <span className="mx-2">/</span>

        <NavLink
          to="/bookings"
          className="hover:text-gray-700"
        >
          Bookings
        </NavLink>

        <span className="mx-2">/</span>

        <span className="font-medium text-gray-800">
          Edit Booking
        </span>
      </div>

      {/* Page Header */}
      <div className="edit-bookings-header flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="edit-bookings-heading">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Booking
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update booking details and manage booking status.
          </p>
        </div>

        {/* Booking ID */}
        <div className="edit-booking-id-card flex items-center gap-3 rounded-xl border border-pink-100 bg-pink-50 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
            <CalendarDays size={22} />
          </div>

          <div className="edit-booking-id-content min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Booking ID
            </p>

            <p className="break-words text-base font-semibold text-gray-900">
              {booking.bookingId}
            </p>
          </div>
        </div>
      </div>

      {/* Customer and Product Information */}
      <div className="edit-bookings-grid grid grid-cols-1 gap-4 md:grid-cols-2">
        <EditCustomerInfo
          booking={booking}
          setBooking={setBooking}
        />

        <EditProductInfo
          booking={booking}
          setBooking={setBooking}
        />
      </div>

      {/* Rental and Booking Status Information */}
      <div className="edit-bookings-grid grid grid-cols-1 gap-4 md:grid-cols-2">
        <EditRentalInfo
          booking={booking}
          setBooking={setBooking}
        />

        <EditBookStatusNote
          booking={booking}
          setBooking={setBooking}
        />
      </div>

      {/* Action Buttons */}
      <div className="edit-bookings-actions">
        <EditActionButtons
          booking={booking}
          setBooking={setBooking}
          onSave={handleSave}
          onCancelBooking={() => setShowCancelModal(true)}
        />
      </div>

      {/* Cancellation Modal */}
      <CancelBooking
        open={showCancelModal}
        booking={booking}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default EditBookings;