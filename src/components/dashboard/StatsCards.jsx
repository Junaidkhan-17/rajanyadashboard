
import { useEffect, useState } from "react";
import {
  Package,
  Grid3X3,
  Sparkles,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import "./StatsCards.css";

const defaultStats = {
  products: {
    total: 0,
  },
  categories: {
    total: 0,
  },
  virtualTryOn: {
    requests: 0,
    revenue: 0,
  },
};

const statConfig = [
  {
    key: "products",
    title: "Total Products",
    icon: Package,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    getValue: (data) => data.products.total,
    getLabel: () => "Live Products",
  },
  {
    key: "categories",
    title: "Total Categories",
    icon: Grid3X3,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    getValue: (data) => data.categories.total,
    getLabel: () => "Live Categories",
  },
  {
    key: "virtualTryOn",
    title: "Virtual Try-On Requests",
    icon: Sparkles,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    getValue: (data) => data.virtualTryOn.requests,
    getLabel: () => "Live Requests",
  },
  {
    key: "virtualTryOnRevenue",
    title: "Virtual Try-On Revenue",
    icon: IndianRupee,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    getValue: (data) => data.virtualTryOn.revenue,
    getLabel: () => "Verified Payments",
  },
];

const formatRevenue = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function StatsCards() {
  const [dashboardStats, setDashboardStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/stats");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to fetch dashboard statistics"
        );
      }

      const stats = response.data.stats || {};

      setDashboardStats({
        products: {
          ...defaultStats.products,
          ...stats.products,
        },
        categories: {
          ...defaultStats.categories,
          ...stats.categories,
        },
        virtualTryOn: {
          ...defaultStats.virtualTryOn,
          ...stats.virtualTryOn,
        },
      });
    } catch (err) {
      console.error("Dashboard Stats Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <section className="stats-cards-section">
      {error && !loading && (
        <div className="stats-error">
          <div className="stats-error-content">
            <p className="stats-error-title">
              Unable to load dashboard statistics.
            </p>

            <p className="stats-error-message">{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardStats}
            className="stats-retry-button"
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>
      )}

      <div className="stats-cards-grid">
        {statConfig.map((item) => {
          const Icon = item.icon;
          const rawValue = item.getValue(dashboardStats);

          const displayValue =
            item.key === "virtualTryOnRevenue"
              ? formatRevenue(rawValue)
              : Number(rawValue) || 0;

          return (
            <article className="stats-card" key={item.key}>
              <div
                className="stats-card-decoration"
                aria-hidden="true"
              />

              <div className="stats-card-content">
                <div
                  className={`stats-card-icon ${item.iconBg}`}
                  aria-hidden="true"
                >
                  <Icon
                    size={25}
                    strokeWidth={2}
                    className={item.iconColor}
                  />
                </div>

                <div className="stats-card-information">
                  <p className="stats-card-title">{item.title}</p>

                  {loading ? (
                    <div
                      className="stats-card-skeleton"
                      aria-label={`Loading ${item.title}`}
                    >
                      <div className="stats-skeleton-value" />
                      <div className="stats-skeleton-label" />
                    </div>
                  ) : (
                    <>
                      <h2
                        className="stats-card-value"
                        title={String(displayValue)}
                      >
                        {displayValue}
                      </h2>

                      <p className="stats-card-label">
                        {item.getLabel()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
