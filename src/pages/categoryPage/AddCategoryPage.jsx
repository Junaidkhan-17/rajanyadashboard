import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
// import api from "../../utils/api";
import { createCategory } from "../../services/categoryService";

import CategoryInformation from "../../components/addCategoryPage/CategoryInformation";
import CategoryImageUpload from "../../components/addCategoryPage/CategoryImageUpload";
import CategoryDescription from "../../components/addCategoryPage/CategoryDescription";
import CategoryStatus from "../../components/addCategoryPage/CategoryStatus";
import CategoryDisplaySettings from "../../components/addCategoryPage/CategoryDisplaySettings";
import CategorySEOSettings from "../../components/addCategoryPage/CategorySEOSettings";
import ImageGuidelines from "../../components/addCategoryPage/ImageGuidelines";
import CategoryActions from "../../components/addCategoryPage/CategoryActions";

import "./AddCategoryPage.css";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
};

const AddCategoryPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategory: "",
    slug: "",
    gender: "",
    description: "",
    image: null,
    featured: false,
    showOnHomepage: true,
    showInNavigation: true,
    displayOrder: 0,
    seoTitle: "",
    seoDescription: "",
    status: "Draft",
    createdBy: "Admin",
  });

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? files?.[0] || null
              : value,
      };

      if (name === "categoryName") {
        updatedData.slug = generateSlug(value);
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.categoryName,
        parentCategory: formData.parentCategory,
        gender: formData.gender,
        description: formData.description,
        image: formData.image,
        isFeatured: formData.featured,
        showOnHomepage: formData.showOnHomepage,
        showInNavigation: formData.showInNavigation,
        isActive: formData.status === "Active",
        displayOrder: Number(formData.displayOrder),
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      };

      console.log("Category Payload:", payload);

      const response = await createCategory(payload);

      console.log("API Response:", response);

      toast.success(response.message);

      navigate("/categories");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create category."
      );
    }
  };

  console.log(
    "Display Order:",
    formData.displayOrder
  );

  return (
    <div className="add-category-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="add-category-page__header">

        <div className="add-category-page__header-content">

          {/* Breadcrumb */}

          <div className="add-category-page__breadcrumb">

            <NavLink
              to="/"
              className="add-category-page__breadcrumb-link"
            >
              Dashboard
            </NavLink>

            <span className="add-category-page__breadcrumb-separator">
              ›
            </span>

            <NavLink
              to="/categories"
              className="add-category-page__breadcrumb-link"
            >
              Categories
            </NavLink>

            <span className="add-category-page__breadcrumb-separator">
              ›
            </span>

            <span className="add-category-page__breadcrumb-current">
              Add Category
            </span>

          </div>

          {/* Title */}

          <h1 className="add-category-page__title">
            Add Category
          </h1>

          <p className="add-category-page__subtitle">
            Create a new category for products and
            collections in your Virtual Dressing Room.
          </p>

        </div>

        {/* Back Button */}

        <NavLink
          to="/categories"
          className="add-category-page__back-button"
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          <span>
            Back to Categories
          </span>
        </NavLink>

      </div>

      {/* =====================================================
          ROW 1
          ===================================================== */}

      <div className="add-category-page__row add-category-page__row--two-columns">

        <div className="add-category-page__column">
          <CategoryInformation
            formData={formData}
            handleChange={handleChange}
          />
        </div>

        <div className="add-category-page__column">
          <CategoryImageUpload
            formData={formData}
            handleChange={handleChange}
          />
        </div>

      </div>

      {/* =====================================================
          ROW 2
          ===================================================== */}

      <div className="add-category-page__row add-category-page__row--two-columns">

        <div className="add-category-page__column add-category-page__column--stretch">
          <CategoryDescription
            formData={formData}
            handleChange={handleChange}
          />
        </div>

        <div className="add-category-page__column add-category-page__column--stretch">
          <CategoryStatus
            formData={formData}
            handleChange={handleChange}
          />
        </div>

      </div>

      {/* =====================================================
          ROW 3
          ===================================================== */}

      <div className="add-category-page__row add-category-page__row--two-columns">

        <div className="add-category-page__column add-category-page__column--stretch">

          <CategoryDisplaySettings
            formData={formData}
            handleChange={handleChange}
          />

          <CategorySEOSettings
            formData={formData}
            handleChange={handleChange}
          />

        </div>

        <div className="add-category-page__column add-category-page__column--stretch">
          <ImageGuidelines />
        </div>

      </div>

      {/* =====================================================
          ACTIONS
          ===================================================== */}

      <div className="add-category-page__actions">
        <CategoryActions
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>

    </div>
  );
};

export default AddCategoryPage;