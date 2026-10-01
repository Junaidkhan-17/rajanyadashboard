import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Clock3,
  XCircle,
} from "lucide-react";

import TryOnCustomerCard from "../../components/viewTryOn/TryOnCustomerCard";
import TryOnProductCard from "../../components/viewTryOn/TryOnProductCard";
import TryOnPaymentCard from "../../components/viewTryOn/TryOnPaymentCard";
import TryOnPhotoSection from "../../components/viewTryOn/TryOnPhotoSection";
import TryOnProgressCard from "../../components/viewTryOn/TryOnProgressCard";

import api from "../../services/api";

const ViewTryOnPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ========================================
  // Backend Image URL
  // ========================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const baseURL = api.defaults.baseURL || "";

    return `${baseURL.replace(/\/api\/?$/, "")}${imagePath}`;
  };

  // ========================================
  // Format Date
  // ========================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ========================================
  // Fetch Real Virtual Try-On Request
  // ========================================

  useEffect(() => {
    const fetchTryOnRequest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          "/virtual-try-on/admin/requests"
        );

        console.log(
          "ADMIN VIRTUAL TRY-ON DETAIL RESPONSE:",
          response.data
        );

        const accounts = response.data?.data || [];

        let foundAccount = null;
        let foundHistory = null;

        // ========================================
        // Find Selected History Item
        // ========================================

        for (const account of accounts) {
          const history = Array.isArray(account.history)
            ? account.history
            : [];

          const historyItem = history.find(
            (item) => item._id === id
          );

          if (historyItem) {
            foundAccount = account;
            foundHistory = historyItem;
            break;
          }
        }

        if (!foundAccount || !foundHistory) {
          setError("Try-on request not found.");
          return;
        }

        const user = foundAccount.user || {};
        const product = foundHistory.product || {};

        // ========================================
        // Images
        // ========================================

        const uploadedImageUrl = getImageUrl(
          foundHistory.uploadedImage
        );

        const generatedImageUrl = getImageUrl(
          foundHistory.generatedImage
        );

        /*
        ========================================
        Prevent Old/Demo Records

        If generatedImage is exactly the same
        as uploadedImage, do not treat it as a
        real AI-generated result.
        ========================================
        */

        const validGeneratedImage =
          generatedImageUrl &&
          generatedImageUrl !== uploadedImageUrl
            ? generatedImageUrl
            : "";

        // ========================================
        // Normalize API Data
        // ========================================

        const normalizedRequest = {
          requestId: foundHistory._id
            ? `VTO-${foundHistory._id
                .slice(-6)
                .toUpperCase()}`
            : "-",

          requestDate: formatDateTime(
            foundHistory.generatedAt
          ),

          // ========================================
          // Payment
          // ========================================

          paymentStatus: "N/A",

          // ========================================
          // Try-On Status
          // ========================================

          status: validGeneratedImage
            ? "Completed"
            : "Pending",

          // ========================================
          // Images
          // ========================================

          beforeImage: uploadedImageUrl,

          afterImage: validGeneratedImage,

          generationTime: "-",

          // ========================================
          // Customer
          // ========================================

          customer: {
            name:
              user.fullName ||
              `${user.firstName || ""} ${
                user.lastName || ""
              }`.trim() ||
              "-",

            email: user.email || "-",

            phone: user.phone || "-",

            location: "-",
          },

          // ========================================
          // Product
          // ========================================

          product: {
            image:
              product.mainImage ||
              product.thumbnailImage ||
              "",

            name:
              foundHistory.productName ||
              product.name ||
              "-",

            category: "-",

            size: "-",

            price: "-",
          },

          // ========================================
          // Payment Details
          // ========================================

          payment: {
            paymentId: "-",

            method: "N/A",

            amount: "-",

            date: formatDateTime(
              foundHistory.generatedAt
            ),

            status: "N/A",
          },
        };

        console.log(
          "NORMALIZED VIEW TRY-ON REQUEST:",
          normalizedRequest
        );

        setRequest(normalizedRequest);
      } catch (error) {
        console.error(
          "Failed to fetch Virtual Try-On request:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load try-on request details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTryOnRequest();
    } else {
      setError("Invalid try-on request ID.");
      setLoading(false);
    }
  }, [id]);

  // ========================================
  // Delete
  // ========================================

  const handleDelete = () => {
    if (!window.confirm("Delete this Try-On Request?")) {
      return;
    }

    navigate(`/virtual-tryon/delete/${id}`);
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading...
      </div>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-red-500 gap-3">
        <p>{error}</p>

        <NavLink
          to="/virtual-tryon"
          className="h-11 px-5 rounded-xl border border-slate-300 flex items-center gap-2 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft size={18} />
          Back to History
        </NavLink>
      </div>
    );
  }

  // ========================================
  // No Request
  // ========================================

  if (!request) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-slate-500">
        No data found.
      </div>
    );
  }

  // ========================================
  // Payment Status
  // ========================================

  const paymentStatusMap = {
    Paid: {
      bg: "bg-green-100",
      text: "text-green-600",
      icon: (
        <CheckCircle2
          size={18}
          className="text-green-500"
        />
      ),
    },

    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      icon: (
        <Clock3
          size={18}
          className="text-yellow-500"
        />
      ),
    },

    Failed: {
      bg: "bg-red-100",
      text: "text-red-600",
      icon: (
        <XCircle
          size={18}
          className="text-red-500"
        />
      ),
    },

    "N/A": {
      bg: "bg-slate-100",
      text: "text-slate-500",
      icon: (
        <Clock3
          size={18}
          className="text-slate-400"
        />
      ),
    },
  };

  // ========================================
  // Try-On Status
  // ========================================

  const tryOnStatusMap = {
    Completed: {
      bg: "bg-green-100",
      text: "text-green-600",
      icon: (
        <CheckCircle2
          size={18}
          className="text-green-500"
        />
      ),
    },

    Processing: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      icon: (
        <Loader2
          size={18}
          className="text-orange-600 animate-spin"
        />
      ),
    },

    Pending: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      icon: (
        <Clock3
          size={18}
          className="text-blue-500"
        />
      ),
    },

    Failed: {
      bg: "bg-red-100",
      text: "text-red-600",
      icon: (
        <XCircle
          size={18}
          className="text-red-500"
        />
      ),
    },
  };

  const payment =
    paymentStatusMap[request.paymentStatus] ||
    paymentStatusMap["N/A"];

  const ai =
    tryOnStatusMap[request.status] ||
    tryOnStatusMap.Pending;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <NavLink
          to="/"
          className="text-slate-400 hover:text-black"
        >
          Dashboard
        </NavLink>

        <span>›</span>

        <NavLink
          to="/virtual-tryon"
          className="text-slate-400 hover:text-black"
        >
          Virtual Try-On
        </NavLink>

        <span>›</span>

        <span className="font-semibold">
          View Details
        </span>
      </div>

      {/* Title */}
      <div className="flex flex-col lg:flex-row justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            View Try-On Details
          </h1>
        </div>

        <div className="text-left lg:text-right">
          <p className="text-sm">
            <span className="text-slate-500">
              Request ID :
            </span>

            <span className="font-semibold ml-1">
              {request.requestId}
            </span>
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Requested on : {request.requestDate}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex gap-3">
          <NavLink
            to="/virtual-tryon"
            className="h-11 px-5 rounded-xl border border-slate-300 flex items-center gap-2 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back to History
          </NavLink>

          <button
            onClick={handleDelete}
            className="h-11 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            Delete Items
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Payment */}
          <div className="bg-white border rounded-xl px-5 h-11 flex items-center gap-3">
            {payment.icon}

            <span className="text-sm text-slate-600">
              Payment Status
            </span>

            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.bg} ${payment.text}`}
            >
              {request.paymentStatus?.toUpperCase()}
            </span>
          </div>

          {/* AI */}
          <div className="bg-white border rounded-xl px-5 h-11 flex items-center gap-3">
            {ai.icon}

            <span className="text-sm text-slate-600">
              AI Try-On Status
            </span>

            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${ai.bg} ${ai.text}`}
            >
              {request.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TryOnCustomerCard request={request} />

        <TryOnProductCard request={request} />

        <TryOnPaymentCard request={request} />
      </div>

      {/* Photo Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TryOnPhotoSection request={request} />
        </div>

        <div className="lg:col-span-4">
          <TryOnProgressCard request={request} />
        </div>
      </div>
    </div>
  );
};

export default ViewTryOnPage;