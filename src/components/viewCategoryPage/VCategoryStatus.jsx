import { CheckCircle2 } from "lucide-react";

const VCategoryStatus = ({ category }) => {
  const isActive = category?.isActive === true;

  const status = isActive ? "Active" : "Inactive";

  const badgeClass = isActive
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-600";

  const statusMessage = isActive
    ? "This category is currently visible to customers and available for product assignments."
    : "This category is currently hidden from customers and is not available for product assignments.";

  return (
    <div>
      {/* Heading */}

      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">
          Category Status
        </h2>
      </div>

      {/* Body */}

      <div className="p-6">
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
          Status
        </p>

        <div className="flex items-center gap-2 mb-5">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${badgeClass}`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2
            size={18}
            className={
              isActive
                ? "text-green-500 mt-0.5"
                : "text-red-500 mt-0.5"
            }
          />

          <p className="text-sm italic text-slate-500 leading-6">
            {statusMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VCategoryStatus;