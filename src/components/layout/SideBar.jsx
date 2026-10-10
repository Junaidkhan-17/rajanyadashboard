
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Sparkles,
  CreditCard,
  CalendarDays,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import logonew from "../../assets/logonew.png";
import logoIcon from "../../assets/logo2.png";

import "./SideBar.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Grid3X3,
  },
  {
    label: "Virtual Try-On",
    path: "/virtual-tryon",
    icon: Sparkles,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    label: "Rent Bookings",
    path: "/rent-bookings",
    icon: CalendarDays,
  },
];

export default function SideBar({ sidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    sessionStorage.clear();

    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`admin-sidebar ${
        sidebarOpen
          ? "admin-sidebar--expanded"
          : "admin-sidebar--collapsed"
      }`}
    >
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <img
          src={sidebarOpen ? logonew : logoIcon}
          alt="Rajanya Logo"
          className="admin-sidebar-logo-image"
        />
      </div>

      {/* Navigation */}
      <nav
        className="admin-sidebar-navigation"
        aria-label="Admin navigation"
      >
        <ul className="admin-sidebar-menu">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <li
                className="admin-sidebar-menu-item"
                key={item.path}
              >
                <NavLink
                  to={item.path}
                  end={item.end}
                  title={!sidebarOpen ? item.label : undefined}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    `admin-sidebar-link ${
                      isActive
                        ? "admin-sidebar-link--active"
                        : ""
                    }`
                  }
                >
                  <Icon
                    className="admin-sidebar-link-icon"
                    aria-hidden="true"
                  />

                  <span className="admin-sidebar-link-label">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="admin-sidebar-footer">
        <button
          type="button"
          onClick={handleLogout}
          className="admin-sidebar-logout"
          title={!sidebarOpen ? "Logout" : undefined}
          aria-label="Logout"
        >
          <LogOut
            className="admin-sidebar-link-icon"
            aria-hidden="true"
          />

          <span className="admin-sidebar-link-label">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
