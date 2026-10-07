import { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { Download } from "lucide-react";

import CustomerInfo from "../../components/viewPaymentPage/CustomerInfo";
import ServiceDetails from "../../components/viewPaymentPage/ServiceDetails";
import AmountBreakDown from "../../components/viewPaymentPage/AmountBreakDown";
import InvoiceInfo from "../../components/viewPaymentPage/InvoiceInfo";
import PaymentStatusTimeline from "../../components/viewPaymentPage/PaymentStatusTimeline";
import AdditionalInfo from "../../components/viewPaymentPage/AdditionalInfo";
import PaymentAction from "../../components/viewPaymentPage/PaymentAction";

import { getAdminPaymentById } from "../../services/paymentService";

import "./ViewPaymentPage.css";

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig = {
  Paid: {
    text: "Paid",
    color: "text-green-600",
    dot: "bg-green-500",
    card: "bg-green-50 border-green-200",
  },

  Pending: {
    text: "Pending",
    color: "text-yellow-600",
    dot: "bg-yellow-500",
    card: "bg-yellow-50 border-yellow-200",
  },

  Processing: {
    text: "Processing",
    color: "text-blue-600",
    dot: "bg-blue-500",
    card: "bg-blue-50 border-blue-200",
  },

  Failed: {
    text: "Failed",
    color: "text-red-600",
    dot: "bg-red-500",
    card: "bg-red-50 border-red-200",
  },

  Cancelled: {
    text: "Cancelled",
    color: "text-slate-600",
    dot: "bg-slate-500",
    card: "bg-slate-50 border-slate-200",
  },

  Refunded: {
    text: "Refunded",
    color: "text-purple-600",
    dot: "bg-purple-500",
    card: "bg-purple-50 border-purple-200",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

const PaymentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH REAL PAYMENT DETAILS
     GET /api/admin/payments/:paymentId
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setPayment(null);

        if (!id) {
          throw new Error("Payment ID is missing");
        }

        const response = await getAdminPaymentById(id);

        if (!isMounted) return;

        if (!response?.success || !response?.payment) {
          throw new Error(
            response?.message || "Failed to fetch payment details"
          );
        }

        setPayment(response.payment);
      } catch (err) {
        console.error("Admin Payment Details Error:", err);

        if (!isMounted) return;

        setPayment(null);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load payment details"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPaymentDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="view-payment-page-status flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-black"
          aria-label="Loading payment details"
        />

        <div>
          <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
            Loading Payment Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while we fetch the payment information.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR / NOT FOUND STATE
  ========================================================= */

  if (!payment) {
    return (
      <div className="view-payment-page-status flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Payment Not Found
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error || "The requested payment could not be found."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/payments")}
          className="min-h-[44px] rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 active:scale-[0.98]"
        >
          Back to Payments
        </button>
      </div>
    );
  }

  /* =========================================================
     CURRENT STATUS
  ========================================================= */

  const currentStatus =
    statusConfig[payment.status] || {
      text: payment.status || "Unknown",
      color: "text-slate-600",
      dot: "bg-slate-500",
      card: "bg-slate-50 border-slate-200",
    };

  /* =========================================================
     DOWNLOAD PAYMENT RECEIPT
     Uses ONLY real payment information.
  ========================================================= */

  const downloadInvoice = () => {
    const invoiceNumber =
      payment.invoiceNumber ||
      `INV-${payment.transactionId || payment._id}`;

    const invoice = `
RAJANYA PAYMENT RECEIPT

Invoice : ${invoiceNumber}

Transaction : ${payment.transactionId || "N/A"}

Customer : ${payment.customer || "N/A"}

Email : ${payment.email || "N/A"}

Service : ${payment.service || "N/A"}

Amount : ₹${Number(payment.amount || 0).toLocaleString("en-IN")}

Payment Method : ${payment.method || "N/A"}

Status : ${payment.status || "N/A"}

Payment Date : ${payment.paymentDate || payment.date || "N/A"}

Payment Time : ${payment.paymentTime || "N/A"}

Currency : ${payment.currency || "INR"}

Tokens Purchased : ${payment.tokensPurchased || 0}

Tokens Credited : ${payment.tokensCredited ? "Yes" : "No"}
`;

    const blob = new Blob([invoice], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${invoiceNumber}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="view-payment-page w-full min-w-0 space-y-5 px-3 sm:space-y-7 sm:px-0">
      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="view-payment-breadcrumb flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
        <NavLink
          className="transition hover:text-black"
          to="/"
        >
          Dashboard
        </NavLink>

        <span aria-hidden="true">›</span>

        <NavLink
          className="transition hover:text-black"
          to="/payments"
        >
          Payments
        </NavLink>

        <span aria-hidden="true">›</span>

        <span className="break-words font-semibold text-slate-900">
          Payment Details
        </span>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="view-payment-header flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            Payment Details
          </h1>

          <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-slate-500 sm:text-base">
            View complete payment information and transaction details.
          </p>
        </div>

        <div className="view-payment-header-actions flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
          {/* STATUS */}

          <div
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 ${currentStatus.card}`}
          >
            <span
              className={`break-words text-sm font-medium ${currentStatus.color}`}
            >
              Status : {currentStatus.text}
            </span>

            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${currentStatus.dot}`}
            />
          </div>

          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={downloadInvoice}
            className="view-payment-download-button flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            <Download size={18} />

            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          PAYMENT OVERVIEW
      ===================================================== */}

      <div className="view-payment-overview-grid grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        <CustomerInfo payment={payment} />

        <ServiceDetails payment={payment} />

        <AmountBreakDown payment={payment} />
      </div>

      {/* =====================================================
          PAYMENT INFORMATION
      ===================================================== */}

      <div className="view-payment-information-grid grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        <InvoiceInfo payment={payment} />

        <PaymentStatusTimeline payment={payment} />

        <AdditionalInfo payment={payment} />
      </div>

      {/* =====================================================
          PAYMENT ACTION
      ===================================================== */}

      <div className="view-payment-action-wrapper min-w-0">
        <PaymentAction payment={payment} />
      </div>
    </div>
  );
};

export default PaymentDetailsPage;