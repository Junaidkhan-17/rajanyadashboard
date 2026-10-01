import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { getCategories } from "../../services/categoryService";

const ECategoryInformation = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [categoryNameOpen, setCategoryNameOpen] = useState(false);
  const [parentCategoryOpen, setParentCategoryOpen] = useState(false);

  const categoryNameRef = useRef(null);
  const parentCategoryRef = useRef(null);

  /*
  ========================================
  Fetch Existing Categories
  ========================================
  */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await getCategories();

        if (response.success) {
          setCategories(response.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /*
  ========================================
  Close Dropdowns When Clicking Outside
  ========================================
  */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryNameRef.current &&
        !categoryNameRef.current.contains(event.target)
      ) {
        setCategoryNameOpen(false);
      }

      if (
        parentCategoryRef.current &&
        !parentCategoryRef.current.contains(event.target)
      ) {
        setParentCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
  ========================================
  Handle Normal Input Changes
  ========================================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  ========================================
  Category Name
  ========================================
  */

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;

    setCategory((prev) => ({
      ...prev,
      name: value,
    }));

    setCategoryNameOpen(true);
  };

  const selectCategoryName = (name) => {
    setCategory((prev) => ({
      ...prev,
      name,
    }));

    setCategoryNameOpen(false);
  };

  /*
  ========================================
  Parent Category
  ========================================
  */

  const handleParentCategoryChange = (e) => {
    const value = e.target.value;

    setCategory((prev) => ({
      ...prev,
      parentCategory: value,
    }));

    setParentCategoryOpen(true);
  };

  const selectParentCategory = (parentCategory) => {
    setCategory((prev) => ({
      ...prev,
      parentCategory,
    }));

    setParentCategoryOpen(false);
  };

  const clearParentCategory = () => {
    setCategory((prev) => ({
      ...prev,
      parentCategory: "",
    }));

    setParentCategoryOpen(false);
  };

  /*
  ========================================
  Parent Category Options
  ========================================
  */

  const parentCategories = categories.filter(
    (item) => item._id !== category?._id
  );

  /*
  ========================================
  Search Existing Category Names
  ========================================
  */

const filteredCategoryNames = categories.filter(
  (item) =>
    item._id !== category?._id &&
    item.name
      ?.toLowerCase()
      .includes((category?.name || "").toLowerCase())
);

  /*
  ========================================
  Search Existing Parent Categories
  ========================================
  */

  const filteredParentCategories = parentCategories.filter((item) =>
    item.name
      ?.toLowerCase()
      .includes((category?.parentCategory || "").toLowerCase())
  );

  return (
    <div>
      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold">
          1
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Category Information
        </h2>
      </div>

      <div className="space-y-5">

        {/* ========================================
            Category Name
        ======================================== */}

        <div
          ref={categoryNameRef}
          className="relative"
        >
          <label className="block text-sm font-medium mb-2">
            Category Name
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="text"
              name="name"
              value={category?.name || ""}
              onChange={handleCategoryNameChange}
              onFocus={() => setCategoryNameOpen(true)}
              placeholder={
                loadingCategories
                  ? "Loading categories..."
                  : "Select or type category name"
              }
              className="
                w-full
                h-11
                rounded-xl
                border
                border-slate-200
                px-4
                pr-10
                outline-none
                focus:border-black
                bg-white
              "
            />

            <ChevronDown
              size={18}
              className={`
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                pointer-events-none
                transition-transform
                ${
                  categoryNameOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </div>

          {/* Category Name Dropdown */}

          {categoryNameOpen && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

              <div className="max-h-60 overflow-y-auto">

                {filteredCategoryNames.length > 0 ? (
                  filteredCategoryNames.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() =>
                        selectCategoryName(item.name)
                      }
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-slate-700
                        hover:bg-slate-50
                        transition
                      "
                    >
                      <span>{item.name}</span>

                      {category?.name === item.name && (
                        <Check
                          size={16}
                          className="text-green-500"
                        />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400">
                    No existing category found.
                  </div>
                )}

              </div>

              {/* Manual Value */}

              {category?.name &&
                !categories.some(
                  (item) =>
                    item.name?.toLowerCase() ===
                    category.name?.toLowerCase()
                ) && (
                  <div className="border-t border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-400">
                      New category name
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1">
                      "{category.name}"
                    </p>

                    <p className="text-xs text-green-600 mt-1">
                      This value will be used when you save.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* ========================================
            Parent Category + Slug
        ======================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Parent Category */}

          <div
            ref={parentCategoryRef}
            className="relative"
          >
            <label className="block text-sm font-medium mb-2">
              Parent Category
            </label>

            <div className="relative">
              <input
                type="text"
                name="parentCategory"
                value={category?.parentCategory || ""}
                onChange={handleParentCategoryChange}
                onFocus={() => setParentCategoryOpen(true)}
                placeholder="Select or type parent category"
                className="
                  w-full
                  h-11
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  pr-10
                  outline-none
                  focus:border-black
                  bg-white
                "
              />

              <ChevronDown
                size={18}
                className={`
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  pointer-events-none
                  transition-transform
                  ${
                    parentCategoryOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </div>

            {/* Parent Category Dropdown */}

            {parentCategoryOpen && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

                {/* No Parent */}

                <button
                  type="button"
                  onClick={clearParentCategory}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    text-left
                    text-sm
                    text-slate-700
                    hover:bg-slate-50
                    transition
                    border-b
                    border-slate-100
                  "
                >
                  <span>No Parent</span>

                  {!category?.parentCategory && (
                    <Check
                      size={16}
                      className="text-green-500"
                    />
                  )}
                </button>

                <div className="max-h-52 overflow-y-auto">

                  {filteredParentCategories.length > 0 ? (
                    filteredParentCategories.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() =>
                          selectParentCategory(item.name)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          justify-between
                          px-4
                          py-3
                          text-left
                          text-sm
                          text-slate-700
                          hover:bg-slate-50
                          transition
                        "
                      >
                        <span>{item.name}</span>

                        {category?.parentCategory ===
                          item.name && (
                          <Check
                            size={16}
                            className="text-green-500"
                          />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-400">
                      No existing parent category found.
                    </div>
                  )}

                </div>

                {/* Manual Parent */}

                {category?.parentCategory &&
                  !parentCategories.some(
                    (item) =>
                      item.name?.toLowerCase() ===
                      category.parentCategory?.toLowerCase()
                  ) && (
                    <div className="border-t border-slate-100 px-4 py-3">
                      <p className="text-xs text-slate-400">
                        New parent category
                      </p>

                      <p className="text-sm font-medium text-slate-700 mt-1">
                        "{category.parentCategory}"
                      </p>

                      <p className="text-xs text-green-600 mt-1">
                        This value will be used when you save.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Slug */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Category Slug (URL)
            </label>

            <input
              type="text"
              value={category?.slug || ""}
              readOnly
              className="
                w-full
                h-11
                rounded-xl
                border
                border-slate-200
                px-4
                bg-slate-100
                text-slate-500
                cursor-not-allowed
              "
            />
          </div>
        </div>

        {/* ========================================
            Gender
        ======================================== */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Gender
            <span className="text-red-500">*</span>
          </label>

          <select
            name="gender"
            value={category?.gender || ""}
            onChange={handleChange}
            className="
              w-full
              h-11
              rounded-xl
              border
              border-slate-200
              px-4
              outline-none
              focus:border-black
              bg-white
              cursor-pointer
            "
          >
            <option value="">
              Select Gender
            </option>

            <option value="Men">
              Men
            </option>

            <option value="Women">
              Women
            </option>

            <option value="Unisex">
              Unisex
            </option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default ECategoryInformation;