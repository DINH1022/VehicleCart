import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const orderApi = {
    processPayment: async (totalAmount, items) => {
        try {
            console.log('Sending payment request:', { totalAmount, items });
            const response = await api.post('/api/orders/payment', {
                totalAmount,
                items
            });
            console.log('Payment response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Payment API Error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                throw error.response.data;
            }
            throw { message: 'Network error occurred' };
        }
    },

    getOrders: async () => {
        try {
            const response = await api.get('/api/orders');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/api/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updatePaymentStatus: async (orderId, status) => {
        try {
            const response = await api.put('/api/orders/payment-status', {
                orderId,
                status
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAllOrders: async () => {
        try {
            const response = await api.get('/api/orders/admin/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.put(`/api/orders/admin/status/${orderId}`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getRevenueStats: async (period) => {
        try {
            const response = await api.get(`/api/orders/admin/revenue-stats?period=${period}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getTotalOrders: async () => {
        try {
            const response = await api.get('/api/orders/admin/total');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch total orders');
        }
    }
};

export default orderApi;
