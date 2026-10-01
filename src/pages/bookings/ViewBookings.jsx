import { useEffect, useState } from "react";

import { useParams, NavLink } from "react-router-dom";
import { getBookingById } from "../../services/bookingService";
import CustomerInfoCard from "../../components/viewBookings/CustomerInfoCard";
import ProductInfoCard from "../../components/viewBookings/ProductInfoCard";
import RentalInfoCard from "../../components/viewBookings/RentalInfoCard";
import BookingsDetailsAction from "../../components/viewBookings/BookingsDetailsAction";

import CancelInfoCard from "../../components/viewBookings/CancelInfoCard";
import BookingStats from "../../components/viewBookings/BookingStats";


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

const ViewBookings = () => {
  // Dummy Data
  const { id } = useParams();

const [booking, setBooking] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchBooking = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getBookingById(id);

    console.log(
      "BOOKING DETAILS API RESPONSE:",
      response
    );

    const bookingData =
      response?.booking ||
      response?.data ||
      response;

    if (!bookingData?._id) {
      throw new Error("Booking not found.");
    }

    const normalizedBooking = {
      _id: bookingData._id,

      bookingId:
        bookingData.bookingId || "-",

      bookingStatus:
        bookingData.bookingStatus || "pending",

      bookingDate: formatDateTime(
        bookingData.createdAt
      ),

      updatedAt: formatDateTime(
        bookingData.updatedAt
      ),

      rentalDuration:
        bookingData.product?.rentalDuration
          ? `${bookingData.product.rentalDuration} Days`
          : "-",

      rentStartDate: formatDate(
        bookingData.rental?.startDate
      ),

      returnDate: formatDate(
        bookingData.rental?.returnDate
      ),

      bookingType: "-",

      bookedBy:
        bookingData.user?.fullName || "-",

      customer: {
        name:
          bookingData.user?.fullName || "-",

        phone:
          bookingData.user?.mobileNumber || "-",

        email:
          bookingData.user?.email || "-",

        city:
          bookingData.address?.city || "-",

        state:
          bookingData.address?.state || "-",

        pin:
          bookingData.address?.pinCode || "-",
      },

      product: {
        image:
          bookingData.product?.productImage || "",

        name:
          bookingData.product?.productName || "-",

        category:
          bookingData.product?.productCategory || "-",

        collection:
          bookingData.product?.productBrand || "-",

        size:
          bookingData.product?.selectedSize || "-",

        sku:
          bookingData.product?.sku || "-",
      },

      rental: {
        duration:
          bookingData.product?.rentalDuration
            ? `${bookingData.product.rentalDuration} Days`
            : "-",

        requestDate: formatDate(
          bookingData.rental?.startDate
        ),

        returnDate: formatDate(
          bookingData.rental?.returnDate
        ),

        advanceNotice: "-",

        available: false,

        instructions: "-",
      },

      cancelInfo: {
        cancelledBy: "-",

        cancelledOn: "-",

        reason:
          bookingData.cancellationReason || "-",

        notes:
          bookingData.admin?.notes || "-",
      },

      rawBooking: bookingData,
    };

    setBooking(normalizedBooking);
  } catch (error) {
    console.error(
      "Failed to fetch booking details:",
      error
    );

    setError(
      error.response?.data?.message ||
        error.message ||
        "Failed to load booking details."
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (id) {
    fetchBooking();
  }
}, [id]);

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

  const currentStatus =
  statusConfig[booking?.bookingStatus] || {
    label: booking?.bookingStatus || "Unknown",
    badge: "bg-slate-100 text-slate-600",
  };

  if (loading) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <p className="text-slate-500">
        Loading booking details...
      </p>
    </div>
  );
}

if (error) {
  return (
    <div className="bg-white rounded-2xl border border-red-200 p-10 text-center">
      <p className="text-red-500 font-medium">
        {error}
      </p>

      <NavLink
        to="/rent-bookings"
        className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-slate-800 transition"
      >
        Back to Bookings
      </NavLink>
    </div>
  );
}

if (!booking) {
  return null;
}

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
        <NavLink to="/" className="hover:text-black whitespace-nowrap">
          Dashboard
        </NavLink>
        <span>›</span>
        <NavLink to="/rent-bookings" className="hover:text-black whitespace-nowrap">
          Rent Bookings
        </NavLink>
        <span>›</span>

        <span className="font-semibold text-slate-900 whitespace-nowrap">
          Booking Details
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Booking Details
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
            View complete booking information and customer details.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-400">Booking Status</p>

            <span
              className={`inline-flex mt-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold ${currentStatus.badge}`}
            >
              {currentStatus.label}
            </span>
          </div>
        </div>
      </div>

      <BookingStats booking={booking} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <CustomerInfoCard booking={booking} />
        <ProductInfoCard booking={booking} />
        <RentalInfoCard booking={booking} />
      </div>

      {booking.bookingStatus === "cancelled" && (
  <CancelInfoCard booking={booking} />
)}

      <BookingsDetailsAction
  booking={booking}
  onBookingUpdated={fetchBooking}
/>
    </div>
  );
};

export default ViewBookings;