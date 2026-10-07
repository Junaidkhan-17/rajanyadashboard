import api from "./api";

export const getAdminPayments = async () => {
  const response = await api.get("/admin/payments");
  return response.data;
};

export const getAdminPaymentStats = async () => {
  const response = await api.get("/admin/payments/stats");
  return response.data;
};

export const getAdminPaymentById = async (paymentId) => {
  const response = await api.get(`/admin/payments/${paymentId}`);
  return response.data;
};