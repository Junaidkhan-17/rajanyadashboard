
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react";

import NotificationsDropdown from "./NotificationsDropdown";
import { useAuth } from "../../context/AuthContext";

import "./NavBar.css";

export default function NavBar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [navbarSearch, setNavbarSearch] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getSearchRoute = (query) => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return "/products";

    if (
      normalized.includes("category") ||
      normalized.includes("categories")
    ) {
      return "/categories";
    }

    if (
      normalized.includes("virtual") ||
      normalized.includes("tryon") ||
      normalized.includes("try on")
    ) {
      return "/virtual-tryon";
    }

    if (
      normalized.includes("booking") ||
      normalized.includes("bookings") ||
      normalized.includes("rent")
    ) {
      return "/rent-bookings";
    }

    if (
      normalized.includes("payment") ||
      normalized.includes("payments")
    ) {
      return "/payments";
    }

    return "/products";
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      navigate(getSearchRoute(navbarSearch));
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">
        {/* Left Section */}
        <div className="admin-navbar-left">
          <button
            type="button"
            onClick={toggleSidebar}
            className="admin-navbar-menu-button"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={Boolean(sidebarOpen)}
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          {/* Desktop Search */}
          <div className="admin-navbar-search">
            <Search
              size={18}
              className="admin-navbar-search-icon"
              aria-hidden="true"
            />

            <input
              type="search"
              value={navbarSearch}
              onChange={(event) => setNavbarSearch(event.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search products, categories..."
              aria-label="Search dashboard"
              className="admin-navbar-search-input"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="admin-navbar-right">
          <div className="admin-navbar-notifications">
            <NotificationsDropdown />
          </div>

          {/* Profile */}
          <div className="admin-navbar-profile">
            <button
              type="button"
              onClick={() =>
                setProfileDropdownOpen((previous) => !previous)
              }
              className="admin-navbar-profile-button"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              aria-label="Open admin profile menu"
            >
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt=""
                className="admin-navbar-profile-avatar"
              />

              <div className="admin-navbar-profile-details">
                <h4 className="admin-navbar-profile-name">
                  {user?.fullName || "Admin"}
                </h4>

                <p className="admin-navbar-profile-role">Admin</p>
              </div>

              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`admin-navbar-profile-chevron ${
                  profileDropdownOpen ? "is-open" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <>
                <button
                  type="button"
                  className="admin-navbar-dropdown-backdrop"
                  aria-label="Close profile menu"
                  onClick={() => setProfileDropdownOpen(false)}
                />

                <div className="admin-navbar-dropdown">
                  <div className="admin-navbar-dropdown-header">
                    <p className="admin-navbar-dropdown-name">
                      {user?.fullName || "Admin"}
                    </p>

                    <p className="admin-navbar-dropdown-email">
                      {user?.email || "No email available"}
                    </p>
                  </div>

                  <div className="admin-navbar-dropdown-actions">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="admin-navbar-dropdown-logout"
                    >
                      <LogOut size={17} aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
