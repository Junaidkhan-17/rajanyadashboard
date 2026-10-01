const CategorySEOSettings = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Heading */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center text-xs font-bold">
          6
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          SEO Settings
        </h2>
      </div>

      {/* SEO Title */}

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          SEO Title
        </label>

        <input
          type="text"
          name="seoTitle"
          value={formData.seoTitle}
          onChange={handleChange}
          placeholder="Enter SEO title"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* SEO Description */}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          SEO Description
        </label>

        <textarea
          name="seoDescription"
          value={formData.seoDescription}
          onChange={handleChange}
          rows={4}
          placeholder="Enter SEO description"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    </div>
  );
};

export default CategorySEOSettings;