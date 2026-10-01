import { Save, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ECategoryActions = ({
  onSaveDraft,
  onSaveCategory,
  saving = false,
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (saving) return;

    navigate("/categories");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-slate-200">
      {/* Cancel */}

      <button
        type="button"
        onClick={handleCancel}
        disabled={saving}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          px-6
          h-11
          rounded-xl
          border
          border-slate-300
          bg-white
          text-slate-700
          font-medium
          hover:bg-slate-50
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <X size={16} />
        Cancel
      </button>

      {/* Right Buttons */}

      <div className="flex gap-3">

        {/* Save Draft */}

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="
            px-6
            h-11
            border
            border-slate-300
            rounded-xl
            bg-white
            text-slate-700
            font-medium
            hover:bg-slate-50
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>

        {/* Update Category */}

        <button
          type="button"
          onClick={onSaveCategory}
          disabled={saving}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-6
            h-11
            bg-black
            text-white
            rounded-xl
            font-medium
            hover:bg-slate-800
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {saving ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />

              Updating...
            </>
          ) : (
            <>
              <Save size={16} />

              Update Category
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default ECategoryActions;