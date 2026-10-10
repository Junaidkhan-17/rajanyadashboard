
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  User,
  Monitor,
  CreditCard,
  Package,
  UserPlus,
  Star,
  MessageSquare,
  FileText,
  CheckCheck,
  RefreshCw,
  CalendarDays,
  Inbox,
} from "lucide-react";

import api from "../services/api";
import "./NotificationsPage.css";

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

const formatDateGroup = (createdAt) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "Other";

  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

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
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

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

const normalizeNotification = (notification) => ({
  ...notification,
  id: notification._id || notification.id,
  unread:
    notification.isRead === undefined
      ? Boolean(notification.unread)
      : !notification.isRead,
  icon: iconMap[notification.icon] ? notification.icon : "Bell",
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Unable to load notifications. Please try again.";

export default function NotificationsPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [filterDate, setFilterDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/notifications", {
        params: { page: 1, limit: 100 },
      });

      const payload = response.data?.data ?? response.data;

      const list = Array.isArray(payload?.notifications)
        ? payload.notifications
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setNotifications(list.map(normalizeNotification));

      setUnreadCount(
        Number.isFinite(Number(payload?.unreadCount)) &&
          payload?.unreadCount !== undefined &&
          payload?.unreadCount !== null
          ? Number(payload.unreadCount)
          : list.filter((item) => !item.isRead).length
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        const first = new Date(a.createdAt).getTime() || 0;
        const second = new Date(b.createdAt).getTime() || 0;

        return sortBy === "oldest" ? first - second : second - first;
      }),
    [notifications, sortBy]
  );

  const filteredNotifications = useMemo(
    () =>
      filterDate
        ? sortedNotifications.filter(
            (notification) =>
              formatDateForInput(notification.createdAt) === filterDate
          )
        : sortedNotifications,
    [filterDate, sortedNotifications]
  );

  const groupedNotifications = useMemo(
    () =>
      filteredNotifications.reduce((groups, notification) => {
        const groupName = formatDateGroup(notification.createdAt);

        if (!groups[groupName]) groups[groupName] = [];

        groups[groupName].push(notification);

        return groups;
      }, {}),
    [filteredNotifications]
  );

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

      setUnreadCount((count) => Math.max(0, count - 1));
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

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div className="notifications-header__top">
          <div className="notifications-heading">
            <div className="notifications-heading__icon">
              <Bell size={21} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="notifications-heading__indicator" />
              )}
            </div>

            <div className="notifications-heading__content">
              <span className="notifications-eyebrow">
                Rajanya Administration
              </span>

              <h1 className="notifications-title">Notifications</h1>

              <p className="notifications-subtitle">
                Stay updated with bookings, payments, and platform activity.
              </p>
            </div>
          </div>

          <div className="notifications-header__actions">
            <button
              type="button"
              className="notifications-button notifications-button--secondary"
              onClick={() => fetchNotifications(true)}
              disabled={refreshing || loading}
            >
              <RefreshCw
                size={15}
                className={refreshing ? "notifications-spin" : ""}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              className="notifications-button notifications-button--primary"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || markingAll || updatingId !== null}
            >
              <CheckCheck size={16} />
              <span>{markingAll ? "Updating..." : "Mark all as read"}</span>
            </button>
          </div>
        </div>

        <div className="notifications-header__bottom">
          <div className="notifications-summary" aria-live="polite">
            <span className="notifications-summary__total">
              {notifications.length}
            </span>
            <span>loaded notifications</span>

            <span className="notifications-summary__separator" />

            <span className="notifications-summary__unread">
              {unreadCount} unread
            </span>
          </div>

          <div className="notifications-toolbar">
            <label className="notifications-control notifications-date-control">
              <CalendarDays
                size={15}
                className="notifications-control__icon"
              />

              <span className="notifications-control__label">Date</span>

              <input
                type="date"
                aria-label="Filter notifications by date"
                value={filterDate}
                onChange={(event) => setFilterDate(event.target.value)}
              />
            </label>

            <label className="notifications-control notifications-sort-control">
              <span className="notifications-control__label">Sort</span>

              <select
                aria-label="Sort notifications"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>

            {filterDate && (
              <button
                type="button"
                className="notifications-clear-filter"
                onClick={() => setFilterDate("")}
              >
                Clear date
              </button>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="notifications-error" role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => fetchNotifications(true)}
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <section className="notifications-state">
          <span className="notifications-loader" />
          <p>Loading notifications...</p>
          <span className="notifications-state__hint">
            Fetching your latest platform activity.
          </span>
        </section>
      ) : (
        <div className="notifications-feed">
          {Object.entries(groupedNotifications).map(([groupName, items]) => (
            <section
              className="notifications-group"
              key={groupName}
              aria-label={`${groupName} notifications`}
            >
              <div className="notifications-group__heading">
                <span className="notifications-group__line" />
                <h2>{groupName}</h2>
                <span className="notifications-group__count">
                  {items.length}
                </span>
                <span className="notifications-group__line" />
              </div>

              <div className="notifications-group__list">
                {items.map((notification) => {
                  const Icon = iconMap[notification.icon] || Bell;

                  return (
                    <article
                      key={notification.id}
                      className={`notification-card ${
                        notification.unread
                          ? "notification-card--unread"
                          : "notification-card--read"
                      }`}
                    >
                      <span
                        className="notification-card__accent"
                        style={{
                          backgroundColor:
                            notification.lineColor || "#e2e8f0",
                        }}
                        aria-hidden="true"
                      />

                      <div
                        className="notification-card__icon"
                        style={{
                          backgroundColor:
                            notification.iconColor || "#64748b",
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={19} strokeWidth={1.8} />
                      </div>

                      <div className="notification-card__content">
                        <div className="notification-card__title-row">
                          <h3>{notification.title}</h3>

                          {notification.unread && (
                            <span className="notification-card__badge">
                              New
                            </span>
                          )}
                        </div>

                        <p className="notification-card__description">
                          {notification.description}
                        </p>

                        <div className="notification-card__metadata">
                          <span className="notification-card__relative-time">
                            {formatTimeAgo(notification.createdAt)}
                          </span>

                          <span
                            className="notification-card__metadata-dot"
                            aria-hidden="true"
                          />

                          <time
                            dateTime={notification.createdAt}
                            className="notification-card__absolute-time"
                          >
                            {new Date(
                              notification.createdAt
                            ).toLocaleString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                      </div>

                      <div className="notification-card__actions">
                        {notification.unread ? (
                          <button
                            type="button"
                            className="notification-card__read-button"
                            onClick={() => markAsRead(notification)}
                            disabled={
                              updatingId !== null || markingAll
                            }
                            aria-label={`Mark ${notification.title} as read`}
                            title="Mark as read"
                          >
                            <CheckCheck size={17} />
                            <span>
                              {updatingId === notification.id
                                ? "Saving..."
                                : "Mark read"}
                            </span>
                          </button>
                        ) : (
                          <span
                            className="notification-card__read-status"
                            title="Already read"
                          >
                            <CheckCheck size={17} />
                            <span>Read</span>
                          </span>
                        )}

                        <span
                          className={`notification-card__status-dot ${
                            notification.unread
                              ? "notification-card__status-dot--unread"
                              : "notification-card__status-dot--read"
                          }`}
                          title={notification.unread ? "Unread" : "Read"}
                          aria-label={
                            notification.unread ? "Unread" : "Read"
                          }
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          {filteredNotifications.length === 0 && (
            <section className="notifications-empty">
              <div className="notifications-empty__icon">
                <Inbox size={27} strokeWidth={1.6} />
              </div>

              <h2>
                {notifications.length === 0
                  ? "You're all caught up"
                  : "No notifications found"}
              </h2>

              <p>
                {notifications.length === 0
                  ? "New booking and payment activity will appear here."
                  : "Try selecting a different date or clear your date filter."}
              </p>

              {filterDate && (
                <button
                  type="button"
                  className="notifications-button notifications-button--secondary"
                  onClick={() => setFilterDate("")}
                >
                  Clear date filter
                </button>
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
