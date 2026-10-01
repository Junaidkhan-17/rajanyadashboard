import {
  ImagePlus,
  Clock3,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from "lucide-react";

import "./TryStatsOn.css";

export default function TryStatsOn({ stats }) {
  const cards = [
    {
      title: "Total Try-On Requests",
      value: stats?.totalRequests || 0,
      sub: "+11.3% vs last month",
      color: "purple",
      icon: <ImagePlus size={22} strokeWidth={2} />,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests || 0,
      sub: "+8.4% vs last month",
      color: "orange",
      icon: <Clock3 size={22} strokeWidth={2} />,
    },
    {
      title: "Completed Requests",
      value: stats?.completedRequests || 0,
      sub: "+15.3% vs last month",
      color: "green",
      icon: <CheckCircle2 size={22} strokeWidth={2} />,
    },
    {
      title: "Failed Requests",
      value: stats?.failedRequests || 0,
      sub: "-4.2% vs last month",
      color: "red",
      icon: <XCircle size={22} strokeWidth={2} />,
    },
    {
      title: "Revenue Generated",
      value: `₹${stats?.revenue || 0}`,
      sub: "+18.7% vs last month",
      color: "blue",
      icon: <IndianRupee size={22} strokeWidth={2} />,
    },
  ];

  const colorClasses = {
    purple: {
      bg: "try-stats-on__icon--purple",
      text: "try-stats-on__icon-color--purple",
    },
    orange: {
      bg: "try-stats-on__icon--orange",
      text: "try-stats-on__icon-color--orange",
    },
    green: {
      bg: "try-stats-on__icon--green",
      text: "try-stats-on__icon-color--green",
    },
    red: {
      bg: "try-stats-on__icon--red",
      text: "try-stats-on__icon-color--red",
    },
    blue: {
      bg: "try-stats-on__icon--blue",
      text: "try-stats-on__icon-color--blue",
    },
  };

  return (
    <div className="try-stats-on">
      {cards.map((card, index) => {
        const color = colorClasses[card.color];

        return (
          <article
            key={index}
            className="try-stats-on__card"
          >
            <div className="try-stats-on__content">
              {/* =================================================
                  ICON
                  ================================================= */}

              <div
                className={`try-stats-on__icon-wrapper ${color.bg}`}
                aria-hidden="true"
              >
                <div
                  className={`try-stats-on__icon ${color.text}`}
                >
                  {card.icon}
                </div>
              </div>

              {/* =================================================
                  STAT CONTENT
                  ================================================= */}

              <div className="try-stats-on__details">
                <p className="try-stats-on__title">
                  {card.title}
                </p>

                <h3 className="try-stats-on__value">
                  {card.value}
                </h3>

                <p className="try-stats-on__sub">
                  {card.sub}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}