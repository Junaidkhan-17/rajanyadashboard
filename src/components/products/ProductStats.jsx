import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Triangle,
  Star,
  Package,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";
import "./ProductStats.css";

export default function ProductStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesUsed: 0,
    featuredProducts: 0,
    activeProducts: 0,
    productsThisMonth: 0,
    featuredThisMonth: 0,
    activePercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH PRODUCT STATISTICS
  ========================================================= */

  const fetchProductStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/stats");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to fetch product statistics.",
        );
      }

      const productStats = response.data?.stats || {};

      setStats({
        totalProducts: Number(productStats.totalProducts) || 0,
        categoriesUsed: Number(productStats.categoriesUsed) || 0,
        featuredProducts:
          Number(productStats.featuredProducts) || 0,
        activeProducts:
          Number(productStats.activeProducts) || 0,
        productsThisMonth:
          Number(productStats.productsThisMonth) || 0,
        featuredThisMonth:
          Number(productStats.featuredThisMonth) || 0,
        activePercentage:
          Number(productStats.activePercentage) || 0,
      });
    } catch (requestError) {
      console.error(
        "Product Statistics Error:",
        requestError,
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load product statistics.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchProductStats();
  }, []);

  /* =========================================================
     FORMAT NUMBER
  ========================================================= */

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <section
        className="product-stats"
        aria-label="Product statistics loading"
      >
        <div
          className="product-stats-state"
          role="status"
          aria-live="polite"
        >
          <span
            className="product-stats-spinner"
            aria-hidden="true"
          />

          <span>Loading product statistics...</span>
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error) {
    return (
      <section
        className="product-stats"
        aria-label="Product statistics"
      >
        <div
          className="product-stats-state product-stats-error"
          role="alert"
        >
          <span className="product-stats-error-message">
            {error}
          </span>

          <button
            type="button"
            className="product-stats-retry"
            onClick={fetchProductStats}
          >
            <RefreshCw
              size={14}
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>Retry</span>
          </button>
        </div>
      </section>
    );
  }

  /* =========================================================
     STAT CARDS
  ========================================================= */

  const cards = [
    {
      id: "total-products",
      label: "Total Products",
      value: stats.totalProducts,
      subText: `+${stats.productsThisMonth} This Month`,
      subClass: "green",
      icon: ShoppingBag,
      iconClass: "purple",
    },
    {
      id: "categories-used",
      label: "Categories Used",
      value: stats.categoriesUsed,
      subText: "Active Categories",
      subClass: "orange",
      icon: Triangle,
      iconClass: "orange",
    },
    {
      id: "featured-products",
      label: "Featured Products",
      value: stats.featuredProducts,
      subText: `+${stats.featuredThisMonth} This Month`,
      subClass: "green",
      icon: Star,
      iconClass: "green",
    },
    {
      id: "active-products",
      label: "Active Products",
      value: stats.activeProducts,
      subText: `${stats.activePercentage}% of Total`,
      subClass: "blue",
      icon: Package,
      iconClass: "blue",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className="product-stats"
      aria-label="Product statistics"
    >
      <div className="product-stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.id}
              className="product-stat-card"
            >
              {/* ICON */}

              <div
                className={`product-stat-icon product-stat-icon-${card.iconClass}`}
                aria-hidden="true"
              >
                <Icon
                  size={24}
                  strokeWidth={2}
                />
              </div>

              {/* CONTENT */}

              <div className="product-stat-content">
                <p className="product-stat-label">
                  {card.label}
                </p>

                <h3 className="product-stat-value">
                  {formatNumber(card.value)}
                </h3>

                <p
                  className={`product-stat-subtext product-stat-subtext-${card.subClass}`}
                >
                  {card.subText}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}