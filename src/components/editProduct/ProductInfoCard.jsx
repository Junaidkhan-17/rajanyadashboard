import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";

const ProductInfoCard = ({ formData, setFormData }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /*
  ========================================
  Fetch Categories
  ========================================
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    setLoadingCategories(true);

    const response = await getCategories();

    console.log("CATEGORIES API RESPONSE:", response);

    const categoryData =
      response?.data ||
      response?.categories ||
      response ||
      [];

    console.log("CATEGORY DATA:", categoryData);

    setCategories(
      Array.isArray(categoryData)
        ? categoryData
        : []
    );
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error
    );

    setCategories([]);
  } finally {
    setLoadingCategories(false);
  }
};

  /*
  ========================================
  Handle Change
  ========================================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-semibold">
          1
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Product Information
        </h2>
      </div>

      <div className="space-y-5">

        {/* Product Name */}

        <div>
          <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
            Product Name{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="productName"
            value={formData.productName || ""}
            onChange={handleChange}
            placeholder="Enter Product Name"
            className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Category + Sub Category */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Category */}

          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
              Category{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              disabled={loadingCategories}
              className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-black disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">
                {loadingCategories
                  ? "Loading Categories..."
                  : "Select Category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name ||
                    category.categoryName ||
                    "-"}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category */}

          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
              Sub Category
            </label>

            <input
              type="text"
              name="subCategory"
              value={formData.subCategory || ""}
              onChange={handleChange}
              placeholder="Enter Sub Category"
              className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

        </div>

        {/* Brand */}

        <div>
          <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
            Brand / Designer
          </label>

          <input
            type="text"
            name="brandDesigner"
            value={formData.brandDesigner || ""}
            onChange={handleChange}
            placeholder="Enter Brand Name"
            className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

      </div>
    </div>
  );
};

export default ProductInfoCard;