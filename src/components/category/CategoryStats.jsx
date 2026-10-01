import {
  FolderOpen,
  Package,
  Star,
  CheckCircle2,
} from "lucide-react";

import "./CategoryStats.css";

const icons = {
  totalCategories: {
    icon: FolderOpen,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },

  productsAssigned: {
    icon: Package,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },

  featuredCategories: {
    icon: Star,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },

  activeCategories: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
};

const labels = {
  totalCategories: {
    title: "Total Categories",
    subTitle: "All Categories",
  },

  productsAssigned: {
    title: "Products Assigned",
    subTitle: "Across All Categories",
  },

  featuredCategories: {
    title: "Featured Categories",
    subTitle: "Marked as Featured",
  },

  activeCategories: {
    title: "Active Categories",
    subTitle: "Currently Active",
  },
};

const CategoryStats = ({ stats = {} }) => {
  return (
    <div className="category-stats">
      {Object.entries(stats).map(
        ([key, value]) => {
          const Icon = icons[key]?.icon;

          if (!Icon) return null;

          return (
            <div
              key={key}
              className="category-stat-card"
            >
              <div className="category-stat-card__content">
                {/* Icon */}

                <div
                  className={`category-stat-card__icon-wrapper ${icons[key].bg}`}
                >
                  <Icon
                    className={`category-stat-card__icon ${icons[key].color}`}
                    aria-hidden="true"
                  />
                </div>

                {/* Information */}

                <div className="category-stat-card__info">
                  <p className="category-stat-card__title">
                    {labels[key].title}
                  </p>

                  <h2 className="category-stat-card__value">
                    {value}
                  </h2>

                  <p className="category-stat-card__subtitle">
                    {labels[key].subTitle}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
};

export default CategoryStats;