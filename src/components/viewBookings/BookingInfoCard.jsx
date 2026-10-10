
import {
  Bookmark,
  Clock,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";

import "./BookingInfoCard.css";

const BookingInfoCards = ({ booking }) => {
  if (!booking) return null;

  const cards = [
    {
      id: "booking-id",
      icon: Bookmark,
      theme: "purple",
      label: "Booking ID",
      value: booking.bookingId,
      subLabel: "Booking Date & Time",
      subValue: booking.bookingDateTime,
    },
    {
      id: "rental-duration",
      icon: Clock,
      theme: "blue",
      label: "Rental Duration",
      value: booking.duration,
      subLabel: "Rent Start Date",
      subValue: booking.rentDate,
    },
    {
      id: "return-date",
      icon: CalendarCheck,
      theme: "green",
      label: "Return Date",
      value: booking.returnDate,
      subLabel: "Booking Type",
      subValue: booking.bookingType || "Free Book (Enquiry)",
    },
    {
      id: "last-updated",
      icon: Bookmark,
      theme: "orange",
      label: "Last Updated",
      value: booking.lastUpdated,
      subLabel: "Booked By",
      subValue: booking.bookedBy || "Website (Enquiry Form)",
    },
  ];

  return (
    <section
      className="booking-info-cards"
      aria-label="Booking information"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.id}
            className={`booking-info-card booking-info-card--${card.theme}`}
          >
            <div className="booking-info-card__top">
              <div className="booking-info-card__identity">
                <div className="booking-info-card__icon">
                  <Icon size={19} strokeWidth={2} aria-hidden="true" />
                </div>

                <div className="booking-info-card__heading">
                  <p className="booking-info-card__label">
                    {card.label}
                  </p>

                  <p
                    className="booking-info-card__value"
                    title={
                      card.value != null
                        ? String(card.value)
                        : undefined
                    }
                  >
                    {card.value || "—"}
                  </p>
                </div>
              </div>

              <span className="booking-info-card__accent">
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
            </div>

            <div className="booking-info-card__divider" />

            <div className="booking-info-card__footer">
              <p className="booking-info-card__sub-label">
                {card.subLabel}
              </p>

              <p
                className="booking-info-card__sub-value"
                title={
                  card.subValue != null
                    ? String(card.subValue)
                    : undefined
                }
              >
                {card.subValue || "—"}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default BookingInfoCards;
