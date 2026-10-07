import { useEffect, useState } from "react";

import {
  Wallet,
  CircleCheckBig,
  Clock3,
  CircleX,
  BarChart3,
  Download,
} from "lucide-react";
import "./PaymentsPage.css";
import PaymentFilters from "../components/payments/PaymentFilter";
import PaymentTable from "../components/payments/PaymentTable";

import {
  getAdminPayments,
  getAdminPaymentStats,
} from "../services/paymentService";

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatChange = (value) => {
  if (value === null || value === undefined) {
    return "No previous month data";
  }

  if (Number(value) === 0) {
    return "0% vs last month";
  }

  const sign = Number(value) > 0 ? "+" : "";

  return `${sign}${value}% vs last month`;
};

/* =========================================================
   PAYMENTS PAGE
========================================================= */

const PaymentsPage = () => {
  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [method, setMethod] = useState("All Methods");
  const [dateRange, setDateRange] = useState("");

  const [payments, setPayments] = useState([]);

  /*
    Filters that are actually applied to the table.
    Only updates when Apply Filters is clicked.
  */
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "All Status",
    method: "All Methods",
    dateRange: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH REAL ADMIN PAYMENT DATA
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        setError("");

        const [paymentsResponse, statsResponse] =
          await Promise.all([
            getAdminPayments(),
            getAdminPaymentStats(),
          ]);

        if (!isMounted) return;

        if (!paymentsResponse?.success) {
          throw new Error(
            paymentsResponse?.message ||
              "Failed to fetch payments"
          );
        }

        if (!statsResponse?.success) {
          throw new Error(
            statsResponse?.message ||
              "Failed to fetch payment statistics"
          );
        }

        setPayments(
          Array.isArray(paymentsResponse.payments)
            ? paymentsResponse.payments
            : []
        );

        setStats(
          statsResponse.stats || {
            totalRevenue: 0,
            successfulPayments: 0,
            pendingPayments: 0,
            failedPayments: 0,
            monthRevenue: 0,
            changes: {
              totalRevenue: null,
              successfulPayments: null,
              pendingPayments: null,
              failedPayments: null,
              monthRevenue: null,
            },
          }
        );
      } catch (err) {
        console.error(
          "Admin Payments Page Error:",
          err
        );

        if (!isMounted) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load payment data"
        );

        setStats(null);
        setPayments([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPaymentData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     APPLY FILTERS
  ========================================================= */

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      status,
      method,
      dateRange,
    });
  };

  /* =========================================================
     EXPORT REAL PAYMENT DATA
  ========================================================= */

  const handleExport = () => {
    if (!payments.length) {
      return;
    }

    const headers = [
      "Transaction ID",
      "Customer",
      "Service",
      "Amount",
      "Method",
      "Status",
      "Date",
    ];

    const escapeCsvValue = (value) => {
      const stringValue = String(value ?? "");

      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = payments.map((item) => [
      item.transactionId,
      item.customer,
      item.service,
      item.amount,
      item.method,
      item.status,
      item.date,
    ]);

    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        row.map(escapeCsvValue).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "payments-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full min-w-0 px-3 sm:px-4 flex items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
          <div className="text-sm sm:text-base text-slate-500">
            Loading payments...
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-[60vh] w-full min-w-0 px-3 sm:px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6 text-center">
          <p className="text-sm sm:text-base font-medium leading-6 text-red-600 break-words">
            {error}
          </p>

          <p className="mt-2 text-xs sm:text-sm leading-5 text-slate-500">
            Please check the admin authentication and
            backend payment API.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     STATISTICS CARDS
  ========================================================= */

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      change:
        stats?.changes?.totalRevenue === null ||
        stats?.changes?.totalRevenue === undefined
          ? "Lifetime revenue"
          : formatChange(
              stats.changes.totalRevenue
            ),
      icon: Wallet,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      trendColor: "text-green-600",
    },

    {
      title: "Successful Payments",
      value: stats?.successfulPayments ?? 0,
      change:
        stats?.changes?.successfulPayments ===
          null ||
        stats?.changes?.successfulPayments ===
          undefined
          ? "Real payment count"
          : formatChange(
              stats.changes.successfulPayments
            ),
      icon: CircleCheckBig,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trendColor: "text-green-600",
    },

    {
      title: "Pending Payments",
      value: stats?.pendingPayments ?? 0,
      change:
        stats?.changes?.pendingPayments === null ||
        stats?.changes?.pendingPayments ===
          undefined
          ? "Current pending count"
          : formatChange(
              stats.changes.pendingPayments
            ),
      icon: Clock3,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trendColor: "text-orange-500",
    },

    {
      title: "Failed Payments",
      value: stats?.failedPayments ?? 0,
      change:
        stats?.changes?.failedPayments === null ||
        stats?.changes?.failedPayments ===
          undefined
          ? "Current failed count"
          : formatChange(
              stats.changes.failedPayments
            ),
      icon: CircleX,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      trendColor: "text-red-500",
    },

    {
      title: "This Month Revenue",
      value: formatCurrency(stats?.monthRevenue),
      change: formatChange(
        stats?.changes?.monthRevenue
      ),
      icon: BarChart3,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trendColor: "text-green-600",
    },
  ];

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="w-full min-w-0 max-w-full overflow-x-hidden space-y-5 sm:space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="w-full min-w-0">

        <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Heading */}

          <div className="min-w-0 flex-1">

            <h1
              className="
                max-w-full
                break-words
                text-[clamp(1.5rem,7vw,1.875rem)]
                font-bold
                leading-[1.15]
                tracking-tight
                text-slate-800
                sm:text-3xl
              "
            >
              Payments Management
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                break-words
                text-xs
                leading-5
                text-slate-500
                sm:text-sm
                sm:leading-6
                md:text-base
              "
            >
              View all payments, track transactions and
              manage refunds.
            </p>

          </div>

          {/* Export */}

          <div className="w-full shrink-0 sm:w-auto">

            <button
              type="button"
              onClick={handleExport}
              disabled={!payments.length}
              className="
                flex
                min-h-[44px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-black
                px-5
                py-3
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                duration-200
                hover:bg-slate-800
                active:scale-[0.98]
                focus:outline-none
                focus:ring-2
                focus:ring-slate-400
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
                sm:min-w-[150px]
                sm:px-6
              "
            >
              <Download
                size={18}
                className="shrink-0"
              />

              <span className="whitespace-nowrap">
                Export Report
              </span>
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATISTICS CARDS
      ===================================================== */}

      <section
        className="
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-3
          sm:grid-cols-2
          sm:gap-4
          lg:gap-5
          xl:grid-cols-5
        "
      >

        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <article
              key={index}
              className="
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                sm:p-5
              "
            >

              {/* Icon */}

              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  sm:h-11
                  sm:w-11
                  ${card.iconBg}
                `}
              >
                <Icon
                  className={card.iconColor}
                  size={19}
                  strokeWidth={2}
                />
              </div>

              {/* Label */}

              <p
                className="
                  mt-4
                  break-words
                  text-[10px]
                  font-semibold
                  uppercase
                  leading-4
                  tracking-[0.08em]
                  text-slate-400
                  sm:mt-5
                  sm:text-[11px]
                "
              >
                {card.title}
              </p>

              {/* Value */}

              <h2
                className="
                  mt-1.5
                  min-w-0
                  max-w-full
                  break-words
                  text-[clamp(1.3rem,7vw,1.5rem)]
                  font-bold
                  leading-tight
                  tracking-tight
                  text-slate-800
                  sm:mt-2
                  sm:text-2xl
                "
              >
                {card.value}
              </h2>

              {/* Trend / Info */}

              <p
                className={`
                  mt-2
                  min-h-[20px]
                  break-words
                  text-[10px]
                  leading-5
                  ${card.trendColor}
                  sm:text-xs
                `}
              >
                {card.change}
              </p>

            </article>
          );
        })}

      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="w-full min-w-0">

        <PaymentFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          method={method}
          setMethod={setMethod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={handleApplyFilters}
        />

      </section>

      {/* =====================================================
          PAYMENT TABLE
      ===================================================== */}

      <section className="w-full min-w-0 max-w-full">

        <PaymentTable
          payments={payments}
          search={appliedFilters.search}
          status={appliedFilters.status}
          method={appliedFilters.method}
          dateRange={appliedFilters.dateRange}
        />

      </section>

    </main>
  );
};

export default PaymentsPage;