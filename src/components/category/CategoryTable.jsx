import CategoryRow from "./CategoryRow";

import "./CategoryTable.css";

const CategoryTable = ({
  categories = [],
  loading = false,
  onDelete,
  selectedRows,
  setSelectedRows,
}) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(
        categories.map((item) => item._id),
      );
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="category-table-card">
      {/* =================================================
          HORIZONTAL SCROLL CONTAINER
          ================================================= */}

      <div className="category-table-horizontal">
        {/* =================================================
            VERTICAL SCROLL CONTAINER
            ================================================= */}

        <div className="category-table-vertical">
          <table className="category-table">
            {/* =================================================
                HEADER
                ================================================= */}

            <thead className="category-table__head">
              <tr className="category-table__header-row">
                {/* Checkbox */}

                <th className="category-table__checkbox-header">
                  <input
                    type="checkbox"
                    checked={
                      categories.length > 0 &&
                      selectedRows.length ===
                        categories.length
                    }
                    onChange={handleSelectAll}
                    className="category-table__checkbox"
                    aria-label="Select all categories"
                  />
                </th>

                {/* Serial */}

                <th className="category-table__serial-header">
                  #
                </th>

                {/* Image */}

                <th className="category-table__image-header">
                  Image
                </th>

                {/* Category */}

                <th className="category-table__category-header">
                  Category
                </th>

                {/* Products */}

                <th className="category-table__products-header">
                  Products
                </th>

                {/* Featured */}

                <th className="category-table__featured-header">
                  Featured
                </th>

                {/* Homepage */}

                <th className="category-table__homepage-header">
                  Homepage
                </th>

                {/* Navigation */}

                <th className="category-table__navigation-header">
                  Navigation
                </th>

                {/* Status */}

                <th className="category-table__status-header">
                  Status
                </th>

                {/* Date */}

                <th className="category-table__date-header">
                  Date
                </th>

                {/* Actions */}

                <th className="category-table__actions-header">
                  Actions
                </th>
              </tr>
            </thead>

            {/* =================================================
                BODY
                ================================================= */}

            <tbody className="category-table__body">
              {loading ? (
                <tr className="category-table__state-row">
                  <td
                    colSpan={11}
                    className="category-table__state-cell"
                  >
                    <div className="category-table__loading">
                      <span className="category-table__loading-spinner" />

                      <span>
                        Loading Categories...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr className="category-table__state-row">
                  <td
                    colSpan={11}
                    className="category-table__state-cell"
                  >
                    <div className="category-table__empty">
                      No Categories Found
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map(
                  (category, index) => (
                    <CategoryRow
                      key={category._id}
                      category={category}
                      index={index}
                      onDelete={onDelete}
                      selectedRows={selectedRows}
                      setSelectedRows={
                        setSelectedRows
                      }
                    />
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;