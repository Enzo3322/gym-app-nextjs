import axios from 'axios';
import { ExerciseFormData } from '../(protected)/exercises/create/page';
import { WorkoutFormData } from '../(protected)/workouts/create/page';
import { WorkoutExerciseFormData } from '../(protected)/workouts/[id]/add-exercise/page';
const API_URL = 'http://45.56.114.56:3000/api';

type UserData = {
  name?: string;
  email?: string;
  password?: string;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? 
      document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1') : '';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/users', { name, email, password });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getCurrentUser: async () => {
    const token = typeof window !== 'undefined' ? 
      document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1') : '';
    
    if (!token) return null;
    
    // Extract user ID from token (assuming JWT with payload containing user ID)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const response = await api.get(`/users/${payload.id}`);
    return response.data;
  },
  updateUser: async (id: string, userData: UserData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};

// Exercises API
export const exercisesAPI = {
  getExercises: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },
  getExercise: async (id: string) => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },
  createExercise: async (exerciseData: ExerciseFormData) => {
    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },
};

// Workouts API
export const workoutsAPI = {
  getWorkouts: async () => {
    const response = await api.get('/workouts');
    return response.data;
  },
  getWorkout: async (id: string) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },
  createWorkout: async (workoutData: WorkoutFormData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },
  updateWorkout: async (id: string, workoutData: WorkoutFormData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },
  deleteWorkout: async (id: string) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },
  addExerciseToWorkout: async (workoutId: string, exerciseData: WorkoutExerciseFormData) => {
    const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
    return response.data;
  },
};

export default api; 