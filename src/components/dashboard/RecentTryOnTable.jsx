import { useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./RecentTryOnTable.css";

export default function RecentTryOnTable() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ========================================
  Format Currency
  ========================================
  */

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "—";
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      return "—";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  /*
  ========================================
  Format Date
  ========================================
  */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return {
        date: "—",
        time: "",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        date: "—",
        time: "",
      };
    }

    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  /*
  ========================================
  Get User Name
  ========================================
  */

  const getUserName = (user) => {
    if (!user) {
      return "Unknown User";
    }

    if (user.fullName?.trim()) {
      return user.fullName.trim();
    }

    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return fullName || "Unknown User";
  };

  /*
  ========================================
  Get Product Image
  ========================================
  */

  const getProductImage = (product) => {
    return (
      product?.thumbnailImage ||
      product?.mainImage ||
      "/images/product-placeholder.jpg"
    );
  };

  /*
  ========================================
  Fetch Virtual Try-On Requests
  ========================================
  */

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/virtual-try-on/admin/requests");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to fetch Virtual Try-On requests."
        );
      }

      const virtualTryOnAccounts = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      /*
      ========================================
      Flatten VirtualTryOn.history[]

      Backend returns:

      VirtualTryOn document
        ↓
      history[]
        ↓
      individual try-on requests
      ========================================
      */

      const flattenedRequests = [];

      virtualTryOnAccounts.forEach((account) => {
        const user = account.user || null;

        const history = Array.isArray(account.history)
          ? account.history
          : [];

        history.forEach((historyItem) => {
          const generatedAt =
            historyItem.generatedAt ||
            historyItem.createdAt ||
            account.updatedAt;

          const generatedImage =
            historyItem.generatedImage ||
            historyItem.outputImage ||
            historyItem.resultImage ||
            "";

          flattenedRequests.push({
            id: historyItem._id,

            user: {
              name: getUserName(user),
              email: user?.email || "—",
              phone: user?.phone || "",
              profileImage: user?.profileImage || "",
            },

            product: {
              id:
                historyItem.product?._id ||
                historyItem.product ||
                null,

              name:
                historyItem.product?.name ||
                historyItem.productName ||
                "Unknown Product",

              image: getProductImage(historyItem.product),
            },

            dateTime: generatedAt,

            generatedImage,

            /*
            ========================================
            Payment

            The current admin endpoint does not
            provide per-history payment data.
            Do not display fake payment values.
            ========================================
            */

            payment: null,

            /*
            ========================================
            Status

            A history record represents a generated
            Virtual Try-On result.

            If a generated image exists:
            Completed

            Otherwise:
            Processing
            ========================================
            */

            status: generatedImage
              ? "Completed"
              : "Processing",
          });
        });
      });

      /*
      ========================================
      Sort newest first
      ========================================
      */

      flattenedRequests.sort((a, b) => {
        const first = new Date(a.dateTime || 0).getTime();
        const second = new Date(b.dateTime || 0).getTime();

        return second - first;
      });

      /*
      ========================================
      Dashboard only shows recent requests

      Keep the table compact.
      ========================================
      */

      setRequests(flattenedRequests.slice(0, 6));
    } catch (requestError) {
      console.error(
        "Recent Virtual Try-On Requests Error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load Virtual Try-On requests."
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /*
  ========================================
  Memoized Empty State
  ========================================
  */

  const hasRequests = useMemo(
    () => requests.length > 0,
    [requests]
  );

  /*
  ========================================
  View All
  ========================================
  */

  const handleViewAll = () => {
    navigate("/virtual-tryon");
  };

  /*
  ========================================
  View Request
  ========================================
  */

  const handleViewRequest = (request) => {
    if (!request.id) {
      return;
    }

    navigate(`/virtual-tryon/view/${request.id}`);
  };

  return (
    <section className="recent-tryon-card">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="recent-tryon-header">
        <div className="recent-tryon-heading">
          <div className="recent-tryon-icon">
            <Sparkles size={16} />
          </div>

          <div>
            <h2>Recent Virtual Try-On Requests</h2>

            <p>
              Latest customer virtual try-on activity
            </p>
          </div>
        </div>

        <button
          type="button"
          className="recent-tryon-view-all"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="recent-tryon-content">
        {/* ========================================
            LOADING
        ======================================== */}

        {loading && (
          <div className="recent-tryon-state">
            <div className="recent-tryon-spinner"></div>

            <p>Loading Virtual Try-On requests...</p>
          </div>
        )}

        {/* ========================================
            ERROR
        ======================================== */}

        {!loading && error && (
          <div className="recent-tryon-state recent-tryon-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchRequests}
              className="recent-tryon-retry"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* ========================================
            EMPTY
        ======================================== */}

        {!loading && !error && !hasRequests && (
          <div className="recent-tryon-state">
            <div className="recent-tryon-empty-icon">
              <Sparkles size={20} />
            </div>

            <p>No Virtual Try-On requests found.</p>
          </div>
        )}

        {/* ========================================
            TABLE
        ======================================== */}

        {!loading && !error && hasRequests && (
          <div className="recent-tryon-table-wrapper">
            <table className="recent-tryon-table">
              <thead>
                <tr>
                  <th className="recent-tryon-user-column">
                    User
                  </th>

                  <th className="recent-tryon-product-column">
                    Product
                  </th>

                  <th className="recent-tryon-date-column">
                    Date
                  </th>

                  <th className="recent-tryon-payment-column">
                    Payment
                  </th>

                  <th className="recent-tryon-status-column">
                    Status
                  </th>

                  <th className="recent-tryon-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((item) => {
                  const formattedDate = formatDate(
                    item.dateTime
                  );

                  return (
                    <tr key={item.id}>
                      {/* ========================================
                          USER
                      ======================================== */}

                      <td>
                        <div className="recent-tryon-user">
                          {item.user.profileImage ? (
                            <img
                              src={item.user.profileImage}
                              alt={item.user.name}
                              className="recent-tryon-avatar"
                            />
                          ) : (
                            <div className="recent-tryon-avatar recent-tryon-avatar-fallback">
                              {item.user.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>
                          )}

                          <div className="recent-tryon-user-info">
                            <p className="recent-tryon-user-name">
                              {item.user.name}
                            </p>

                            <p className="recent-tryon-user-email">
                              {item.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ========================================
                          PRODUCT
                      ======================================== */}

                      <td>
                        <div className="recent-tryon-product">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="recent-tryon-product-image"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                          <span>
                            {item.product.name}
                          </span>
                        </div>
                      </td>

                      {/* ========================================
                          DATE
                      ======================================== */}

                      <td>
                        <div className="recent-tryon-date">
                          <span>
                            {formattedDate.date}
                          </span>

                          <small>
                            {formattedDate.time}
                          </small>
                        </div>
                      </td>

                      {/* ========================================
                          PAYMENT
                      ======================================== */}

                      <td>
                        <span className="recent-tryon-payment">
                          {item.payment
                            ? formatCurrency(item.payment)
                            : "—"}
                        </span>
                      </td>

                      {/* ========================================
                          STATUS
                      ======================================== */}

                      <td>
                        <span
                          className={`recent-tryon-status ${
                            item.status === "Completed"
                              ? "completed"
                              : "processing"
                          }`}
                        >
                          <span className="recent-tryon-status-dot"></span>

                          {item.status}
                        </span>
                      </td>

                      {/* ========================================
                          ACTION
                      ======================================== */}

                      <td>
                        <div className="recent-tryon-action">
                          <button
                            type="button"
                            aria-label={`View ${item.product.name} try-on request`}
                            className="recent-tryon-view-button"
                            onClick={() =>
                              handleViewRequest(item)
                            }
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}