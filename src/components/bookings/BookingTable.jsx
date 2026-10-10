import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  confirmed: "bg-green-50 text-green-600",
  pending: "bg-blue-50 text-blue-600",
  cancelled: "bg-rose-50 text-rose-600",
  rejected: "bg-rose-50 text-rose-600",
  returned: "bg-emerald-50 text-emerald-600",
  completed: "bg-green-50 text-green-600",
  rental_active: "bg-purple-50 text-purple-600",
  ready_for_dispatch: "bg-yellow-50 text-yellow-600",
  dispatched: "bg-indigo-50 text-indigo-600",
  delivered: "bg-cyan-50 text-cyan-600",
  return_requested: "bg-orange-50 text-orange-600",
};

// Generate customer initials safely.
const initials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
};

// Format rental dates.
const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Format booking status for display.
const formatStatus = (status) => {
  if (!status) return "-";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Resolve the street address from the formatted booking
// or the original API booking object.
const getStreetAddress = (item) => {
  const address =
    item?.streetAddress ??
    item?.rawBooking?.address?.streetAddress ??
    item?.rawBooking?.address?.street ??
    item?.rawBooking?.address?.fullAddress;

  if (typeof address === "string" && address.trim()) {
    return address.trim();
  }

  return "-";
};

const BookingTable = ({
  bookings = [],
  sortBy,
  setSortBy,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h3 className="font-semibold text-slate-800">
          All Bookings{" "}
          <span className="text-slate-400 font-normal">
            ({bookings.length})
          </span>
        </h3>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Sort By:</span>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-8 px-2 rounded-lg border border-slate-200 text-slate-600 text-sm focus:outline-none"
            aria-label="Sort bookings"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="max-h-[580px] overflow-y-auto overflow-x-auto">
        <table className="w-full table-fixed text-sm min-w-[1450px]">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
              <th className="px-5 py-3 font-medium bg-white w-[80px]">
                SR NO.
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[150px]">
                BOOKING ID
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[200px]">
                CUSTOMER
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[220px]">
                PRODUCT
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[150px]">
                RENTAL DURATION
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[130px]">
                RENT DATE
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[130px]">
                RETURN DATE
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[120px]">
                AMOUNT
              </th>

              {/* Street Address Column */}
              <th className="px-5 py-3 font-medium bg-white w-[280px]">
                STREET ADDRESS
              </th>

              <th className="px-5 py-3 font-medium bg-white w-[150px]">
                STATUS
              </th>

              <th className="px-5 py-3 font-medium bg-white text-right w-[100px]">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((item, idx) => {
              const streetAddress = getStreetAddress(item);

              return (
                <tr
                  key={item._id || item.bookingId || idx}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  {/* Serial Number */}
                  <td className="px-5 py-4 text-slate-500">
                    {idx + 1}
                  </td>

                  {/* Booking ID */}
                  <td className="px-5 py-4 font-medium text-slate-800 break-words">
                    {item.bookingId || "-"}
                  </td>

                  {/* Customer Information */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-medium">
                        {initials(item.customer)}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 break-words">
                          {item.customer || "-"}
                        </p>

                        <p className="text-xs text-slate-400 break-words">
                          {item.phone || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product || "Rental product"}
                          className="w-8 h-8 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          —
                        </div>
                      )}

                      <span className="text-slate-700 break-words">
                        {item.product || "-"}
                      </span>
                    </div>
                  </td>

                  {/* Rental Duration */}
                  <td className="px-5 py-4">
                    <span className="inline-block px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium whitespace-nowrap">
                      {item.duration || "-"}
                    </span>
                  </td>

                  {/* Rental Start Date */}
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(item.rentDate)}
                  </td>

                  {/* Return Date */}
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(item.returnDate)}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">
                    ₹
                    {Number(item.amount || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Street Address */}
                  <td className="px-5 py-4 text-slate-600 align-top">
                    <span
                      className="block whitespace-normal break-words leading-5"
                      title={
                        streetAddress !== "-" ? streetAddress : undefined
                      }
                    >
                      {streetAddress}
                    </span>
                  </td>

                  {/* Booking Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        statusStyles[item.status] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/rent-bookings/${item._id}`)
                        }
                        title="View booking"
                        aria-label={`View booking ${item.bookingId || ""}`}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/rent-bookings/edit/${item._id}`)
                        }
                        title="Edit booking"
                        aria-label={`Edit booking ${item.bookingId || ""}`}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Empty State */}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-10 text-slate-400"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;