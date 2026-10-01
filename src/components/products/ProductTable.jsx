import { useEffect, useMemo, useState } from "react";

import ProductRow from "./ProductRow";
import Pagination from "./Pagination";
import DeleteProduct from "../delete/DeleteProduct";

import { getProducts } from "../../services/productService";
import api from "../../services/api";

import "./ProductTable.css";

const PRODUCTS_PER_PAGE = 5;

const ProductTable = ({
  filters = {},
  selectedProducts = [],
  setSelectedProducts,
}) => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* =====================================================
     FETCH PRODUCTS
     ===================================================== */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        limit: 100,
      });

      if (response?.success) {
        setProducts(
          Array.isArray(response.products)
            ? response.products
            : [],
        );
      } else {
        setProducts([]);

        setError(
          response?.message ||
            "Failed to load products.",
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error,
      );

      setProducts([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =====================================================
     RESET PAGINATION WHEN FILTERS CHANGE
     ===================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.category,
    filters.size,
    filters.priceRange,
    filters.status,
    filters.selectedDate,
  ]);

  /* =====================================================
     DELETE PRODUCT
     ===================================================== */

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDelete(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct?._id) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(
        `/products/${selectedProduct._id}`,
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) =>
            product._id !== selectedProduct._id,
        ),
      );

      setSelectedProducts((previousSelected) =>
        previousSelected.filter(
          (id) =>
            id !== selectedProduct._id,
        ),
      );

      setOpenDelete(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error,
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     FILTER PRODUCTS
     ===================================================== */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      /* -------------------------------------------------
         SEARCH
         ------------------------------------------------- */

      const searchValue = String(
        filters.search || "",
      )
        .trim()
        .toLowerCase();

      const productName = String(
        product.name || "",
      ).toLowerCase();

      const productBrand = String(
        product.brand || "",
      ).toLowerCase();

      const productSlug = String(
        product.slug || "",
      ).toLowerCase();

      const searchMatch =
        !searchValue ||
        productName.includes(searchValue) ||
        productBrand.includes(searchValue) ||
        productSlug.includes(searchValue);

/* -------------------------------------------------
         CATEGORY
         ------------------------------------------------- */

      const productCategoryId =
        typeof product.category === "object"
          ? String(product.category?._id ?? "")
          : String(product.category ?? "");

      const categoryMatch =
        !filters.category ||
        productCategoryId === String(filters.category).trim();

      /* -------------------------------------------------
         SIZE
         ------------------------------------------------- */

      const productSizes = Array.isArray(
        product.sizes,
      )
        ? product.sizes
        : [];

      const sizeMatch =
        !filters.size ||
        productSizes.some(
          (size) =>
            String(size)
              .toLowerCase()
              .trim() ===
            String(filters.size)
              .toLowerCase()
              .trim(),
        );

      /* -------------------------------------------------
         STATUS
         ------------------------------------------------- */

      const productStatus = String(
        product.availabilityStatus || "",
      )
        .toLowerCase()
        .trim();

      const selectedStatus = String(
        filters.status || "",
      )
        .toLowerCase()
        .trim();

      const statusMatch =
        !selectedStatus ||
        productStatus === selectedStatus;

      /* -------------------------------------------------
         PRICE
         ------------------------------------------------- */

      const rentalPrice =
        Number(
          product.rentalOptions?.[0]?.price,
        ) || 0;

      const originalPrice =
        Number(product.originalPrice) || 0;

      const numericPrice =
        rentalPrice || originalPrice;

      let priceMatch = true;

      switch (filters.priceRange) {
        case "0-2000":
          priceMatch = numericPrice <= 2000;
          break;

        case "2000-5000":
          priceMatch = numericPrice >= 2000 && numericPrice <= 5000;
          break;

        case "5000-10000":
          priceMatch = numericPrice >= 5000 && numericPrice <= 10000;
          break;

        case "10000+":
          priceMatch = numericPrice >= 10000;
          break;

        default:
          priceMatch = true;
      }

      /* -------------------------------------------------
         DATE
         ------------------------------------------------- */

      let dateMatch = true;

      if (filters.selectedDate) {
        const productDateValue = new Date(
          product.createdAt,
        );

        const selectedDateValue = new Date(
          filters.selectedDate,
        );

        if (
          !Number.isNaN(
            productDateValue.getTime(),
          ) &&
          !Number.isNaN(
            selectedDateValue.getTime(),
          )
        ) {
          const productDate = productDateValue
            .toISOString()
            .split("T")[0];

          const selectedDate =
            selectedDateValue
              .toISOString()
              .split("T")[0];

          dateMatch =
            productDate === selectedDate;
        } else {
          dateMatch = false;
        }
      }

      /* -------------------------------------------------
         FINAL RESULT
         ------------------------------------------------- */

      return (
        searchMatch &&
        categoryMatch &&
        sizeMatch &&
        statusMatch &&
        priceMatch &&
        dateMatch
      );
    });
  }, [products, filters]);

  /* =====================================================
     PAGINATION
     ===================================================== */

  const totalPages = Math.ceil(
    filteredProducts.length /
      PRODUCTS_PER_PAGE,
  );

  const safeCurrentPage =
    totalPages > 0
      ? Math.min(currentPage, totalPages)
      : 1;

  const indexOfLastProduct =
    safeCurrentPage * PRODUCTS_PER_PAGE;

  const indexOfFirstProduct =
    indexOfLastProduct -
    PRODUCTS_PER_PAGE;

  const currentProducts =
    filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct,
    );

  /* =====================================================
     SELECT ALL — CURRENT PAGE
     ===================================================== */

  const currentProductIds =
    currentProducts.map(
      (product) => product._id,
    );

  const allCurrentProductsSelected =
    currentProductIds.length > 0 &&
    currentProductIds.every((id) =>
      selectedProducts.includes(id),
    );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts((previousSelected) => {
        const merged = new Set([
          ...previousSelected,
          ...currentProductIds,
        ]);

        return Array.from(merged);
      });
    } else {
      setSelectedProducts((previousSelected) =>
        previousSelected.filter(
          (id) =>
            !currentProductIds.includes(id),
        ),
      );
    }
  };

  /* =====================================================
     LOADING STATE
     ===================================================== */

  if (loading) {
    return (
      <section className="product-table-shell product-table-loading">
        <div className="product-table-loading-content">
          <div
            className="product-table-spinner"
            aria-hidden="true"
          />

          <p>Loading products...</p>

          <span>
            Fetching the latest product
            catalogue.
          </span>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR STATE
     ===================================================== */

  if (error && products.length === 0) {
    return (
      <section className="product-table-shell product-table-error">
        <div className="product-table-error-content">
          <div
            className="product-table-error-icon"
            aria-hidden="true"
          >
            !
          </div>

          <h3>
            Unable to load products
          </h3>

          <p>{error}</p>

          <button
            type="button"
            className="product-table-retry"
            onClick={fetchProducts}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* =====================================================
     MAIN
     ===================================================== */

  return (
    <>
      <section className="product-table-shell">
        {/* =================================================
            HEADER
            ================================================= */}

        <div className="product-table-header">
          <div className="product-table-heading">
            <div className="product-table-heading-mark">
              <span />
            </div>

            <div>
              <h3>Products</h3>

              <p>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}{" "}
                found
              </p>
            </div>
          </div>

          <div className="product-table-header-meta">
            <span className="product-table-total">
              {products.length} total
            </span>
          </div>
        </div>

        {/* =================================================
            INLINE ERROR
            ================================================= */}

        {error && (
          <div
            className="product-table-inline-error"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            TABLE SCROLL AREA
            ================================================= */}

        <div className="product-table-responsive">
          <table className="product-management-table">
            <thead>
              <tr>
                <th className="product-select-column">
                  <input
                    type="checkbox"
                    className="product-select-checkbox"
                    checked={
                      allCurrentProductsSelected
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all products on this page"
                  />
                </th>

                <th className="product-image-column">
                  Image
                </th>

                <th className="product-name-column">
                  Product Name
                </th>

                <th>Category</th>

                <th>Price</th>

                <th>Sizes</th>

                <th>Stock</th>

                <th>Status</th>

                <th>Date Added</th>

                <th className="product-actions-column">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map(
                  (product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      selectedProducts={
                        selectedProducts
                      }
                      setSelectedProducts={
                        setSelectedProducts
                      }
                      onDeleteClick={
                        handleDeleteClick
                      }
                    />
                  ),
                )
              ) : (
                <tr className="product-empty-row">
                  <td colSpan={10}>
                    <div className="product-empty-state">
                      <div className="product-empty-icon">
                        <span />
                      </div>

                      <h4>
                        No Products Found
                      </h4>

                      <p>
                        No products match your
                        current search or
                        filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
            ================================================= */}

        {totalPages > 1 && (
          <div className="product-table-pagination">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </section>

      {/* ===================================================
          DELETE MODAL
          =================================================== */}

      <DeleteProduct
        open={openDelete}
        onClose={() => {
          if (!deleting) {
            setOpenDelete(false);
            setSelectedProduct(null);
          }
        }}
        onDelete={handleDeleteProduct}
        title="Delete Product?"
        itemName={selectedProduct?.name}
      />
    </>
  );
};

export default ProductTable;