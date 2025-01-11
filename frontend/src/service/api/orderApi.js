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
    }
};

export default orderApi;
