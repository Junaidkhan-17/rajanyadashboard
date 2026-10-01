const VCategoryInformation = ({ category }) => {
  if (!category) {
    return (
      <div className="p-6 text-center text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Category Image */}

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={
            category.image ||
            "https://via.placeholder.com/100x100?text=Category"
          }
          alt={category.name || "Category"}
          className="w-16 h-16 rounded-full object-cover border border-slate-200"
        />

        <div className="flex-1">
          {/* Heading */}

          <h2 className="text-xl font-semibold text-slate-900">
            Category Information
          </h2>

          {/* Details */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

            {/* Category Name */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Category Name
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {category.name || "-"}
              </p>
            </div>

            {/* Slug */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Category Slug
              </p>

              <p className="mt-2 font-semibold text-slate-800 break-all">
                {category.slug || "-"}
              </p>
            </div>

            {/* Parent Category */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Parent Category
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {category.parentCategory || "No Parent"}
              </p>
            </div>

            {/* Gender */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Gender
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {category.gender || "-"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VCategoryInformation;