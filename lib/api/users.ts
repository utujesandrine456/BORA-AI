import { apiClient } from './client';
import { User } from './types';

export const usersApi = {
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/v1/users/${id}`);
    return response.data;
  }
};
