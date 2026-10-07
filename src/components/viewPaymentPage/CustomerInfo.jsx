import { Mail, MapPin, BadgeCheck, Phone } from "lucide-react";

import "./CustomerInfo.css";

const CustomerInfo = ({ payment }) => {
  const customerName = payment?.customer || "N/A";
  const customerEmail = payment?.email || "N/A";
  const customerPhone = payment?.phone || "Not available";
  const customerAddress = payment?.address || "Not available";

  return (
    <div className="customer-info-card bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
      {/* =====================================================
          TITLE
      ===================================================== */}

      <h3 className="customer-info-title text-lg font-bold text-slate-800 mb-5 tracking-wider">
        Customer Information
      </h3>

      {/* =====================================================
          CUSTOMER PROFILE
      ===================================================== */}

      <div className="customer-info-profile flex items-center gap-4">
        {payment?.customerImage ? (
          <img
            src={payment.customerImage}
            alt={customerName}
            className="customer-info-avatar w-18 h-18 rounded-full object-cover border"
          />
        ) : (
          <div
            className="customer-info-avatar customer-info-avatar-placeholder w-18 h-18 rounded-full border flex items-center justify-center bg-slate-100 text-slate-600 font-bold text-lg"
            aria-label={`${customerName} profile`}
          >
            {customerName
              .split(" ")
              .map((name) => name.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}

        <div className="customer-info-identity min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <h4 className="customer-info-name font-bold text-lg text-slate-800 break-words">
              {customerName}
            </h4>

            <BadgeCheck
              size={18}
              className="customer-info-verified-icon shrink-0 text-blue-500"
              aria-label="Verified customer"
            />
          </div>

          <p className="customer-info-phone text-sm text-slate-500 break-words">
            {customerPhone}
          </p>
        </div>
      </div>

      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      <div className="customer-info-details mt-6 space-y-4">
        {/* EMAIL */}

        <div className="customer-info-detail-row flex items-start gap-3">
          <Mail
            size={18}
            className="customer-info-detail-icon shrink-0 text-slate-400"
          />

          <span className="customer-info-detail-text text-slate-700 break-all">
            {customerEmail}
          </span>
        </div>

        {/* PHONE */}

        <div className="customer-info-detail-row flex items-start gap-3">
          <Phone
            size={18}
            className="customer-info-detail-icon shrink-0 text-slate-400"
          />

          <span className="customer-info-detail-text text-slate-700 break-words">
            {customerPhone}
          </span>
        </div>

        {/* ADDRESS */}

        <div className="customer-info-detail-row flex items-start gap-3">
          <MapPin
            size={18}
            className="customer-info-detail-icon mt-0.5 shrink-0 text-slate-400"
          />

          <span className="customer-info-detail-text text-slate-700 break-words">
            {customerAddress}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;