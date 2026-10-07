import {
  Smartphone,
  Globe,
  MapPin,
  BadgeIndianRupee,
} from "lucide-react";

import "./AdditionalInfo.css";

const AdditionalInfo = ({ payment }) => {
  if (!payment) return null;

  const device = payment.device || "Not available";
  const ipAddress = payment.ipAddress || "Not available";
  const location = payment.location || "Not available";
  const currency = payment.currency || "INR";
  const refundStatus = payment.refundStatus || "Not Refunded";

  const refundStatusKey = String(refundStatus).toLowerCase();

  const refundColor =
    refundStatusKey === "refunded"
      ? "bg-green-100 text-green-700"
      : refundStatusKey === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-blue-100 text-blue-700";

  return (
    <div className="additional-info-card bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
      {/* Header */}
      <h2 className="additional-info-title text-lg font-semibold flex items-center gap-2 mb-6">
        <Globe
          size={18}
          className="additional-info-title-icon shrink-0"
        />

        <span>Additional Information</span>
      </h2>

      {/* Information */}
      <div className="additional-info-list space-y-5">
        {/* Device */}
        <div className="additional-info-row flex justify-between items-center gap-4">
          <div className="additional-info-label flex items-center gap-2 text-slate-500">
            <Smartphone
              size={16}
              className="additional-info-icon shrink-0"
            />

            <span>Device</span>
          </div>

          <span className="additional-info-value font-semibold text-slate-800 text-right">
            {device}
          </span>
        </div>

        {/* IP Address */}
        <div className="additional-info-row flex justify-between items-center gap-4">
          <span className="additional-info-label text-slate-500">
            IP Address
          </span>

          <span className="additional-info-value font-semibold text-slate-800 text-right">
            {ipAddress}
          </span>
        </div>

        {/* Location */}
        <div className="additional-info-row flex justify-between items-start gap-4">
          <div className="additional-info-label flex items-center gap-2 text-slate-500">
            <MapPin
              size={16}
              className="additional-info-icon shrink-0"
            />

            <span>Location</span>
          </div>

          <span className="additional-info-value font-semibold text-slate-800 text-right">
            {location}
          </span>
        </div>

        {/* Currency */}
        <div className="additional-info-row flex justify-between items-center gap-4">
          <div className="additional-info-label flex items-center gap-2 text-slate-500">
            <BadgeIndianRupee
              size={16}
              className="additional-info-icon shrink-0"
            />

            <span>Currency</span>
          </div>

          <span className="additional-info-value font-semibold text-slate-800 text-right">
            {currency}
          </span>
        </div>

        {/* Refund Status */}
        <div className="additional-info-row additional-info-refund-row flex justify-between items-center gap-4">
          <span className="additional-info-label text-slate-500">
            Refund Status
          </span>

          <span
            className={`additional-info-refund-badge px-3 py-1 rounded-full text-xs font-semibold ${refundColor}`}
          >
            {refundStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;