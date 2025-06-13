import { apiService } from '../api';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },


  createUser: async (userData) => {
    try {
      const response = await apiService.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUserRole: async (userId, roleId) => {
    try {
      const response = await apiService.put(`/users/${userId}`, { roleId });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiService.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
}; 