import { useEffect, useCallback, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

import { getBookingById } from "../../services/bookingService";

import CustomerInfoCard from "../../components/viewBookings/CustomerInfoCard";
import ProductInfoCard from "../../components/viewBookings/ProductInfoCard";
import RentalInfoCard from "../../components/viewBookings/RentalInfoCard";
import BookingsDetailsAction from "../../components/viewBookings/BookingsDetailsAction";
import CancelInfoCard from "../../components/viewBookings/CancelInfoCard";
import BookingStats from "../../components/viewBookings/BookingStats";

import "./ViewBookings.css";

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const statusConfig = {
  pending: {
    label: "Pending",
    badge: "bg-blue-100 text-blue-700",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-green-100 text-green-700",
  },
  ready_for_dispatch: {
    label: "Ready For Dispatch",
    badge: "bg-indigo-100 text-indigo-700",
  },
  dispatched: {
    label: "Dispatched",
    badge: "bg-purple-100 text-purple-700",
  },
  delivered: {
    label: "Delivered",
    badge: "bg-cyan-100 text-cyan-700",
  },
  rental_active: {
    label: "Rental Active",
    badge: "bg-orange-100 text-orange-700",
  },
  return_requested: {
    label: "Return Requested",
    badge: "bg-yellow-100 text-yellow-700",
  },
  returned: {
    label: "Returned",
    badge: "bg-teal-100 text-teal-700",
  },
  completed: {
    label: "Completed",
    badge: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-700",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-100 text-red-700",
  },
};

const ViewBookings = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooking = useCallback(async () => {
    if (!id) {
      setBooking(null);
      setError("Booking ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const response = await getBookingById(id);

      console.log("BOOKING DETAILS API RESPONSE:", response);

      const bookingData =
        response?.booking ||
        response?.data?.booking ||
        response?.data ||
        response;

      if (!bookingData?._id) {
        throw new Error("Booking not found.");
      }

      const rentalDuration = bookingData.product?.rentalDuration;

      const normalizedBooking = {
        _id: bookingData._id,

        bookingId: bookingData.bookingId || "-",

        bookingStatus: bookingData.bookingStatus || "pending",

        bookingDate: formatDateTime(bookingData.createdAt),

        updatedAt: formatDateTime(bookingData.updatedAt),

        rentalDuration: rentalDuration
          ? `${rentalDuration} Days`
          : "-",

        rentStartDate: formatDate(bookingData.rental?.startDate),

        returnDate: formatDate(bookingData.rental?.returnDate),

        bookingType: "-",

        bookedBy: bookingData.user?.fullName || "-",

        customer: {
          name: bookingData.user?.fullName || "-",
          phone: bookingData.user?.mobileNumber || "-",
          email: bookingData.user?.email || "-",
          city: bookingData.address?.city || "-",
          state: bookingData.address?.state || "-",
          pin: bookingData.address?.pinCode || "-",
        },

        product: {
          image: bookingData.product?.productImage || "",
          name: bookingData.product?.productName || "-",
          category: bookingData.product?.productCategory || "-",
          collection: bookingData.product?.productBrand || "-",
          size: bookingData.product?.selectedSize || "-",
          sku: bookingData.product?.sku || "-",
        },

        rental: {
          duration: rentalDuration
            ? `${rentalDuration} Days`
            : "-",

          requestDate: formatDate(bookingData.rental?.startDate),

          returnDate: formatDate(bookingData.rental?.returnDate),

          advanceNotice: "-",

          available: false,

          instructions: "-",
        },

        cancelInfo: {
          cancelledBy: "-",
          cancelledOn: "-",
          reason: bookingData.cancellationReason || "-",
          notes: bookingData.admin?.notes || "-",
        },

        rawBooking: bookingData,
      };

      setBooking(normalizedBooking);
    } catch (fetchError) {
      console.error("Failed to fetch booking details:", fetchError);

      setBooking(null);

      setError(
        fetchError.response?.data?.message ||
          fetchError.message ||
          "Failed to load booking details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const currentStatus = statusConfig[booking?.bookingStatus] || {
    label: booking?.bookingStatus || "Unknown",
    badge: "bg-slate-100 text-slate-600",
  };

  if (loading) {
    return (
      <div className="view-bookings-page space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-center">
          <p
            className="text-slate-500"
            role="status"
            aria-live="polite"
          >
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-bookings-page space-y-4">
        <div className="bg-white rounded-2xl border border-red-200 p-6 sm:p-10 text-center">
          <p className="text-red-500 font-medium" role="alert">
            {error}
          </p>

          <NavLink
            to="/rent-bookings"
            className="inline-flex items-center justify-center mt-5 min-h-11 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-slate-800 active:scale-[0.98] transition"
          >
            Back to Bookings
          </NavLink>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="view-bookings-page space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Breadcrumb */}
      <nav
        className="booking-breadcrumb flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500"
        aria-label="Breadcrumb"
      >
        <NavLink to="/" className="hover:text-black transition-colors">
          Dashboard
        </NavLink>

        <span aria-hidden="true">›</span>

        <NavLink
          to="/rent-bookings"
          className="hover:text-black transition-colors"
        >
          Rent Bookings
        </NavLink>

        <span aria-hidden="true">›</span>

        <span
          className="booking-breadcrumb-current font-semibold text-slate-900"
          aria-current="page"
        >
          Booking Details
        </span>
      </nav>

      {/* Header */}
      <header className="booking-details-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="booking-details-heading min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Booking Details
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
            View complete booking information and customer details.
          </p>
        </div>

        {/* Booking Status */}
        <div className="booking-status-container flex items-center gap-5">
          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-400">
              Booking Status
            </p>

            <span
              className={`inline-flex items-center mt-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold ${currentStatus.badge}`}
            >
              {currentStatus.label}
            </span>
          </div>
        </div>
      </header>

      {/* Booking Statistics */}
      <section aria-label="Booking statistics">
        <BookingStats booking={booking} />
      </section>

      {/* Customer, Product, and Rental Information */}
      <section
        className="booking-information-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        aria-label="Booking information"
      >
        <CustomerInfoCard booking={booking} />

        <ProductInfoCard booking={booking} />

        <RentalInfoCard booking={booking} />
      </section>

      {/* Cancellation Details */}
      {booking.bookingStatus === "cancelled" && (
        <section aria-label="Cancellation information">
          <CancelInfoCard booking={booking} />
        </section>
      )}

      {/* Existing Booking Actions */}
      <section aria-label="Booking actions">
        <BookingsDetailsAction
          booking={booking}
          onBookingUpdated={fetchBooking}
        />
      </section>
    </div>
  );
};

export default ViewBookings;