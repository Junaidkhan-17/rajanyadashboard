import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./TryOnRow.css";

export default function TryOnRow({
  request,
  selectedRows,
  setSelectedRows,
}) {
  const navigate = useNavigate();

  /*
  ========================================
  Checkbox Selection
  ========================================
  */

  const toggleCheckbox = () => {
    if (selectedRows.includes(request._id)) {
      setSelectedRows(
        selectedRows.filter(
          (id) => id !== request._id
        )
      );
    } else {
      setSelectedRows([
        ...selectedRows,
        request._id,
      ]);
    }
  };

  /*
  ========================================
  Date & Time
  ========================================
  */

  const dateObj = new Date(
    request.createdAt
  );

  const formattedDate =
    dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formattedTime =
    dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  /*
  ========================================
  Payment Color
  ========================================
  */

  const paymentColor =
    request.paymentStatus === "Paid"
      ? "try-on-row__badge--payment-paid"
      : request.paymentStatus === "Pending"
        ? "try-on-row__badge--payment-pending"
        : "try-on-row__badge--payment-na";

  /*
  ========================================
  Status Color
  ========================================
  */

  const statusColor =
    request.status === "Completed"
      ? "try-on-row__badge--status-completed"
      : request.status === "Processing"
        ? "try-on-row__badge--status-processing"
        : "try-on-row__badge--status-failed";

  return (
    <tr className="try-on-row">
      {/* =================================================
          CHECKBOX
          ================================================= */}

      <td className="try-on-row__cell try-on-row__checkbox-cell">
        <input
          type="checkbox"
          checked={selectedRows.includes(
            request._id
          )}
          onChange={toggleCheckbox}
          className="try-on-row__checkbox"
          aria-label={`Select ${request.requestId}`}
        />
      </td>

      {/* =================================================
          REQUEST
          ================================================= */}

      <td className="try-on-row__cell">
        <div className="try-on-row__request">
          <p className="try-on-row__request-id">
            {request.requestId}
          </p>

          <p className="try-on-row__request-email">
            {request.email}
          </p>
        </div>
      </td>

      {/* =================================================
          CUSTOMER
          ================================================= */}

      <td className="try-on-row__cell">
        <div className="try-on-row__customer">
          <div className="try-on-row__customer-image">
            {request.customerImage ? (
              <img
                src={request.customerImage}
                alt={`${request.customer} profile`}
                loading="lazy"
              />
            ) : (
              <span>
                {request.customer
                  ?.charAt(0)
                  ?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          <div className="try-on-row__customer-info">
            <p className="try-on-row__customer-name">
              {request.customer}
            </p>

            <p className="try-on-row__customer-phone">
              {request.phone}
            </p>
          </div>
        </div>
      </td>

      {/* =================================================
          PRODUCT
          ================================================= */}

      <td className="try-on-row__cell">
        <div className="try-on-row__product">
          <div className="try-on-row__product-image">
            {request.productImage ? (
              <img
                src={request.productImage}
                alt={request.productName}
                loading="lazy"
              />
            ) : (
              <span className="try-on-row__image-placeholder">
                —
              </span>
            )}
          </div>

          <div className="try-on-row__product-info">
            <p className="try-on-row__product-name">
              {request.productName}
            </p>

            <p className="try-on-row__product-sku">
              {request.sku}
            </p>
          </div>
        </div>
      </td>

      {/* =================================================
          UPLOADED PHOTO
          ================================================= */}

      <td className="try-on-row__cell">
        <div className="try-on-row__uploaded-photo">
          {request.uploadedPhoto ? (
            <img
              src={request.uploadedPhoto}
              alt={`${request.customer} uploaded photo`}
              loading="lazy"
            />
          ) : (
            <span className="try-on-row__no-photo">
              No photo
            </span>
          )}
        </div>
      </td>

      {/* =================================================
    PAYMENT
    ================================================= */}

<td className="try-on-row__cell">
  <div className="try-on-row__payment">
    <span
      className={`try-on-row__badge ${paymentColor}`}
    >
      {request.paymentStatus}
    </span>

    {request.paymentAmount &&
      request.paymentAmount !== "-" && (
        <p className="try-on-row__payment-amount">
          {request.paymentAmount}
        </p>
      )}

    {request.paymentMethod &&
      request.paymentMethod !== "N/A" && (
        <p className="try-on-row__payment-method">
          {request.paymentMethod}
        </p>
      )}
  </div>
</td>

      {/* =================================================
          STATUS
          ================================================= */}

      <td className="try-on-row__cell">
        <span
          className={`try-on-row__badge ${statusColor}`}
        >
          {request.status}
        </span>
      </td>

      {/* =================================================
          DATE
          ================================================= */}

      <td className="try-on-row__cell">
        <div className="try-on-row__date">
          <p className="try-on-row__date-value">
            {formattedDate}
          </p>

          <p className="try-on-row__time">
            {formattedTime}
          </p>
        </div>
      </td>

      {/* =================================================
          ACTIONS
          ================================================= */}

      <td className="try-on-row__cell try-on-row__actions-cell">
        <div className="try-on-row__actions">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/virtual-tryon/view/${request._id}`
              )
            }
            className="try-on-row__action-button try-on-row__view-button"
            aria-label={`View ${request.requestId}`}
            title="View request"
          >
            <Eye
              size={17}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/virtual-tryon/delete/${request._id}`
              )
            }
            className="try-on-row__action-button try-on-row__delete-button"
            aria-label={`Delete ${request.requestId}`}
            title="Delete request"
          >
            <Trash2
              size={17}
              strokeWidth={2}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}