import { CheckCircle2 } from "lucide-react";

const ECategoryStatus = ({ category, setCategory }) => {
  const handleStatusChange = (isActive) => {
    setCategory((prev) => ({
      ...prev,
      isActive,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold">
          4
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Category Status
        </h2>
      </div>

      <p className="text-sm text-slate-500 mb-8">
        Enable or disable this category based on its availability and display
        requirements.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-5">
          Status <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-12">
          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={category?.isActive === true}
              onChange={() => handleStatusChange(true)}
              className="hidden"
            />

            {category?.isActive === true ? (
              <CheckCircle2
                size={24}
                className="text-green-500 fill-green-100"
              />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
            )}

            <span className="text-base text-slate-700">
              Active
            </span>
          </label>

          {/* Inactive */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="Inactive"
              checked={category?.isActive === false}
              onChange={() => handleStatusChange(false)}
              className="hidden"
            />

            {category?.isActive === false ? (
              <CheckCircle2
                size={24}
                className="text-red-500 fill-red-100"
              />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
            )}

            <span className="text-base text-slate-700">
              Inactive
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ECategoryStatus;