import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import TryOnTable from "../components/virtualTryOn/TryOnTable";
import TryStatsOn from "../components/virtualTryOn/TryStatsOn";

import api from "../services/api";

import "./VirtualTryOnPage.css";

const VirtualTryOnPage = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    failedRequests: 0,
    revenue: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    month: "",
    status: "",
    sort: "latest",
  });

  useEffect(() => {
    const fetchVirtualTryOnStats = async () => {
      try {
        const response = await api.get(
          "/virtual-try-on/admin/requests"
        );

        console.log(
          "VIRTUAL TRY-ON STATS:",
          response.data?.stats
        );

        if (response.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error(
          "Failed to fetch Virtual Try-On stats:",
          error
        );
      }
    };

    fetchVirtualTryOnStats();
  }, []);

  const handleDeleteSelected = () => {
    console.log("Delete Selected");
  };

  return (
    <div className="virtual-try-on-page">
      <header className="virtual-try-on-page__header">
        {/* Keep your existing header content here */}
      </header>

      <section
        className="virtual-try-on-page__stats"
        aria-label="Virtual try-on statistics"
      >
        <TryStatsOn stats={stats} />
      </section>

      <section
        className="virtual-try-on-page__requests"
        aria-label="Virtual try-on requests"
      >
        <TryOnTable filters={filters} />
      </section>
    </div>
  );
};

export default VirtualTryOnPage;