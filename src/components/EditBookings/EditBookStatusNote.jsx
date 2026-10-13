import { FileText, ClipboardList } from "lucide-react";
import "./EditBookStatusNote.css";

const statusStyles = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

const EditBookStatusNote = ({ booking, setBooking }) => {
  const handleStatusChange = (value) => {
    setBooking((prev) => ({
      ...prev,
      bookingStatus: value,
    }));
  };

  const amount = booking.summary?.amount || 4500;

  return (
    <div className="edit-book-status-card bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className="edit-book-status-header flex items-center gap-2 px-4 py-4 sm:px-6 sm:py-5 border-slate-100">
        <FileText
          size={18}
          className="text-slate-700 shrink-0"
          aria-hidden="true"
        />

        <h3 className="edit-book-status-title text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-800">
          Booking Status & Notes
        </h3>
      </div>

      <div className="edit-book-status-content p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Booking Status */}
        <div className="edit-book-status-field">
          <label
            htmlFor="edit-booking-status"
            className="text-xs font-semibold text-slate-600"
          >
            Booking Status
            <span className="text-red-500">*</span>
          </label>

          <select
            id="edit-booking-status"
            value={booking.bookingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`edit-book-status-select mt-2 w-full h-11 rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:ring-2 ${
              statusStyles[booking.bookingStatus] ||
              "bg-white text-slate-700 focus:ring-slate-300"
            }`}
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="edit-book-order-summary rounded-xl border border-slate-200 overflow-hidden">
          <div className="edit-book-order-summary-header flex items-center gap-2 px-4 py-3 bg-slate-50">
            <ClipboardList
              size={16}
              className="text-amber-500 shrink-0"
              aria-hidden="true"
            />

            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Order Summary
            </h4>
          </div>

          <div className="edit-book-order-summary-content p-4 space-y-3 text-sm">
            <div className="edit-book-summary-row flex justify-between gap-2">
              <span className="text-slate-500">Rent Amount</span>

              <span className="font-medium text-right break-words">
                ₹{amount}
              </span>
            </div>

            <div className="edit-book-summary-row flex justify-between gap-2">
              <span className="text-slate-500">Rental Duration</span>

              <span className="font-medium text-right break-words">
                {booking.rental?.duration || "—"}
              </span>
            </div>

            <div className="edit-book-summary-row flex justify-between gap-2">
              <span className="text-slate-500">Selected Size</span>

              <span className="font-medium text-right break-words">
                {booking.product?.size || "—"}
              </span>
            </div>

            <hr className="border-slate-200" />

            <div className="edit-book-total-row flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-slate-700">
                Total Amount
              </span>

              <span className="edit-book-total-amount text-2xl sm:text-3xl font-bold text-slate-900">
                ₹{amount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookStatusNote;