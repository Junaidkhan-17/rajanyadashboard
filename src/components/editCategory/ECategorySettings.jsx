import { CheckCircle2 } from "lucide-react";

const ECategorySettings = ({ category, setCategory }) => {
  const handleChange = (field, value) => {
    setCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const RadioGroup = ({ title, field }) => {
    const value = category?.[field] === true;

    return (
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
          {title}
        </p>

        <div className="flex items-center gap-8">
          {/* Yes */}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={field}
              className="hidden"
              checked={category?.[field] === true}
              onChange={() => handleChange(field, true)}
            />

            {value ? (
              <CheckCircle2
                size={20}
                className="text-green-500 fill-green-100"
              />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
            )}

            <span className="text-sm text-slate-700">
              Yes
            </span>
          </label>

          {/* No */}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={field}
              className="hidden"
              checked={category?.[field] === false}
              onChange={() => handleChange(field, false)}
            />

            {!value ? (
              <CheckCircle2
                size={20}
                className="text-red-500 fill-red-100"
              />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
            )}

            <span className="text-sm text-slate-700">
              No
            </span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold">
          5
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Display Settings
        </h2>
      </div>

      {/* Settings */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RadioGroup
          title="Featured Category"
          field="isFeatured"
        />

        <RadioGroup
          title="Show on Homepage"
          field="showOnHomepage"
        />

        <RadioGroup
          title="Show in Navigation Menu"
          field="showInNavigation"
        />
      </div>
      <div className="mt-8">
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Display Order
  </label>

  <input
    type="number"
    value={category?.displayOrder ?? 0}
    onChange={(e) =>
      handleChange("displayOrder", Number(e.target.value))
    }
    min="0"
    className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    placeholder="Enter display order"
  />
</div>
    </div>
  );
};

export default ECategorySettings;