import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createChat = async (userId, content) => {
    const response = await api.post('/chat', { content }, {
        headers: { 'X-User-ID': userId }
    });
    return response.data;
};

export const continueChat = async (userId, chatId, content) => {
    const response = await api.post(`/chat/${chatId}/message`, { content }, {
        headers: { 'X-User-ID': userId } // Technically not needed for continue but good consistency
    });
    return response.data;
};

export const getChatHistory = async (userId, chatId) => {
    const response = await api.get(`/chat/${chatId}`, {
        headers: { 'X-User-ID': userId }
    });
    return response.data;
};

export const getChatsList = async (userId) => {
    const response = await api.get('/chats', {
        headers: { 'X-User-ID': userId }
    });
    return response.data;
};

export default api;
