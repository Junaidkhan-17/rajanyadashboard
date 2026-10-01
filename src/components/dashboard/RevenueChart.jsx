import { useEffect, useMemo, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Calendar, RefreshCw } from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import api from "../../services/api";

import "./RevenueChart.css";

// ============================================================
// Helpers
// ============================================================

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatAxisCurrency = (value) => {
  const numericValue = Number(value || 0);

  if (numericValue >= 10000000) {
    return `₹${(numericValue / 10000000).toFixed(1)}Cr`;
  }

  if (numericValue >= 100000) {
    return `₹${(numericValue / 100000).toFixed(1)}L`;
  }

  if (numericValue >= 1000) {
    return `₹${(numericValue / 1000).toFixed(1)}K`;
  }

  return `₹${numericValue}`;
};

const getDateFromParts = (year, month, day) => {
  return new Date(year, month - 1, day);
};

// ============================================================
// Custom Tooltip
// ============================================================

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const revenue = Number(payload[0]?.value || 0);

  return (
    <div className="revenue-chart-tooltip">
      <p className="revenue-chart-tooltip-label">{label}</p>

      <p className="revenue-chart-tooltip-value">
        {formatCurrency(revenue)}
      </p>
    </div>
  );
}

// ============================================================
// Empty State
// ============================================================

function EmptyChartState({ period, selectedDate }) {
  const month = FULL_MONTH_NAMES[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();

  let message = "No Virtual Try-On revenue recorded for this period.";

  if (period === "Daily") {
    message = `No Virtual Try-On revenue recorded in ${month} ${year}.`;
  }

  if (period === "Weekly") {
    message = `No Virtual Try-On revenue recorded in ${year}.`;
  }

  if (period === "Monthly") {
    message = `No Virtual Try-On revenue recorded in ${year}.`;
  }

  if (period === "Yearly") {
    message = "No Virtual Try-On revenue recorded yet.";
  }

  return (
    <div className="revenue-chart-empty">
      <div className="revenue-chart-empty-icon">
        <span>₹</span>
      </div>

      <p className="revenue-chart-empty-title">No revenue data</p>

      <p className="revenue-chart-empty-text">{message}</p>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function RevenueChart() {
  const [period, setPeriod] = useState("Monthly");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [dashboardStats, setDashboardStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // Fetch Dashboard Data
  // ==========================================================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/stats");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch dashboard data."
        );
      }

      setDashboardStats(response.data.stats);
    } catch (err) {
      console.error("Revenue Chart Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load revenue data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ==========================================================
  // Revenue Chart Data
  // ==========================================================

  const chartData = useMemo(() => {
    if (!dashboardStats?.revenueChart) {
      return [];
    }

    const revenueChart = dashboardStats.revenueChart;

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;

    // ========================================================
    // DAILY
    // Selected month
    // ========================================================

    if (period === "Daily") {
      const daysInMonth = getDaysInMonth(
        selectedYear,
        selectedMonth - 1
      );

      const dailyRevenue = revenueChart.daily || [];

      return Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;

        const matchedRecord = dailyRevenue.find(
          (item) =>
            Number(item.year) === selectedYear &&
            Number(item.month) === selectedMonth &&
            Number(item.day) === day
        );

        const date = getDateFromParts(
          selectedYear,
          selectedMonth,
          day
        );

        return {
          date: `${day} ${MONTH_NAMES[selectedMonth - 1]}`,
          revenue: Number(matchedRecord?.revenue || 0),
          fullDate: date,
        };
      });
    }

    // ========================================================
    // WEEKLY
    // Selected year
    // ========================================================

    if (period === "Weekly") {
      const weeklyRevenue = revenueChart.weekly || [];

      const selectedYearWeeks = weeklyRevenue.filter(
        (item) => Number(item.year) === selectedYear
      );

      if (!selectedYearWeeks.length) {
        return [];
      }

      return selectedYearWeeks.map((item) => ({
        date: `Week ${item.week}`,
        revenue: Number(item.revenue || 0),
      }));
    }

    // ========================================================
    // MONTHLY
    // Selected year
    // ========================================================

    if (period === "Monthly") {
      const monthlyRevenue = revenueChart.monthly || [];

      return MONTH_NAMES.map((month, index) => {
        const monthNumber = index + 1;

        const matchedRecord = monthlyRevenue.find(
          (item) =>
            Number(item.year) === selectedYear &&
            Number(item.month) === monthNumber
        );

        return {
          date: month,
          revenue: Number(matchedRecord?.revenue || 0),
        };
      });
    }

    // ========================================================
    // YEARLY
    // ========================================================

    if (period === "Yearly") {
      const yearlyRevenue = revenueChart.yearly || [];

      return yearlyRevenue.map((item) => ({
        date: String(item.year),
        revenue: Number(item.revenue || 0),
      }));
    }

    return [];
  }, [dashboardStats, period, selectedDate]);

  // ==========================================================
  // Dynamic Y-Axis
  // ==========================================================

  const yAxisConfig = useMemo(() => {
    const revenues = chartData.map((item) => Number(item.revenue || 0));

    const maximumRevenue = Math.max(...revenues, 0);

    if (maximumRevenue <= 0) {
      return {
        domain: [0, 100],
        ticks: [0, 25, 50, 75, 100],
      };
    }

    let step;

    if (maximumRevenue <= 100) {
      step = 25;
    } else if (maximumRevenue <= 500) {
      step = 100;
    } else if (maximumRevenue <= 1000) {
      step = 250;
    } else if (maximumRevenue <= 5000) {
      step = 1000;
    } else if (maximumRevenue <= 10000) {
      step = 2000;
    } else if (maximumRevenue <= 50000) {
      step = 10000;
    } else if (maximumRevenue <= 100000) {
      step = 25000;
    } else {
      step = Math.ceil(maximumRevenue / 4 / 1000) * 1000;
    }

    const maxAxisValue = Math.max(
      step,
      Math.ceil(maximumRevenue / step) * step
    );

    const ticks = [];

    for (let value = 0; value <= maxAxisValue; value += step) {
      ticks.push(value);
    }

    return {
      domain: [0, maxAxisValue],
      ticks,
    };
  }, [chartData]);

  // ==========================================================
  // Selected Period Label
  // ==========================================================

  const periodDescription = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = FULL_MONTH_NAMES[selectedDate.getMonth()];

    if (period === "Daily") {
      return `${month} ${year}`;
    }

    if (period === "Weekly") {
      return `Weekly overview • ${year}`;
    }

    if (period === "Monthly") {
      return `Monthly overview • ${year}`;
    }

    return "Yearly overview";
  }, [period, selectedDate]);

  // ==========================================================
  // Total Revenue For Visible Period
  // ==========================================================

  const visibleRevenue = useMemo(() => {
    return chartData.reduce(
      (total, item) => total + Number(item.revenue || 0),
      0
    );
  }, [chartData]);

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div className="revenue-chart-card bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col min-h-[420px] h-[420px]">
      {/* =====================================================
          Header
      ====================================================== */}

      <div className="revenue-chart-header flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
        {/* Title */}

        <div className="revenue-chart-title-wrapper min-w-0">
          <h2 className="revenue-chart-title text-lg font-bold text-slate-800">
            Virtual Try-On Revenue
          </h2>

          <div className="revenue-chart-subtitle-row">
            <p className="revenue-chart-subtitle text-sm text-slate-500">
              Revenue Overview
            </p>

            {!loading && !error && (
              <span className="revenue-chart-period-label">
                {periodDescription}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}

        <div className="revenue-chart-controls flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Period Filter */}

          <div
            className="revenue-chart-periods bg-slate-100 rounded-xl p-1 flex flex-wrap items-center gap-1 w-full lg:w-auto"
            role="group"
            aria-label="Revenue period"
          >
            {["Daily", "Weekly", "Monthly", "Yearly"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`revenue-chart-period-button px-2 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  period === item
                    ? "bg-[#15143A] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                aria-pressed={period === item}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Calendar */}

          <div className="revenue-chart-date-wrapper relative w-full lg:w-[150px]">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none"
              aria-hidden="true"
            />

            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              dateFormat="dd MMM yyyy"
              maxDate={new Date()}
              className="revenue-chart-date-input w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-500"
              aria-label="Select revenue date"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          Summary
      ====================================================== */}

      {!loading && !error && (
        <div className="revenue-chart-summary">
          <span className="revenue-chart-summary-label">
            Selected Period Revenue
          </span>

          <span className="revenue-chart-summary-value">
            {formatCurrency(visibleRevenue)}
          </span>
        </div>
      )}

      {/* =====================================================
          Chart Area
      ====================================================== */}

      <div className="revenue-chart-content flex-1 min-h-0">
        {/* Loading */}

        {loading && (
          <div className="revenue-chart-loading">
            <div className="revenue-chart-loading-line revenue-chart-loading-line-large" />
            <div className="revenue-chart-loading-chart">
              <div className="revenue-chart-loading-wave" />
            </div>

            <div className="revenue-chart-loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="revenue-chart-error">
            <div className="revenue-chart-error-icon">
              !
            </div>

            <p className="revenue-chart-error-title">
              Unable to load revenue
            </p>

            <p className="revenue-chart-error-message">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboardStats}
              className="revenue-chart-retry-button"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading && !error && chartData.length === 0 && (
          <EmptyChartState
            period={period}
            selectedDate={selectedDate}
          />
        )}

        {/* Chart */}

        {!loading &&
          !error &&
          chartData.length > 0 && (
            <div className="revenue-chart-responsive">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="purpleFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7C3AED"
                        stopOpacity={0.18}
                      />

                      <stop
                        offset="100%"
                        stopColor="#7C3AED"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="#E5E7EB"
                    strokeDasharray="0"
                  />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    interval={
                      period === "Daily"
                        ? "preserveStartEnd"
                        : 0
                    }
                    minTickGap={period === "Daily" ? 18 : 10}
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                    }}
                  />

                  <YAxis
                    width={48}
                    axisLine={false}
                    tickLine={false}
                    domain={yAxisConfig.domain}
                    ticks={yAxisConfig.ticks}
                    tick={{
                      fontSize: 10,
                      fill: "#94A3B8",
                    }}
                    tickFormatter={formatAxisCurrency}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "#CBD5E1",
                      strokeDasharray: "4 4",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    fill="url(#purpleFill)"
                    dot={{
                      r: 3.5,
                      fill: "#fff",
                      stroke: "#7C3AED",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#fff",
                      stroke: "#7C3AED",
                      strokeWidth: 2,
                    }}
                    animationDuration={700}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
      </div>
    </div>
  );
}