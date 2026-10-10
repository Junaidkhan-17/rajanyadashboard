
import { useState } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Footer from "./Footer";

import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <SideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="dashboard-layout-main">
        <NavBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="dashboard-layout-content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
