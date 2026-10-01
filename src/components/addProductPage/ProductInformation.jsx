import { useEffect, useRef, useState } from "react";
import {
  getCategories,
  createCategory,
} from "../../services/categoryService";
import { ChevronDown } from "lucide-react";
import "./ProductInformation.css";

const ProductInformation = ({
  productData,
  setProductData,
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [categoryInput, setCategoryInput] =
    useState("");

  const [showCategoryDropdown, setShowCategoryDropdown] =
    useState(false);

  const [creatingCategory, setCreatingCategory] =
    useState(false);

  /*
  ========================================
  Gender Dropdown
  ========================================
  */

  const [isGenderOpen, setIsGenderOpen] =
    useState(false);

  const genderDropdownRef = useRef(null);

  const genderOptions = [
    "Men",
    "Women",
    "Unisex",
  ];

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

      console.log(
        "CATEGORIES API RESPONSE:",
        response
      );

      const categoryData =
        response?.data ||
        response?.categories ||
        response ||
        [];

      console.log(
        "CATEGORY DATA:",
        categoryData
      );

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
  Get Category Name
  ========================================
  */

  const getCategoryName = (category) => {
    return (
      category?.name ||
      category?.categoryName ||
      ""
    );
  };

  /*
  ========================================
  Selected Category
  ========================================
  */

  const selectedCategory = categories.find(
    (item) =>
      item._id === productData.category
  );

  const selectedCategoryName =
    getCategoryName(selectedCategory);

  /*
  ========================================
  Filter Categories
  ========================================
  */

  const filteredCategories =
    categories.filter((category) => {
      const categoryName =
        getCategoryName(category);

      return categoryName
        .toLowerCase()
        .includes(
          categoryInput.trim().toLowerCase()
        );
    });

  /*
  ========================================
  Select Existing Category
  ========================================
  */

  const handleCategorySelect = (category) => {
    const categoryId = category._id;

    const categoryName =
      getCategoryName(category);

    setProductData((prev) => ({
      ...prev,

      category: categoryId,

      // Occasion always matches Category
      occasion: categoryId
        ? [categoryId]
        : [],
    }));

    setCategoryInput(categoryName);
    setShowCategoryDropdown(false);
  };

  /*
  ========================================
  Category Input Change
  ========================================
  */

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;

    setCategoryInput(value);
    setShowCategoryDropdown(true);

    /*
    If admin starts typing a different
    category, remove the previously
    selected category.
    */

    if (
      value !== selectedCategoryName
    ) {
      setProductData((prev) => ({
        ...prev,
        category: "",
        occasion: [],
      }));
    }
  };

  /*
  ========================================
  Create New Category
  ========================================
  */

  const handleCreateCategory = async () => {
    const categoryName =
      categoryInput.trim();

    if (!categoryName) {
      return;
    }

    /*
    Gender is required by backend
    */

    if (!productData.gender) {
      alert(
        "Please select gender before creating a new category."
      );

      return;
    }

    /*
    Prevent duplicate category
    */

    const existingCategory =
      categories.find(
        (category) =>
          getCategoryName(category)
            .trim()
            .toLowerCase() ===
          categoryName.toLowerCase()
      );

    if (existingCategory) {
      handleCategorySelect(
        existingCategory
      );

      return;
    }

    try {
      setCreatingCategory(true);

      const response =
        await createCategory({
          name: categoryName,
          gender: productData.gender,
        });

      console.log(
        "CREATE CATEGORY RESPONSE:",
        response
      );

      const newCategory =
        response?.category ||
        response?.data?.category;

      if (!newCategory?._id) {
        throw new Error(
          "Category was created but no category ID was returned."
        );
      }

      /*
      Add new category to local list
      */

      setCategories((prev) => [
        ...prev,
        newCategory,
      ]);

      /*
      Automatically select new category
      */

      setProductData((prev) => ({
        ...prev,

        category: newCategory._id,

        // Occasion automatically matches category
        occasion: [newCategory._id],
      }));

      setCategoryInput(
        getCategoryName(newCategory)
      );

      setShowCategoryDropdown(false);

      alert(
        "Category created successfully."
      );
    } catch (error) {
      console.error(
        "Failed to create category:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create category."
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  /*
  ========================================
  Gender Selection
  ========================================
  */

  const handleGenderSelect = (gender) => {
    setProductData((prev) => ({
      ...prev,
      gender,
    }));

    setIsGenderOpen(false);
  };

  /*
  ========================================
  Gender Dropdown Outside Click + ESC
  ========================================
  */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(
          event.target
        )
      ) {
        setIsGenderOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsGenderOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /*
  ========================================
  Handle Other Fields
  ========================================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  ========================================
  Render
  ========================================
  */

  return (
    <div className="product-information-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* Header */}

      <div className="product-information-header flex items-center gap-3 mb-6">
        <div className="product-information-step w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-semibold">
          1
        </div>

        <h2 className="product-information-title text-lg font-semibold text-slate-800">
          Product Information
        </h2>
      </div>

      <div className="product-information-fields space-y-5">

        {/* Product Name */}

        <div className="product-information-field">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Product Name
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="text"
            name="productName"
            value={
              productData.productName || ""
            }
            onChange={handleChange}
            placeholder="Enter product name"
            className="product-information-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black"
          />
        </div>

        {/* Category + Sub Category */}

        <div className="product-information-category-grid grid md:grid-cols-2 gap-4">

          {/* Category */}

          <div className="product-information-category-field relative">
            <label className="block text-sm font-medium mb-2">
              Category
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={categoryInput}
              onChange={
                handleCategoryInputChange
              }
              onFocus={() =>
                setShowCategoryDropdown(true)
              }
              disabled={
                loadingCategories ||
                creatingCategory
              }
              placeholder={
                loadingCategories
                  ? "Loading Categories..."
                  : "Type or select category"
              }
              className="product-information-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black disabled:bg-slate-50 disabled:text-slate-400"
            />

            {/* Category Dropdown */}

            {showCategoryDropdown &&
              !loadingCategories &&
              !creatingCategory && (
                <div className="product-information-dropdown absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

                  {/* Existing Categories */}

                  {filteredCategories.length >
                    0 && (
                    <div className="product-information-dropdown-list max-h-52 overflow-y-auto">

                      {filteredCategories.map(
                        (category) => (
                          <button
                            key={
                              category._id
                            }
                            type="button"
                            onClick={() =>
                              handleCategorySelect(
                                category
                              )
                            }
                            className="product-information-dropdown-item w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                          >
                            {getCategoryName(
                              category
                            )}
                          </button>
                        )
                      )}

                    </div>
                  )}

                  {/* Create New Category */}

                  {categoryInput.trim() &&
                    !categories.some(
                      (category) =>
                        getCategoryName(
                          category
                        )
                          .trim()
                          .toLowerCase() ===
                        categoryInput
                          .trim()
                          .toLowerCase()
                    ) && (
                      <button
                        type="button"
                        onClick={
                          handleCreateCategory
                        }
                        className="product-information-create-category w-full text-left px-4 py-3 border-t border-slate-100 text-sm font-medium text-black hover:bg-slate-50 transition"
                      >
                        {`Create "${categoryInput.trim()}"`}
                      </button>
                    )}

                  {/* No Category Found */}

                  {!filteredCategories.length &&
                    !categoryInput.trim() && (
                      <div className="product-information-empty px-4 py-3 text-sm text-slate-400">
                        No categories available.
                      </div>
                    )}

                </div>
              )}

            {/* Creating Category */}

            {creatingCategory && (
              <div className="product-information-creating absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-500">
                Creating category...
              </div>
            )}
          </div>

          {/* Sub Category */}

          <div className="product-information-subcategory-field">
            <label className="block text-sm font-medium mb-2">
              Sub Category
            </label>

            <input
              type="text"
              name="subCategory"
              value={
                productData.subCategory || ""
              }
              onChange={handleChange}
              placeholder="Enter sub category"
              className="product-information-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black"
            />
          </div>

        </div>

        {/* Gender */}

        <div className="product-information-field">

          <label className="block text-sm font-medium mb-2">
            Gender
            <span className="text-red-500">
              *
            </span>
          </label>

          {/* Custom Gender Dropdown */}

          <div
            ref={genderDropdownRef}
            className={`product-information-gender-dropdown ${
              isGenderOpen
                ? "is-open"
                : ""
            }`}
          >

            {/* Trigger */}

            <button
              type="button"
              className={`product-information-gender-select ${
                productData.gender
                  ? "has-value"
                  : ""
              }`}
              onClick={() =>
                setIsGenderOpen(
                  (prev) => !prev
                )
              }
              aria-haspopup="listbox"
              aria-expanded={
                isGenderOpen
              }
            >
              <span className="product-information-gender-select__value">
                {productData.gender ||
                  "Select Gender"}
              </span>

              <ChevronDown
                size={17}
                strokeWidth={2}
                className={`product-information-gender-select__icon ${
                  isGenderOpen
                    ? "rotate"
                    : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}

            <div
              className={`product-information-gender-menu ${
                isGenderOpen
                  ? "is-visible"
                  : ""
              }`}
              role="listbox"
              aria-hidden={!isGenderOpen}
            >
              {genderOptions.map(
                (gender) => {
                  const isSelected =
                    productData.gender ===
                    gender;

                  return (
                    <button
                      key={gender}
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      className={`product-information-gender-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleGenderSelect(
                          gender
                        )
                      }
                    >
                      <span>
                        {gender}
                      </span>

                      {isSelected && (
                        <span className="product-information-gender-option__check">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Occasion */}

        <div className="product-information-field">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Occasion
          </label>

          <input
            type="text"
            value={selectedCategoryName}
            readOnly
            placeholder="Select a category first"
            className="product-information-input w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
          />

          <p className="product-information-help text-xs text-slate-400 mt-2">
            Occasion is automatically assigned
            from the selected category.
          </p>
        </div>

        {/* Brand */}

        <div className="product-information-field">
          <label className="block text-sm font-medium mb-2">
            Brand / Designer
          </label>

          <input
            type="text"
            name="brandDesigner"
            value={
              productData.brandDesigner || ""
            }
            onChange={handleChange}
            placeholder="Enter brand or designer"
            className="product-information-input w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-black"
          />
        </div>

      </div>
    </div>
  );
};

export default ProductInformation;