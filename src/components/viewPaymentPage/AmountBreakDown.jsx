import { IndianRupee } from "lucide-react";

import "./AmountBreakDown.css";

const AmountBreakDown = ({ payment }) => {
  if (!payment) return null;

  const amount = Number(payment.amount || 0);

  return (
    <div className="amount-breakdown-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
      {/* Header */}
      <div className="amount-breakdown-header flex items-center gap-2 px-6 py-5 border-b">
        <IndianRupee
          size={18}
          className="amount-breakdown-header-icon shrink-0"
        />

        <h3 className="amount-breakdown-title text-lg font-bold text-slate-800">
          Amount Breakdown
        </h3>
      </div>

      {/* Body */}
      <div className="amount-breakdown-body p-6 space-y-5">
        {/* Column Heading */}
        <div className="amount-breakdown-row amount-breakdown-heading flex justify-between gap-4 text-slate-500">
          <span>Item</span>

          <span>Amount (₹)</span>
        </div>

        {/* Virtual Try-On Fee */}
        <div className="amount-breakdown-row flex justify-between gap-4">
          <span className="amount-breakdown-label text-slate-600">
            Virtual Try-On Fee
          </span>

          <span className="amount-breakdown-value font-semibold text-slate-800">
            ₹{amount.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Total */}
        <div className="amount-breakdown-total border-t pt-5 flex justify-between items-center gap-4">
          <span className="amount-breakdown-total-label text-lg font-bold text-slate-800">
            Total Paid
          </span>

          <span className="amount-breakdown-total-value text-3xl font-bold text-slate-900">
            ₹{amount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AmountBreakDown;