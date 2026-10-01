import { useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./RecentBookingsTable.css";

export default function RecentBookingsTable() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ========================================
  FORMAT DATE
  ========================================
  */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return {
        date: "—",
        time: "",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        date: "—",
        time: "",
      };
    }

    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  /*
  ========================================
  GET CUSTOMER NAME
  ========================================
  */

  const getCustomerName = (user) => {
    if (!user) {
      return "Unknown Customer";
    }

    if (user.fullName?.trim()) {
      return user.fullName.trim();
    }

    const fullName = [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return fullName || "Unknown Customer";
  };

  /*
  ========================================
  GET CUSTOMER INITIAL
  ========================================
  */

  const getCustomerInitial = (user) => {
    const name = getCustomerName(user);

    return name.charAt(0).toUpperCase() || "U";
  };

  /*
  ========================================
  NORMALIZE STATUS
  ========================================
  */

  const normalizeStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    const normalized = String(status)
      .trim()
      .toLowerCase()
      .replace(/[_\s-]+/g, "");

    switch (normalized) {
      case "confirmed":
        return "Confirmed";

      case "pending":
        return "Pending";

      case "active":
        return "Active";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      case "canceled":
        return "Cancelled";

      case "rejected":
        return "Rejected";

      case "returned":
        return "Returned";

      case "ongoing":
        return "Active";

      default:
        return String(status)
          .trim()
          .replace(/^./, (character) =>
            character.toUpperCase()
          );
    }
  };

  /*
  ========================================
  FETCH BOOKINGS
  ========================================
  */

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to fetch bookings."
        );
      }

      const bookingData = Array.isArray(
        response.data?.bookings
      )
        ? response.data.bookings
        : [];

      /*
      ========================================
      BACKEND ALREADY SORTS BY createdAt DESC.

      We still normalize the data here so the
      component remains safe if the response
      contains missing fields.
      ========================================
      */

      const normalizedBookings = bookingData
        .map((booking) => ({
          id: booking._id,

          bookingId:
            booking.bookingId ||
            `#${String(booking._id || "").slice(-8)}`,

          customer: {
            name: getCustomerName(booking.user),
            email: booking.user?.email || "—",
            phone: booking.user?.mobileNumber || "",
          },

          product: {
            name:
              booking.product?.productName ||
              "Unknown Product",

            image:
              booking.product?.productImage || "",
          },

          rentDate: booking.rental?.startDate || null,

          returnDate: booking.rental?.returnDate || null,

          status: normalizeStatus(
            booking.bookingStatus
          ),

          createdAt: booking.createdAt || null,
        }))
        .filter((booking) => booking.id);

      setBookings(normalizedBookings.slice(0, 6));
    } catch (requestError) {
      console.error(
        "Recent Bookings Error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load recent bookings."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  INITIAL FETCH
  ========================================
  */

  useEffect(() => {
    fetchBookings();
  }, []);

  /*
  ========================================
  VIEW BOOKING
  ========================================
  */

  const handleBookingClick = (bookingId) => {
    if (!bookingId) {
      return;
    }

    navigate(`/rent-bookings/${bookingId}`);
  };

  /*
  ========================================
  VIEW ALL
  ========================================
  */

  const handleViewAll = () => {
    navigate("/rent-bookings");
  };

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <section className="recent-bookings-card">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="recent-bookings-header">
        <div className="recent-bookings-heading">
          <div className="recent-bookings-heading-icon">
            <CalendarDays size={16} />
          </div>

          <div>
            <h2>Recent Rent Bookings</h2>

            <p>
              Latest customer rental activity
            </p>
          </div>
        </div>

        <button
          type="button"
          className="recent-bookings-view-all"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="recent-bookings-content">
        {/* ========================================
            LOADING
        ======================================== */}

        {loading && (
          <div className="recent-bookings-state">
            <div className="recent-bookings-spinner"></div>

            <p>Loading recent bookings...</p>
          </div>
        )}

        {/* ========================================
            ERROR
        ======================================== */}

        {!loading && error && (
          <div className="recent-bookings-state recent-bookings-error">
            <p>{error}</p>

            <button
              type="button"
              className="recent-bookings-retry"
              onClick={fetchBookings}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* ========================================
            EMPTY
        ======================================== */}

        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="recent-bookings-state">
              <div className="recent-bookings-empty-icon">
                <CalendarDays size={20} />
              </div>

              <p>No bookings found.</p>
            </div>
          )}

        {/* ========================================
            DESKTOP / TABLET TABLE
        ======================================== */}

        {!loading &&
          !error &&
          bookings.length > 0 && (
            <div className="recent-bookings-table-wrapper">
              <table className="recent-bookings-table">
                <thead>
                  <tr>
                    <th className="booking-id-column">
                      Booking ID
                    </th>

                    <th className="customer-column">
                      Customer
                    </th>

                    <th className="product-column">
                      Product
                    </th>

                    <th className="date-column">
                      Rent Date
                    </th>

                    <th className="status-column">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((item) => {
                    const formattedDate = formatDate(
                      item.rentDate
                    );

                    return (
                      <tr
                        key={item.id}
                        onClick={() =>
                          handleBookingClick(item.id)
                        }
                        tabIndex={0}
                        role="button"
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();

                            handleBookingClick(
                              item.id
                            );
                          }
                        }}
                      >
                        {/* ========================================
                            BOOKING ID
                        ======================================== */}

                        <td>
                          <p className="booking-id">
                            #{item.bookingId.replace(
                              /^#/,
                              ""
                            )}
                          </p>
                        </td>

                        {/* ========================================
                            CUSTOMER
                        ======================================== */}

                        <td>
                          <div className="booking-customer">
                            <div className="booking-customer-avatar">
                              {getCustomerInitial(
                                item.customer
                              )}
                            </div>

                            <div className="booking-customer-info">
                              <p className="booking-customer-name">
                                {item.customer.name}
                              </p>

                              <p className="booking-customer-email">
                                {item.customer.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ========================================
                            PRODUCT
                        ======================================== */}

                        <td>
                          <div className="booking-product">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="booking-product-image"
                              />
                            ) : (
                              <div className="booking-product-placeholder">
                                <CalendarDays size={15} />
                              </div>
                            )}

                            <p>
                              {item.product.name}
                            </p>
                          </div>
                        </td>

                        {/* ========================================
                            RENT DATE
                        ======================================== */}

                        <td>
                          <div className="booking-date">
                            <span>
                              {formattedDate.date}
                            </span>

                            {formattedDate.time && (
                              <small>
                                {formattedDate.time}
                              </small>
                            )}
                          </div>
                        </td>

                        {/* ========================================
                            STATUS
                        ======================================== */}

                        <td>
                          <div className="booking-status-wrapper">
                            <span
                              className={`booking-status booking-status-${item.status
                                .toLowerCase()
                                .replace(
                                  /[^a-z0-9]+/g,
                                  "-"
                                )}`}
                            >
                              <span className="booking-status-dot"></span>

                              {item.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </section>
  );
}