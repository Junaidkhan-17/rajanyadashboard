import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";

import { getCategories } from "../services/categoryService";

import CategoryStats from "../components/category/CategoryStats";
import CategoryFilters from "../components/category/CategoryFilters";
import CategoryTable from "../components/category/CategoryTable";
import CategoryPagination from "../components/category/CategoryPagination";

import "./CategoriesPage.css";

const CategoriesPage = () => {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalCategories: 0,
    productsAssigned: 0,
    featuredCategories: 0,
    activeCategories: 0,
  });

  const [categories, setCategories] = useState([]);

  /* =====================================================
     FILTERS
     ===================================================== */

  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  /* =====================================================
     TABLE
     ===================================================== */

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* =====================================================
     PAGINATION
     ===================================================== */

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* =====================================================
     FETCH CATEGORIES
     ===================================================== */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategories();

      console.log(response);

      const mappedCategories = (
        response.categories || []
      ).map((category) => ({
        _id: category._id,
        categoryName: category.name,
        parentCategory: category.parentCategory,
        gender: category.gender,
        image: category.image,
        productsCount: category.productsCount ?? 0,
        featured: category.isFeatured,
        showOnHomepage:
          category.showOnHomepage ?? false,
        showInNavigation:
          category.showInNavigation ?? false,
        status: category.isActive
          ? "Active"
          : "Inactive",
        createdAt: category.createdAt,
      }));

      console.log(mappedCategories);

      setCategories(mappedCategories);

      setStats({
        totalCategories:
          mappedCategories.length,

        productsAssigned:
          mappedCategories.reduce(
            (total, category) =>
              total + category.productsCount,
            0,
          ),

        featuredCategories:
          mappedCategories.filter(
            (category) => category.featured,
          ).length,

        activeCategories:
          mappedCategories.filter(
            (category) =>
              category.status === "Active",
          ).length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RESET PAGINATION WHEN FILTERS CHANGE
     ===================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    featured,
    sortBy,
    status,
    date,
  ]);

  /* =====================================================
     FILTERED CATEGORIES
     ===================================================== */

  const filteredCategories = useMemo(() => {
    let data = [...categories];

    if (search) {
      data = data.filter((item) =>
        item.categoryName
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    if (featured !== "") {
      data = data.filter(
        (item) =>
          String(item.featured) === featured,
      );
    }

    if (status !== "") {
      data = data.filter(
        (item) =>
          item.status === status,
      );
    }

    if (sortBy) {
      data = data.filter(
        (item) =>
          item.parentCategory
            ?.trim()
            .toLowerCase() ===
          sortBy.trim().toLowerCase(),
      );
    }

    if (date) {
      data = data.filter(
        (item) =>
          new Date(
            item.createdAt,
          ).toDateString() ===
          new Date(date).toDateString(),
      );
    }

    return data;
  }, [
    categories,
    search,
    featured,
    sortBy,
    status,
    date,
  ]);

  /* =====================================================
     PARENT CATEGORY OPTIONS
     ===================================================== */

  const parentCategoryOptions = useMemo(() => {
    return [
      ...new Set(
        categories
          .map(
            (category) =>
              category.parentCategory?.trim(),
          )
          .filter(Boolean),
      ),
    ].sort();
  }, [categories]);

  /* =====================================================
     PAGINATION
     ===================================================== */

  const totalPages = Math.ceil(
    filteredCategories.length /
      itemsPerPage,
  );

  const currentCategories =
    filteredCategories.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage,
    );

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="categories-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <section className="categories-page__header">

        <div className="categories-page__header-content">

          {/* Breadcrumb */}

          <div className="categories-page__breadcrumb">

            <NavLink
              to="/"
              className="categories-page__breadcrumb-link"
            >
              Dashboard
            </NavLink>

            <span className="categories-page__breadcrumb-separator">
              ›
            </span>

            <span className="categories-page__breadcrumb-current">
              Categories
            </span>

          </div>

          {/* Title */}

          <h1 className="categories-page__title">
            Categories Management
          </h1>

          <p className="categories-page__subtitle">
            Manage all fashion categories available
            in your Virtual Dressing Room platform.
          </p>

        </div>

        {/* Add Category */}

        <NavLink
          to="/categories/add"
          className="categories-page__add-button"
        >
          <Plus
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />

          <span>
            Add Category
          </span>
        </NavLink>

      </section>

      {/* =================================================
          STATS
          ================================================= */}

      <section className="categories-page__stats">
        <CategoryStats stats={stats} />
      </section>

      {/* =================================================
          FILTERS
          ================================================= */}

      <section className="categories-page__filters">
        <CategoryFilters
          search={search}
          setSearch={setSearch}
          featured={featured}
          setFeatured={setFeatured}
          sortBy={sortBy}
          setSortBy={setSortBy}
          parentCategoryOptions={
            parentCategoryOptions
          }
          date={date}
          setDate={setDate}
          status={status}
          setStatus={setStatus}
        />
      </section>

      {/* =================================================
          TABLE
          ================================================= */}

      <section className="categories-page__table">
        <CategoryTable
          categories={currentCategories}
          loading={loading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onDelete={(category) => {
            setSelectedCategory(category);
          }}
        />
      </section>

      {/* =================================================
          PAGINATION
          ================================================= */}

      <section className="categories-page__pagination">
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={
            filteredCategories.length
          }
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </section>

    </div>
  );
};

export default CategoriesPage;