import {
  CheckCircle2,
  Clock3,
  CircleX,
} from "lucide-react";

import "./PaymentStatusTimeline.css";

const PaymentStatusTimeline = ({ payment }) => {
  if (!payment) return null;

  const status = payment.status || "Pending";
  const normalizedStatus = String(status).toLowerCase();

  const isPaid = normalizedStatus === "paid";
  const isFailed = normalizedStatus === "failed";

  const steps = [
    {
      title: "Payment Initiated",
      description: "Payment request created",
      date: payment.createdDate || "--",
      time: payment.createdTime || "--",
      state: "completed",
    },
    {
      title: isPaid
        ? "Payment Successful"
        : isFailed
          ? "Payment Failed"
          : normalizedStatus === "processing"
            ? "Payment Processing"
            : normalizedStatus === "cancelled"
              ? "Payment Cancelled"
              : normalizedStatus === "refunded"
                ? "Payment Refunded"
                : "Payment Pending",

      description: isPaid
        ? "Amount paid successfully"
        : isFailed
          ? "Payment could not be processed"
          : normalizedStatus === "processing"
            ? "Payment is being processed"
            : normalizedStatus === "cancelled"
              ? "Payment was cancelled"
              : normalizedStatus === "refunded"
                ? "Payment was refunded"
                : "Waiting for payment confirmation",

      date: payment.paymentDate || "--",
      time: payment.paymentTime || "--",

      state: isPaid
        ? "completed"
        : isFailed
          ? "failed"
          : "pending",
    },
    {
      title: "Invoice Generated",

      description: isPaid
        ? "Invoice generated successfully"
        : "Invoice not generated",

      date: isPaid
        ? payment.invoiceDate || "--"
        : "--",

      time: isPaid
        ? payment.invoiceTime || "--"
        : "--",

      state: isPaid ? "completed" : "inactive",
    },
  ];

  const getIcon = (state) => {
    switch (state) {
      case "completed":
        return (
          <div className="payment-status-timeline-icon payment-status-timeline-icon-completed">
            <CheckCircle2
              size={18}
              className="payment-status-timeline-icon-svg"
            />
          </div>
        );

      case "pending":
        return (
          <div className="payment-status-timeline-icon payment-status-timeline-icon-pending">
            <Clock3
              size={18}
              className="payment-status-timeline-icon-svg"
            />
          </div>
        );

      case "failed":
        return (
          <div className="payment-status-timeline-icon payment-status-timeline-icon-failed">
            <CircleX
              size={18}
              className="payment-status-timeline-icon-svg"
            />
          </div>
        );

      default:
        return (
          <div
            className="payment-status-timeline-icon payment-status-timeline-icon-inactive"
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div className="payment-status-timeline-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
      {/* Header */}
      <div className="payment-status-timeline-header px-6 py-5 border-b">
        <h3 className="payment-status-timeline-title text-lg font-bold text-slate-800">
          Payment Status Timeline
        </h3>
      </div>

      {/* Timeline */}
      <div className="payment-status-timeline-body p-6">
        {steps.map((step, index) => (
          <div
            key={`${step.title}-${index}`}
            className="payment-status-timeline-step flex gap-4 relative pb-8 last:pb-0"
          >
            {index !== steps.length - 1 && (
              <div
                className="payment-status-timeline-line absolute bg-slate-200"
                aria-hidden="true"
              />
            )}

            <div className="payment-status-timeline-icon-wrapper shrink-0">
              {getIcon(step.state)}
            </div>

            <div className="payment-status-timeline-content flex-1 min-w-0 flex justify-between gap-5">
              <div className="payment-status-timeline-description min-w-0">
                <h4 className="payment-status-timeline-step-title font-semibold text-slate-800 break-words">
                  {step.title}
                </h4>

                <p className="payment-status-timeline-step-description text-sm text-slate-500 mt-1 break-words">
                  {step.description}
                </p>
              </div>

              <div className="payment-status-timeline-date text-right text-xs text-slate-400 shrink-0">
                <p>{step.date}</p>
                <p>{step.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentStatusTimeline;