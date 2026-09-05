import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getMenu = () => api.get('/menu');
export const getStaff = () => api.get('/staff');
export const placeOrder = (data) => api.post('/orders', data);
export const getOrders = (status) => api.get('/orders', { params: status ? { status } : {} });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const assignOrder = (id, data) => api.patch(`/orders/${id}/assign`, data);
export const serveOrder = (id) => api.patch(`/orders/${id}/serve`);
export const submitComplaint = (orderId, data) => api.post(`/complaints/${orderId}`, data);
export const submitPayment = (orderId, data) => api.post(`/payments/${orderId}`, data);

export default api;
