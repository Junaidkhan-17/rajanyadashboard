import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./ProductAttributes.css";

const ProductAttributes = ({ productData, setProductData }) => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];

  const fabrics = [
    "Silk",
    "Cotton",
    "Georgette",
    "Velvet",
    "Net",
  ];

  const [isFabricOpen, setIsFabricOpen] = useState(false);

  const fabricDropdownRef = useRef(null);

  /* ========================================
     Size Change
     ======================================== */

  const handleSizeChange = (size) => {
    const currentSizes = productData.availableSizes || [];

    if (currentSizes.includes(size)) {
      setProductData((prev) => ({
        ...prev,
        availableSizes: currentSizes.filter(
          (item) => item !== size
        ),
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        availableSizes: [...currentSizes, size],
      }));
    }
  };

  /* ========================================
     Input Change
     ======================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ========================================
     Fabric Change
     ======================================== */

  const handleFabricSelect = (fabric) => {
    setProductData((prev) => ({
      ...prev,
      fabric,
    }));

    setIsFabricOpen(false);
  };

  /* ========================================
     Outside Click
     ======================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        fabricDropdownRef.current &&
        !fabricDropdownRef.current.contains(event.target)
      ) {
        setIsFabricOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* ========================================
     Escape
     ======================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsFabricOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <div className="product-attributes-card bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

      {/* Header */}
      <div className="product-attributes-header flex items-center gap-4 mb-8">
        <div className="product-attributes-step w-8 h-8 bg-black rounded-md flex items-center justify-center text-white text-sm font-semibold">
          5
        </div>

        <h2 className="product-attributes-title text-[18px] font-semibold text-slate-800">
          Product Attributes
        </h2>
      </div>

      {/* Available Sizes */}
      <div className="product-sizes-section mb-7">
        <label className="product-attributes-label block text-sm uppercase tracking-wider text-slate-500 mb-5">
          Available Sizes{" "}
          <span className="text-red-500">*</span>
        </label>

        <div className="product-size-options flex flex-wrap items-center gap-8">
          {sizes.map((size) => (
            <label
              key={size}
              className="product-size-option flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(
                  productData.availableSizes || []
                ).includes(size)}
                onChange={() =>
                  handleSizeChange(size)
                }
                className="product-size-checkbox w-5 h-5 rounded border-slate-300 accent-black"
              />

              <span className="product-size-text text-[15px] text-slate-600">
                {size}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Color + Fabric */}
      <div className="product-attribute-fields grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Color */}
        <div className="product-attribute-field">
          <label className="product-attributes-label block text-sm uppercase tracking-wider text-slate-500 mb-2">
            Color
          </label>

          <input
            type="text"
            name="color"
            value={productData.color || ""}
            onChange={handleChange}
            placeholder="Enter color"
            className="product-attribute-input w-full h-12 px-5 border border-slate-200 rounded-2xl outline-none focus:border-black"
          />
        </div>

        {/* Fabric */}
        <div
          className={`product-attribute-field product-fabric-dropdown ${
            isFabricOpen ? "is-open" : ""
          }`}
          ref={fabricDropdownRef}
        >
          <label className="product-attributes-label block text-sm uppercase tracking-wider text-slate-500 mb-2">
            Fabric
          </label>

          {/* Dropdown Trigger */}
          <button
            type="button"
            className={`product-fabric-select ${
              productData.fabric ? "has-value" : ""
            }`}
            onClick={() =>
              setIsFabricOpen((prev) => !prev)
            }
            aria-haspopup="listbox"
            aria-expanded={isFabricOpen}
          >
            <span className="product-fabric-select__value">
              {productData.fabric || "Select Fabric"}
            </span>

            <ChevronDown
              size={17}
              className={`product-fabric-select__icon ${
                isFabricOpen ? "rotate" : ""
              }`}
            />
          </button>

          {/* Custom Dropdown */}
          <div
            className={`product-fabric-menu ${
              isFabricOpen ? "is-visible" : ""
            }`}
            role="listbox"
            aria-hidden={!isFabricOpen}
          >
            {/* Select Fabric */}
            <button
              type="button"
              role="option"
              aria-selected={!productData.fabric}
              className={`product-fabric-option ${
                !productData.fabric ? "selected" : ""
              }`}
              onClick={() =>
                handleFabricSelect("")
              }
            >
              <span>Select Fabric</span>

              {!productData.fabric && (
                <span className="product-fabric-check">
                  ✓
                </span>
              )}
            </button>

            {/* Fabric Options */}
            {fabrics.map((fabric) => {
              const isSelected =
                productData.fabric === fabric;

              return (
                <button
                  key={fabric}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`product-fabric-option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleFabricSelect(fabric)
                  }
                >
                  <span>{fabric}</span>

                  {isSelected && (
                    <span className="product-fabric-check">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAttributes;