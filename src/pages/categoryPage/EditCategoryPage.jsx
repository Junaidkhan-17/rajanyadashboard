import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import {
  getCategoryById,
  updateCategory,
} from "../../services/categoryService";

import ECategoryInformation from "../../components/editCategory/ECategoryInformation";
import ECategoryImages from "../../components/editCategory/ECategoryImages";
import ECategoryDescription from "../../components/editCategory/ECategoryDescription";
import ECategoryStatus from "../../components/editCategory/ECategoryStatus";
import ECategorySettings from "../../components/editCategory/ECategorySettings";
import ECategoryImageGuide from "../../components/editCategory/ECategoryImageGuide";
import ECategoryActions from "../../components/editCategory/ECategoryActions";

const EditCategoryPage = () => {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
  ========================================
  Fetch Category
  ========================================
  */

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const response = await getCategoryById(id);

        if (response.success && response.category) {
  setCategory({
    ...response.category,

    showOnHomepage:
      response.category.showOnHomepage ?? false,

    showInNavigation:
      response.category.showInNavigation ?? false,
  });
}else {
          setCategory(null);
          toast.error("Category not found");
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);

        setCategory(null);

        toast.error(
          error.response?.data?.message ||
            "Failed to load category"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  /*
  ========================================
  Build Update Payload
  ========================================
  */

  const buildPayload = (overrides = {}) => {
  return {
    name: category.name?.trim(),
    parentCategory: category.parentCategory?.trim() || "",
    gender: category.gender,
    description: category.description?.trim() || "",
    image: category.image || "",

    isActive: category.isActive,
    isFeatured: category.isFeatured,

    showOnHomepage: category.showOnHomepage === true,
    showInNavigation: category.showInNavigation === true,

    displayOrder: category.displayOrder ?? 0,

    seoTitle: category.seoTitle?.trim() || "",
    seoDescription: category.seoDescription?.trim() || "",

    ...overrides,
  };
};

  /*
  ========================================
  Save Draft
  ========================================
  */

  const handleSaveDraft = async () => {
    if (!category) return;

    try {
      setSaving(true);

      const payload = buildPayload({
        isActive: false,
      });
      console.log("CATEGORY UPDATE PAYLOAD:", payload);

      const response = await updateCategory(id, payload);

      if (response.success) {
        setCategory(response.category);
        toast.success("Draft saved successfully");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save draft"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ========================================
  Save / Update Category
  ========================================
  */

  const handleSaveCategory = async () => {
  if (!category) return;

  if (!category.name?.trim()) {
    toast.error("Category name is required");
    return;
  }

  if (!category.gender) {
    toast.error("Gender is required");
    return;
  }

  try {
    setSaving(true);

    const payload = buildPayload();

    const response = await updateCategory(id, payload);

    if (response.success) {
      setCategory(response.category);

      toast.success("Category updated successfully");
    }
  } catch (error) {
    console.error("Failed to update category:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to update category"
    );
  } finally {
    setSaving(false);
  }
};
  /*
  ========================================
  Loading
  ========================================
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Loading category...
          </p>
        </div>
      </div>
    );
  }

  /*
  ========================================
  Category Not Found
  ========================================
  */

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Category Not Found
        </h2>

        <p className="text-slate-500 mt-2">
          The category you are trying to edit does not exist.
        </p>

        <NavLink
          to="/categories"
          className="mt-5 inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-black text-white"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </NavLink>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ========================================
          Header
      ======================================== */}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5">

        <div>
          <div className="flex items-center gap-2 text-sm mb-2">

            <NavLink
              to="/"
              className="text-slate-400 hover:text-black"
            >
              Dashboard
            </NavLink>

            <span>›</span>

            <NavLink
              to="/categories"
              className="text-slate-400 hover:text-black"
            >
              Categories
            </NavLink>

            <span>›</span>

            <span className="font-semibold">
              Edit Category
            </span>
          </div>

          <h1 className="text-3xl font-bold">
            Edit Category
          </h1>

          <p className="text-slate-500 mt-1">
            Update your category details, images and display settings.
          </p>
        </div>

        <NavLink
          to="/categories"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border border-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </NavLink>

      </div>

      {/* ========================================
          Row 1
      ======================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        <ECategoryInformation
          category={category}
          setCategory={setCategory}
        />

        <ECategoryImages
          category={category}
          setCategory={setCategory}
        />

      </div>

      {/* ========================================
          Row 2
      ======================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        <ECategoryDescription
          category={category}
          setCategory={setCategory}
        />

        <ECategoryStatus
          category={category}
          setCategory={setCategory}
        />

      </div>

      {/* ========================================
          Row 3
      ======================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        <ECategorySettings
          category={category}
          setCategory={setCategory}
        />

        <ECategoryImageGuide />

      </div>

      {/* ========================================
          Actions
      ======================================== */}

      <ECategoryActions
        category={category}
        onSaveDraft={handleSaveDraft}
        onSaveCategory={handleSaveCategory}
        saving={saving}
      />

    </div>
  );
};

export default EditCategoryPage;