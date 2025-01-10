import apiRequest from './apiRequest.js';

const ORDERS_URL = "/api/orders";
const PAYMENT_SERVER_URL = "https://payment-server:4000/api/payment";

const orderApi = {
  createOrder: async (order) => {
    return await apiRequest(`${ORDERS_URL}`, true, {
      method: "POST",
      body: JSON.stringify(order),
    });
  },

  getOrderDetails: async (id) => {
    return await apiRequest(`${ORDERS_URL}/${id}`, true, {
      method: "GET",
    });
  },

  payOrder: async (orderId, details) => {
    return await apiRequest(`${ORDERS_URL}/${orderId}/pay`, true, {
      method: "PUT",
      body: JSON.stringify(details),
    });
  },

  getPaypalClientId: async () => {
    return await apiRequest(`${PAYPAL_URL}`, true, {
      method: "GET",
    });
  },

  getMyOrders: async () => {
    return await apiRequest(`${ORDERS_URL}/mine`, true, {
      method: "GET",
    });
  },

  getOrders: async () => {
    return await apiRequest(`${ORDERS_URL}`, true, {
      method: "GET",
    });
  },

  deliverOrder: async (orderId) => {
    return await apiRequest(`${ORDERS_URL}/${orderId}/deliver`, true, {
      method: "PUT",
    });
  },

  getTotalOrders: async () => {
    return await apiRequest(`${ORDERS_URL}/total-orders`, true, {
      method: "GET",
    });
  },

  getTotalSales: async () => {
    return await apiRequest(`${ORDERS_URL}/total-sales`, true, {
      method: "GET",
    });
  },

  getTotalSalesByDate: async () => {
    return await apiRequest(`${ORDERS_URL}/total-sales-by-date`, true, {
      method: "GET",
    });
  },

  processPayment: async (amount) => {
    return await apiRequest(`${PAYMENT_SERVER_URL}/pay`, true, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },

  getPaymentBalance: async () => {
    return await apiRequest(`${PAYMENT_SERVER_URL}/balance`, true, {
      method: "GET",
    });
  },
};

export default orderApi;
