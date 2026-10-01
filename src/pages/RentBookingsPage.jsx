import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../services/bookingService";
import BookingsStats from "../components/bookings/Bookingstats";
import BookingFilters from "../components/bookings/BookingFilters";
import BookingTable from "../components/bookings/BookingTable";
import BookingPagination from "../components/bookings/BookingPagination";

const RentBookingsPage = () => {
  // Stats


  // Draft filter state (controlled by BookingFilters inputs)
  const [search, setSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState("All Booking Status");
  const [status, setStatus] = useState("All Status");
  const [method, setMethod] = useState("All Methods");
  const [dateRange, setDateRange] = useState("");

  // Filters actually applied to the table (only updates when Apply is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
  search: "",
  bookingStatus: "All Booking Status",
  status: "All Status",
  method: "All Methods",
  dateRange: "",
});

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [sortBy, setSortBy] = useState("latest");

  const [bookings, setBookings] = useState([]);
const [loadingBookings, setLoadingBookings] = useState(true);
const [bookingError, setBookingError] = useState("");

const stats = useMemo(() => {
  const totalBookings = bookings.length;

  const activeRentals = bookings.filter(
    (booking) => booking.status === "rental_active"
  ).length;

  const returnedOrders = bookings.filter(
    (booking) =>
      booking.status === "returned" ||
      booking.status === "completed"
  ).length;

  const rentalRevenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.amount || 0),
    0
  );

  return {
    totalBookings,
    activeRentals,
    returnedOrders,
    rentalRevenue: `₹${rentalRevenue.toLocaleString("en-IN")}`,
  };
}, [bookings]);


useEffect(() => {
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      setBookingError("");

      const response = await getBookings();

      console.log("ADMIN BOOKINGS API RESPONSE:", response);

      const bookingData =
  response?.bookings ||
  response?.data ||
  [];

const formattedBookings = Array.isArray(bookingData)
  ? bookingData.map((booking) => ({
      _id: booking._id,

      bookingId: booking.bookingId || "-",

      customer:
        booking.user?.fullName || "-",

      phone:
        booking.user?.mobileNumber || "-",

      product:
        booking.product?.productName || "-",

      image:
        booking.product?.productImage || "",

      duration:
        booking.product?.rentalDuration
          ? `${booking.product.rentalDuration} Days`
          : "-",

      rentDate:
        booking.rental?.startDate || "",

      returnDate:
        booking.rental?.returnDate || "",

      amount:
        booking.pricing?.totalAmount ?? 0,

      paymentMethod:
        booking.paymentMethod || "",

      status:
        booking.bookingStatus || "pending",

      paymentStatus:
        booking.paymentStatus || "pending",

      selectedSize:
        booking.product?.selectedSize || "-",

      rawBooking: booking,
    }))
  : [];

console.log(
  "FORMATTED ADMIN BOOKINGS:",
  formattedBookings
);

setBookings(formattedBookings);
    } catch (error) {
      console.error(
        "Failed to fetch bookings:",
        error
      );

      setBookingError(
        error.response?.data?.message ||
          "Failed to load bookings."
      );

      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  fetchBookings();
}, []);

  // parses "01 Aug 2025" style item dates
  const parseItemDate = (str) => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  // parses a single date piece like "01 Aug 2025" or "01/08/2025"
  const parseOneDate = (text) => {
    if (!text) return null;
    const trimmed = text.trim();

    let m = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) {
      const [, d, mo, y] = m;
      const date = new Date(Number(y), Number(mo) - 1, Number(d));
      if (!isNaN(date.getTime())) return date;
    }

    const fallback = new Date(trimmed);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

  // parses "01 Aug 2025 - 18 Aug 2025" (or a single date) coming from the filter input
  const parseFilterRange = (text) => {
    if (!text || !text.trim()) return { from: null, to: null };

    const rangeMatch = text.match(/^(.*\d{4})\s*-\s*(.*\d{4})$/);
    if (rangeMatch) {
      return {
        from: parseOneDate(rangeMatch[1]),
        to: parseOneDate(rangeMatch[2]),
      };
    }

    return { from: parseOneDate(text), to: null };
  };

  // Filter - now driven by appliedFilters, and includes date range matching against rentDate
  const filteredBookings = useMemo(() => {
  const { from, to } = parseFilterRange(
    appliedFilters.dateRange
  );

  const normalizedSearch =
    appliedFilters.search.trim().toLowerCase();

  return bookings.filter((item) => {
    /*
    ========================================
    Search
    Customer Name + Booking ID
    ========================================
    */

    const customerName =
      item.customer?.toLowerCase() || "";

    const bookingId =
      item.bookingId?.toLowerCase() || "";

    const searchMatch =
      customerName.includes(normalizedSearch) ||
      bookingId.includes(normalizedSearch);


      /*
========================================
Booking Status
========================================
*/

const selectedBookingStatus =
  appliedFilters.bookingStatus === "All Booking Status"
    ? ""
    : appliedFilters.bookingStatus
        .toLowerCase()
        .replace(/\s+/g, "_");

const bookingStatusMatch =
  appliedFilters.bookingStatus === "All Booking Status" ||
  item.status === selectedBookingStatus;

    /*
    ========================================
    Payment Status
    ========================================
    Backend values:
    pending
    paid
    failed
    refunded
    ========================================
    */

    const selectedPaymentStatus =
      appliedFilters.status === "All Status"
        ? ""
        : appliedFilters.status.toLowerCase();

    const paymentStatusMatch =
      appliedFilters.status === "All Status" ||
      item.paymentStatus === selectedPaymentStatus;

    /*
    ========================================
    Payment Method
    ========================================
    */

    const methodMatch =
      appliedFilters.method === "All Methods" ||
      item.paymentMethod?.toLowerCase() ===
        appliedFilters.method.toLowerCase();

    /*
    ========================================
    Rental Start Date
    ========================================
    */

    const itemDate = parseItemDate(item.rentDate);

    let dateMatch = true;

    if (from && to) {
      dateMatch =
        itemDate &&
        itemDate.getTime() >= from.getTime() &&
        itemDate.getTime() <= to.getTime();
    } else if (from) {
      dateMatch =
        itemDate &&
        itemDate.getFullYear() === from.getFullYear() &&
        itemDate.getMonth() === from.getMonth() &&
        itemDate.getDate() === from.getDate();
    }

    return (
  searchMatch &&
  bookingStatusMatch &&
  paymentStatusMatch &&
  methodMatch &&
  dateMatch
);
  });
}, [bookings, appliedFilters]);

  // Reset to page 1 whenever applied filters change
  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  // Slice bookings for current page
  const sortedBookings = useMemo(() => {
  const sorted = [...filteredBookings];

  sorted.sort((a, b) => {
    const dateA = new Date(a.rentDate).getTime();
    const dateB = new Date(b.rentDate).getTime();

    if (sortBy === "latest") {
      return dateB - dateA;
    }

    return dateA - dateB;
  });

  return sorted;
}, [filteredBookings, sortBy]);

const paginatedBookings = useMemo(() => {
  const startIdx = (page - 1) * pageSize;

  return sortedBookings.slice(
    startIdx,
    startIdx + pageSize
  );
}, [sortedBookings, page]);

  const handleApplyFilters = () => {
  setAppliedFilters({
    search,
    bookingStatus,
    status,
    method,
    dateRange,
  });
};

  const handleExport = () => {
    const headers = ["Booking ID", "Customer", "Product", "Amount", "Status"];

    const rows = filteredBookings.map((item) => [
      item.bookingId,
      item.customer,
      item.product,
      item.amount,
      item.status,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rent-bookings.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Rent Bookings</h1>

          <p className="text-slate-500 mt-2">
            Manage all dress rental bookings, schedules and returns.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-black hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition"
        >
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats */}
      <BookingsStats stats={stats} />

      {/* Filters */}
      <BookingFilters
        search={search}
        setSearch={setSearch}
        bookingStatus={bookingStatus}
        setBookingStatus={setBookingStatus}
        status={status}
        setStatus={setStatus}
        method={method}
        setMethod={setMethod}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApply={handleApplyFilters}
      />

      {/* Table */}
      {loadingBookings ? (
  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
    Loading bookings...
  </div>
) : bookingError ? (
  <div className="bg-white rounded-2xl border border-red-200 p-10 text-center text-red-500">
    {bookingError}
  </div>
) : (
  <BookingTable
  bookings={paginatedBookings}
  sortBy={sortBy}
  setSortBy={setSortBy}
/>
)}

      {/* Pagination */}
      <BookingPagination
        currentPage={page}
        totalItems={filteredBookings.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
};

export default RentBookingsPage;