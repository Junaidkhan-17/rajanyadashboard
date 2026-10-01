import { Plus, Trash2 } from "lucide-react";
import "./PricingInformation.css";

const PricingInformation = ({ productData, setProductData }) => {
  const pricingRows = productData.durationPricing || [];

  const addRow = () => {
    setProductData((prev) => ({
      ...prev,
      durationPricing: [
        ...(prev.durationPricing || []),
        {
          days: "",
          discountPrice: "",
          totalPrice: "",
        },
      ],
    }));
  };

  const deleteRow = (index) => {
    const updated = [...pricingRows];
    updated.splice(index, 1);

    setProductData((prev) => ({
      ...prev,
      durationPricing:
        updated.length > 0
          ? updated
          : [
              {
                days: "",
                discountPrice: "",
                totalPrice: "",
              },
            ],
    }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...pricingRows];
    updated[index][field] = value;

    setProductData((prev) => ({
      ...prev,
      durationPricing: updated,
    }));
  };

  return (
    <div className="pricing-information-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="pricing-information-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="pricing-information-title-wrapper flex items-center gap-3 min-w-0">
          <div className="pricing-information-step w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-semibold shrink-0">
            4
          </div>

          <h2 className="pricing-information-title text-lg font-semibold text-slate-800">
            Pricing Information
          </h2>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="pricing-add-button flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          <Plus size={14} />
          <span>Add Duration Price</span>
        </button>
      </div>

      {/* Pricing Rows */}
      <div className="pricing-rows space-y-4">
        {pricingRows.map((row, index) => (
          <div
            key={index}
            className="pricing-row grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            {/* Days */}
            <div className="pricing-field">
              <label className="pricing-label block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                No. Of Days
              </label>

              <input
                type="number"
                value={row.days}
                onChange={(e) =>
                  handleChange(index, "days", e.target.value)
                }
                placeholder="3"
                className="pricing-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black"
              />
            </div>

            {/* Discount Price */}
            <div className="pricing-field">
              <label className="pricing-label block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Discount Price
              </label>

              <input
                type="number"
                value={row.discountPrice}
                onChange={(e) =>
                  handleChange(
                    index,
                    "discountPrice",
                    e.target.value
                  )
                }
                placeholder="4495"
                className="pricing-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black"
              />
            </div>

            {/* Total Price */}
            <div className="pricing-field">
              <label className="pricing-label block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Total Price
              </label>

              <input
                type="number"
                value={row.totalPrice}
                onChange={(e) =>
                  handleChange(
                    index,
                    "totalPrice",
                    e.target.value
                  )
                }
                placeholder="8454"
                className="pricing-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black"
              />
            </div>

            {/* Delete */}
            <div className="pricing-delete-wrapper">
              <button
                type="button"
                onClick={() => deleteRow(index)}
                aria-label={`Delete duration pricing row ${index + 1}`}
                className="pricing-delete-button h-12 w-12 border border-red-200 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingInformation;