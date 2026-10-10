
import {
  CalendarDays,
  Clock3,
  CalendarClock,
  Bookmark,
} from "lucide-react";

import "./BookingStats.css";

const BookingStats = ({ booking }) => {
  if (!booking) return null;

  const cards = [
    {
      id: "booking-id",
      icon: CalendarDays,
      iconBg: "violet",
      title: "Booking ID",
      value: booking.bookingId || "-",
      subtitle: "Booking Date & Time",
      subValue: booking.bookingDate || "-",
    },
    {
      id: "rental-duration",
      icon: Clock3,
      iconBg: "blue",
      title: "Rental Duration",
      value: booking.rentalDuration || "-",
      subtitle: "Rent Start Date",
      subValue: booking.rentStartDate || "-",
    },
    {
      id: "return-date",
      icon: CalendarClock,
      iconBg: "green",
      title: "Return Date",
      value: booking.returnDate || "-",
      subtitle: "Booking Type",
      subValue: booking.bookingType || "-",
    },
    {
      id: "last-updated",
      icon: Bookmark,
      iconBg: "orange",
      title: "Last Updated",
      value: booking.updatedAt || "-",
      subtitle: "Booked By",
      subValue: booking.bookedBy || "-",
    },
  ];

  return (
    <div className="booking-stats">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.id}
            className="booking-stats__card"
          >
            {/* Card Content */}
            <div className="booking-stats__content">
              {/* Icon */}
              <div
                className={`booking-stats__icon booking-stats__icon--${card.iconBg}`}
                aria-hidden="true"
              >
                <Icon size={22} strokeWidth={2} />
              </div>

              {/* Information */}
              <div className="booking-stats__details">
                <p className="booking-stats__label">
                  {card.title}
                </p>

                <h3 className="booking-stats__value">
                  {card.value}
                </h3>

                {/* Secondary Information */}
                <div className="booking-stats__secondary">
                  <p className="booking-stats__subtitle">
                    {card.subtitle}
                  </p>

                  <p className="booking-stats__subvalue">
                    {card.subValue}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default BookingStats;
