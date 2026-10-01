import { Check } from "lucide-react";

const VCategorySettings = ({ category }) => {
  const isFeatured = category?.isFeatured === true;
  const showOnHomepage = category?.showOnHomepage === true;
  const showInNavigation = category?.showInNavigation === true;

  return (
    <div>
      {/* Heading */}

      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">
          Display Settings
        </h2>
      </div>

      {/* Body */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">

        {/* Featured */}

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            Featured Category
          </p>

          <div className="flex items-center gap-2">
            <Check
              size={16}
              className={
                isFeatured
                  ? "text-green-500"
                  : "text-slate-300"
              }
            />

            <span className="font-medium text-slate-700">
              {isFeatured ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Homepage */}

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            Show On Homepage
          </p>

          <div className="flex items-center gap-2">
            <Check
              size={16}
              className={
                showOnHomepage
                  ? "text-green-500"
                  : "text-slate-300"
              }
            />

            <span className="font-medium text-slate-700">
              {showOnHomepage ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Navigation */}

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            Show In Navigation Menu
          </p>

          <div className="flex items-center gap-2">
            <Check
              size={16}
              className={
                showInNavigation
                  ? "text-green-500"
                  : "text-slate-300"
              }
            />

            <span className="font-medium text-slate-700">
              {showInNavigation ? "Yes" : "No"}
            </span>
          </div>
        </div>
                {/* Display Order */}

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            Display Order
          </p>

          <span className="font-medium text-slate-700">
            {category?.displayOrder ?? 0}
          </span>
        </div>

      </div>
    </div>
  );
};

export default VCategorySettings;