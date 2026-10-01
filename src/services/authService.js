import api from "./api";

export const loginAdmin = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};