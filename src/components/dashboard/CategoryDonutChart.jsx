import { useEffect, useMemo, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Flower2,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

import "./CategoryDonutChart.css";

// ============================================================
// Category Colors
// ============================================================

const CATEGORY_COLORS = [
  "#9B5CF6",
  "#3B82F6",
  "#F56C84",
  "#FF7A3D",
  "#14B8A6",
  "#EAB308",
  "#EC4899",
  "#6366F1",
];

// ============================================================
// Gender Normalization
// ============================================================

const normalizeGender = (gender) => {
  const value = String(gender || "")
    .trim()
    .toLowerCase();

  if (
    value === "men" ||
    value === "male" ||
    value === "mens" ||
    value === "men's" ||
    value === "m"
  ) {
    return "men";
  }

  if (
    value === "women" ||
    value === "female" ||
    value === "womens" ||
    value === "women's" ||
    value === "w"
  ) {
    return "women";
  }

  if (
    value === "unisex" ||
    value === "uni"
  ) {
    return "unisex";
  }

  return "other";
};

// ============================================================
// Percentage Helper
// ============================================================

const calculatePercentage = (value, total) => {
  if (!total) {
    return 0;
  }

  return Math.round(
    (Number(value || 0) / total) * 100
  );
};

// ============================================================
// Custom Tooltip
// ============================================================

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  return (
    <div className="category-donut-tooltip">
      <p className="category-donut-tooltip-name">
        {item.name}
      </p>

      <p className="category-donut-tooltip-value">
        {Number(item.value || 0).toLocaleString("en-IN")}{" "}
        products
      </p>

      <p className="category-donut-tooltip-percentage">
        {item.percentage}%
      </p>
    </div>
  );
}

// ============================================================
// Loading Section
// ============================================================

function DonutLoadingSection({ title }) {
  return (
    <div className="category-donut-section">
      <h4 className="category-donut-section-title">
        {title}
      </h4>

      <div className="category-donut-loading-layout">
        <div className="category-donut-loading-circle">
          <div className="category-donut-loading-inner" />
        </div>

        <div className="category-donut-loading-legend">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Donut Section
// ============================================================

function DonutSection({
  title,
  total,
  data,
}) {
  if (!data.length || total <= 0) {
    return null;
  }

  return (
    <div className="category-donut-section">
      {/* ======================================================
          Section Title
      ======================================================= */}

      <h4 className="category-donut-section-title">
        {title}
      </h4>

      {/* ======================================================
          Chart + Legend
      ======================================================= */}

      <div className="category-donut-content">
        {/* ====================================================
            Donut
        ===================================================== */}

        <div
          className="category-donut-chart-wrapper"
          role="img"
          aria-label={`${title} category distribution with ${total} products`}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="54%"
                outerRadius="78%"
                paddingAngle={2}
                stroke="none"
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((item, index) => (
                  <Cell
                    key={`${item.name}-${index}`}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* ==================================================
              Center
          =================================================== */}

          <div className="category-donut-center">
            <p className="category-donut-center-label">
              TOTAL
            </p>

            <h3 className="category-donut-center-value">
              {total.toLocaleString("en-IN")}
            </h3>

            <p className="category-donut-center-caption">
              Products
            </p>
          </div>
        </div>

        {/* ====================================================
            Legend
        ===================================================== */}

        <div
          className="category-donut-legend"
          aria-label={`${title} category legend`}
        >
          {data.map((item) => (
            <div
              key={item.name}
              className="category-donut-legend-item"
            >
              <div className="category-donut-legend-name">
                <span
                  className="category-donut-legend-dot"
                  style={{
                    backgroundColor: item.color,
                  }}
                  aria-hidden="true"
                />

                <span
                  className="category-donut-legend-text"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>

              <span className="category-donut-legend-value">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function CategoryDonutChart() {
  const [
    categoryDistribution,
    setCategoryDistribution,
  ] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // Fetch Dashboard Data
  // ==========================================================

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/dashboard/stats"
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to fetch category data."
        );
      }

      const distribution =
        response.data?.stats
          ?.categoryDistribution || [];

      setCategoryDistribution(
        Array.isArray(distribution)
          ? distribution
          : []
      );
    } catch (err) {
      console.error(
        "Category Donut Chart Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load category data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Initial Load
  // ==========================================================

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // ==========================================================
  // Prepare Gender-Based Data
  // ==========================================================

  const preparedData = useMemo(() => {
    const createGenderData = (gender) => {
      const records =
        categoryDistribution.filter(
          (item) =>
            normalizeGender(item.gender) ===
            gender
        );

      // ------------------------------------------------------
      // Combine duplicate category names
      // ------------------------------------------------------

      const categoryMap = new Map();

      records.forEach((item) => {
        const categoryName =
          item.categoryName?.trim() ||
          "Uncategorized";

        const existingCount =
          categoryMap.get(categoryName) || 0;

        categoryMap.set(
          categoryName,
          existingCount +
            Number(item.productCount || 0)
        );
      });

      // ------------------------------------------------------
      // Convert Map → Array
      // ------------------------------------------------------

      const categoryRecords = Array.from(
        categoryMap.entries()
      )
        .map(([name, value]) => ({
          name,
          value,
        }))
        .filter(
          (item) => item.value > 0
        )
        .sort(
          (a, b) => b.value - a.value
        );

      // ------------------------------------------------------
      // Total
      // ------------------------------------------------------

      const total = categoryRecords.reduce(
        (sum, item) =>
          sum + Number(item.value || 0),
        0
      );

      // ------------------------------------------------------
      // Add percentage + color
      // ------------------------------------------------------

      const data = categoryRecords.map(
        (item, index) => ({
          name: item.name,

          value: Number(
            item.value || 0
          ),

          percentage:
            calculatePercentage(
              item.value,
              total
            ),

          color:
            CATEGORY_COLORS[
              index %
                CATEGORY_COLORS.length
            ],
        })
      );

      return {
        total,
        data,
      };
    };

    return {
      men: createGenderData("men"),

      women: createGenderData("women"),

      unisex: createGenderData(
        "unisex"
      ),

      other: createGenderData("other"),
    };
  }, [categoryDistribution]);

  // ==========================================================
  // Total Validation
  // ==========================================================

  const representedProductCount =
    preparedData.men.total +
    preparedData.women.total +
    preparedData.unisex.total +
    preparedData.other.total;

  const totalProducts =
    Number(representedProductCount);

  // ==========================================================
  // Error State
  // ==========================================================

  if (!loading && error) {
    return (
      <div className="category-donut-card bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
        <div className="category-donut-header">
          <div className="category-donut-heading-wrapper">
            <h2 className="category-donut-title">
              Product Category Distribution
            </h2>

            <p className="category-donut-subtitle">
              Product distribution by gender
            </p>
          </div>

          <div className="category-donut-header-icon">
            <Flower2
              size={18}
              className="text-slate-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="category-donut-error">
          <div className="category-donut-error-icon">
            !
          </div>

          <p className="category-donut-error-title">
            Unable to load categories
          </p>

          <p className="category-donut-error-message">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCategoryData}
            className="category-donut-retry-button"
          >
            <RefreshCw
              size={15}
              aria-hidden="true"
            />

            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // Main Render
  // ==========================================================

  return (
    <div className="category-donut-card bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
      {/* =====================================================
          Header
      ====================================================== */}

      <div className="category-donut-header flex items-center justify-between mb-6">
        <div className="category-donut-heading-wrapper">
          <h2 className="category-donut-title text-[16px] font-bold text-slate-800">
            Product Category Distribution
          </h2>

          <p className="category-donut-subtitle">
            Product distribution by gender
          </p>
        </div>

        <div className="category-donut-header-icon">
          <Flower2
            size={18}
            className="text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* =====================================================
          Loading
      ====================================================== */}

      {loading ? (
        <>
          <DonutLoadingSection
            title="MEN'S WEAR"
          />

          <DonutLoadingSection
            title="WOMEN'S WEAR"
          />

          <DonutLoadingSection
            title="UNISEX"
          />
        </>
      ) : (
        <>
          {/* =================================================
              Men's Wear
          ================================================== */}

          <DonutSection
            title="MEN'S WEAR"
            total={
              preparedData.men.total
            }
            data={
              preparedData.men.data
            }
          />

          {/* =================================================
              Women's Wear
          ================================================== */}

          <DonutSection
            title="WOMEN'S WEAR"
            total={
              preparedData.women.total
            }
            data={
              preparedData.women.data
            }
          />

          {/* =================================================
              Unisex
          ================================================== */}

          <DonutSection
            title="UNISEX"
            total={
              preparedData.unisex.total
            }
            data={
              preparedData.unisex.data
            }
          />

          {/* =================================================
              Other
          ================================================== */}

          <DonutSection
            title="OTHER"
            total={
              preparedData.other.total
            }
            data={
              preparedData.other.data
            }
          />

          {/* =================================================
              Total Products Footer
          ================================================== */}

          {totalProducts > 0 && (
            <div className="category-donut-total-footer">
              <span>
                Total Products Represented
              </span>

              <strong>
                {totalProducts.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          )}
        </>
      )}
    </div>
  );
}