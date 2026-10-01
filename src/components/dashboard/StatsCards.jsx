import { useEffect, useState } from "react";
import {
  Package,
  Grid3X3,
  Sparkles,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

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

const formatRevenue = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

export default function StatsCards() {
  const [dashboardStats, setDashboardStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/stats");

      if (response.data?.success) {
        setDashboardStats({
          ...defaultStats,
          ...response.data.stats,
          products: {
            ...defaultStats.products,
            ...response.data.stats?.products,
          },
          categories: {
            ...defaultStats.categories,
            ...response.data.stats?.categories,
          },
          virtualTryOn: {
            ...defaultStats.virtualTryOn,
            ...response.data.stats?.virtualTryOn,
          },
        });
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch dashboard statistics",
        );
      }
    } catch (err) {
      console.error("Dashboard Stats Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <section className="w-full">
      {/* Error State */}
      {error && !loading && (
        <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-red-700">
              Unable to load dashboard statistics.
            </p>

            <p className="mt-0.5 break-words text-xs text-red-500">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardStats}
            className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-md active:scale-[0.98]"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid w-full grid-cols-2 gap-3 xl:grid-cols-4">
        {statConfig.map((item) => {
          const Icon = item.icon;

          const rawValue = item.getValue(dashboardStats);

          const displayValue =
            item.key === "virtualTryOnRevenue"
              ? formatRevenue(rawValue)
              : Number(rawValue) || 0;

          return (
            <div
              key={item.title}
              className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-md
                sm:p-4
                lg:p-5
              "
            >
              {/* Decorative Background */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  bg-slate-50
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:scale-125
                  group-hover:opacity-100
                "
              />

              <div className="relative flex min-w-0 items-center gap-3 sm:gap-4 lg:gap-5">
                {/* Icon */}
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    transition-transform
                    duration-300
                    group-hover:scale-105
                    sm:h-14
                    sm:w-14
                    ${item.iconBg}
                  `}
                >
                  <Icon
                    size={24}
                    strokeWidth={2}
                    className={`${item.iconColor} sm:h-7 sm:w-7`}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
                    {item.title}
                  </p>

                  {loading ? (
                    <>
                      <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-slate-100 sm:h-9" />

                      <div className="mt-2 h-4 w-20 animate-pulse rounded-md bg-slate-100" />
                    </>
                  ) : (
                    <>
                      <h2
                        className="
                          mt-1
                          truncate
                          text-2xl
                          font-bold
                          leading-tight
                          tracking-tight
                          text-slate-900
                          sm:text-3xl
                        "
                        title={String(displayValue)}
                      >
                        {displayValue}
                      </h2>

                      <p className="mt-1.5 truncate text-xs font-medium text-green-500 sm:text-sm">
                        {item.getLabel()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}