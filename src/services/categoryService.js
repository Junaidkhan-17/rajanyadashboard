import api from "./api";

/*
========================================
Get All Categories
========================================
*/

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

/*
========================================
Create Category
========================================
*/

export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);

  return response.data;
};

/*
========================================
Get Category By ID
========================================
*/

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};


/*
========================================
Update Category
========================================
*/

export const updateCategory = async (
  id,
  categoryData
) => {
  const response = await api.put(
    `/categories/${id}`,
    categoryData
  );

  return response.data;
};

/*
========================================
Delete Category
========================================
*/

export const deleteCategory = async (
  id
) => {
  const response = await api.delete(
    `/categories/${id}`
  );

  return response.data;
};