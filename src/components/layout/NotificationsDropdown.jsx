
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  CreditCard,
  FileText,
  Monitor,
  Package,
  Star,
  User,
  UserPlus,
  MessageSquare,
  RefreshCw,
  CalendarDays,
  CheckCheck,
  CircleAlert,
  Inbox,
  X,
} from "lucide-react";

import api from "../../services/api";
import "./NotificationsDropdown.css";

const iconMap = {
  Bell,
  User,
  Monitor,
  CreditCard,
  Package,
  UserPlus,
  Star,
  MessageSquare,
  FileText,
};

const getIcon = (name) => iconMap[name] || Bell;

const getNotificationStyle = (notification) => {
  const colors = {
    booking_created: {
      iconColor: "#2563eb",
      lineColor: "#dbeafe",
      backgroundColor: "#eff6ff",
    },
    vto_payment_success: {
      iconColor: "#059669",
      lineColor: "#a7f3d0",
      backgroundColor: "#ecfdf5",
    },
  };

  const defaults = colors[notification.type] || {
    iconColor: "#64748b",
    lineColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  };

  return {
    ...defaults,
    iconColor: notification.iconColor || defaults.iconColor,
    lineColor: notification.lineColor || defaults.lineColor,
  };
};

const normalizeNotification = (item) => ({
  ...item,
  id: item._id || item.id,
  unread:
    item.isRead !== undefined
      ? !item.isRead
      : Boolean(item.unread),
  icon: getIcon(item.icon) ? item.icon : "Bell",
});

const formatDateGroup = (createdAt) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "Other";

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateForInput = (createdAt) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTimeAgo = (createdAt) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Unable to load notifications. Please try again.";

export default function NotificationsDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const notificationsRef = useRef(null);
  const requestRef = useRef(false);

  const fetchNotifications = useCallback(
    async (manualRefresh = false) => {
      if (requestRef.current) return;

      requestRef.current = true;

      if (manualRefresh) {
        setRefreshing(true);
      } else if (notifications.length === 0) {
        setLoading(true);
      }

      setError("");

      try {
        const response = await api.get("/notifications", {
          params: {
            page: 1,
            limit: 50,
          },
        });

        const payload = response.data?.data ?? response.data;

        const list = Array.isArray(payload?.notifications)
          ? payload.notifications
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setNotifications(list.map(normalizeNotification));

        const count = Number(payload?.unreadCount);

        setUnreadCount(
          payload?.unreadCount !== undefined &&
            payload?.unreadCount !== null &&
            Number.isFinite(count)
            ? count
            : list.filter(
                (item) => item.isRead !== true && item.unread !== false
              ).length
        );
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        requestRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [notifications.length]
  );

  useEffect(() => {
    if (!showNotifications) return undefined;

    fetchNotifications();

    const intervalId = window.setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [showNotifications, fetchNotifications]);

  useEffect(() => {
    if (!showNotifications) return undefined;

    const handlePointerDown = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    setShowNotifications((previous) => !previous);
  };

  const markAsRead = async (notification) => {
    if (!notification.unread || updatingId || markingAll) return;

    setUpdatingId(notification.id);
    setError("");

    try {
      await api.patch(`/notifications/${notification.id}/read`);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, unread: false, isRead: true }
            : item
        )
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setUpdatingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0 || markingAll || updatingId) return;

    setMarkingAll(true);
    setError("");

    try {
      await api.patch("/notifications/read-all");

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          unread: false,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setMarkingAll(false);
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const first = new Date(a.createdAt).getTime() || 0;
    const second = new Date(b.createdAt).getTime() || 0;

    return sortBy === "oldest" ? first - second : second - first;
  });

  const filteredNotifications = filterDate
    ? sortedNotifications.filter(
        (item) => formatDateForInput(item.createdAt) === filterDate
      )
    : sortedNotifications;

  const groupedNotifications = filteredNotifications.reduce(
    (groups, item) => {
      const group = formatDateGroup(item.createdAt);

      if (!groups[group]) groups[group] = [];
      groups[group].push(item);

      return groups;
    },
    {}
  );

  return (
    <div
      className="rajanya-notification"
      ref={notificationsRef}
    >
      <button
        type="button"
        className="rajanya-notification__trigger"
        onClick={toggleNotifications}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={showNotifications}
        aria-haspopup="dialog"
      >
        <Bell size={21} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="rajanya-notification__trigger-dot" />
        )}

        {unreadCount > 0 && (
          <span className="rajanya-notification__trigger-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <section
          className="rajanya-notification__panel"
          role="dialog"
          aria-label="Notifications"
        >
          <header className="rajanya-notification__header">
            <div className="rajanya-notification__heading">
              <div className="rajanya-notification__heading-icon">
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="rajanya-notification__heading-dot" />
                )}
              </div>

              <div className="rajanya-notification__heading-content">
                <span className="rajanya-notification__eyebrow">
                  Rajanya Administration
                </span>

                <h2>Notifications</h2>

                <p>
                  {unreadCount} unread · {notifications.length} loaded
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rajanya-notification__close"
              onClick={() => setShowNotifications(false)}
              aria-label="Close notifications"
            >
              <X size={19} />
            </button>
          </header>

          <div className="rajanya-notification__toolbar">
            <label className="rajanya-notification__date-control">
              <CalendarDays size={16} />

              <input
                type="date"
                aria-label="Filter notifications by date"
                value={filterDate}
                onChange={(event) => setFilterDate(event.target.value)}
              />
            </label>

            <label className="rajanya-notification__sort-control">
              <span className="rajanya-notification__sr-only">Sort</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort notifications"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>

          <div className="rajanya-notification__actions">
            <span className="rajanya-notification__result-count">
              {filteredNotifications.length} notifications
            </span>

            <button
              type="button"
              className="rajanya-notification__action-button"
              onClick={() => fetchNotifications(true)}
              disabled={refreshing || loading}
            >
              <RefreshCw
                size={14}
                className={
                  refreshing ? "rajanya-notification__spin" : ""
                }
              />
              <span>{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>

            <button
              type="button"
              className="rajanya-notification__action-button rajanya-notification__action-button--read"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || markingAll || updatingId !== null}
            >
              <CheckCheck size={14} />
              <span>{markingAll ? "Saving..." : "Mark all read"}</span>
            </button>
          </div>

          {error && (
            <div className="rajanya-notification__error" role="alert">
              <CircleAlert size={17} />
              <p>{error}</p>
              <button
                type="button"
                onClick={() => fetchNotifications(true)}
              >
                Retry
              </button>
            </div>
          )}

          <div className="rajanya-notification__feed">
            {loading && notifications.length === 0 ? (
              <div className="rajanya-notification__state">
                <span className="rajanya-notification__loader" />
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="rajanya-notification__state rajanya-notification__state--empty">
                <div className="rajanya-notification__empty-icon">
                  <Inbox size={27} />
                </div>

                <h3>
                  {notifications.length === 0
                    ? "You're all caught up"
                    : "No notifications found"}
                </h3>

                <p>
                  {notifications.length === 0
                    ? "New booking and payment activity will appear here."
                    : "Try another date or clear your filter."}
                </p>

                {filterDate && (
                  <button
                    type="button"
                    className="rajanya-notification__clear-filter"
                    onClick={() => setFilterDate("")}
                  >
                    Clear date filter
                  </button>
                )}
              </div>
            ) : (
              Object.entries(groupedNotifications).map(
                ([groupName, items]) => (
                  <section
                    className="rajanya-notification__group"
                    key={groupName}
                  >
                    <div className="rajanya-notification__group-heading">
                      <span />
                      <h3>{groupName}</h3>
                      <span />
                    </div>

                    {items.map((notification) => {
                      const Icon = getIcon(notification.icon);
                      const style = getNotificationStyle(notification);

                      return (
                        <article
                          className={`rajanya-notification__card ${
                            notification.unread
                              ? "rajanya-notification__card--unread"
                              : ""
                          }`}
                          key={notification.id}
                        >
                          <span
                            className="rajanya-notification__accent"
                            style={{ backgroundColor: style.lineColor }}
                          />

                          <div
                            className="rajanya-notification__icon"
                            style={{
                              backgroundColor: style.backgroundColor,
                              color: style.iconColor,
                            }}
                          >
                            <Icon size={19} strokeWidth={1.8} />
                          </div>

                          <div className="rajanya-notification__content">
                            <div className="rajanya-notification__title-row">
                              <h4>{notification.title}</h4>

                              {notification.unread && (
                                <span className="rajanya-notification__new">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="rajanya-notification__description">
                              {notification.description}
                            </p>

                            {notification.referenceNumber && (
                              <p className="rajanya-notification__reference">
                                Reference: {notification.referenceNumber}
                              </p>
                            )}

                            {notification.amount > 0 && (
                              <p className="rajanya-notification__amount">
                                Amount:{" "}
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                  maximumFractionDigits: 2,
                                }).format(notification.amount)}
                              </p>
                            )}

                            <div className="rajanya-notification__metadata">
                              <span>{formatTimeAgo(notification.createdAt)}</span>
                              <span className="rajanya-notification__metadata-dot" />
                              <time dateTime={notification.createdAt}>
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </time>
                            </div>

                            {notification.unread && (
                              <button
                                type="button"
                                className="rajanya-notification__mark-read"
                                onClick={() => markAsRead(notification)}
                                disabled={
                                  updatingId !== null || markingAll
                                }
                              >
                                <CheckCheck size={14} />
                                {updatingId === notification.id
                                  ? "Saving..."
                                  : "Mark as read"}
                              </button>
                            )}
                          </div>

                          <span
                            className={`rajanya-notification__status ${
                              notification.unread
                                ? "rajanya-notification__status--unread"
                                : ""
                            }`}
                            title={notification.unread ? "Unread" : "Read"}
                          />
                        </article>
                      );
                    })}
                  </section>
                )
              )
            )}
          </div>

          <footer className="rajanya-notification__footer">
            <span>
              <span className="rajanya-notification__live-dot" />
              Live notification feed
            </span>

            <button
              type="button"
              onClick={() => setShowNotifications(false)}
            >
              Close
            </button>
          </footer>
        </section>
      )}
    </div>
  );
}
