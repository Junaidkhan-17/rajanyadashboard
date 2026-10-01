import api from "./api";

/*
========================================
Get All Products
========================================
*/

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

/*
========================================
Get Product By ID
========================================
*/

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

/*
========================================
Create Product
========================================
*/

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);

  return response.data;
};

/*
========================================
Update Product
========================================
*/

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);

  return response.data;
};

/*
========================================
Delete Product
========================================
*/

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};

/*
========================================
Upload Product Image
========================================
*/

export const uploadProductImage = async (formData) => {
  const response = await api.post("/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/*
========================================
Delete Product Image
========================================
*/

export const deleteProductImage = async (public_id) => {
  const response = await api.delete("/products/image", {
    data: {
      public_id,
    },
  });

  return response.data;
};
