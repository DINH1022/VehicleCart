
    import apiRequest from './apiRequest.js'
    const BASE_URL = "http://localhost:5000/";
    const USERS_URL = "/api/users";
    const usersApi = {
    login: async (data) => {
        return await apiRequest(`${USERS_URL}/auth`, true, {
        method: "POST",
        body: JSON.stringify(data),
        });
    },
    register: async (data) => {
        return await apiRequest(`${USERS_URL}`, true, {
        method: "POST",
        body: JSON.stringify(data),
        });
    },

    logout: async () => {
        return await apiRequest(`${USERS_URL}/logout`, true, {
        method: "POST",
        });
    },

    profile: async (data) => {
        return await apiRequest(`${USERS_URL}/profile`, true, {
        method: "PUT",
        body: JSON.stringify(data),
        });
    },

    getUsers: async () => {
        return await apiRequest(`${USERS_URL}`, true, {
        method: "GET",
        });
    },

    deleteUser: async (userId) => {
        return await apiRequest(`${USERS_URL}/${userId}`, true, {
        method: "DELETE",
        });
    },
    getUserDetails: async (userId) => {
        return await apiRequest(`${USERS_URL}/${userId}`, true, {
        method: "GET",
        });
    },
    updateUser: async (userId, data) => {
        return await apiRequest(`${USERS_URL}/${userId}`, true, {
            method: "PUT",
            body: JSON.stringify(data)
        })
    }

    };
    export default usersApi