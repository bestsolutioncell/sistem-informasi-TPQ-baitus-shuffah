import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://tpq-baitus-shuffah.com/api';

const API_TIMEOUT = 30000; // 30 seconds

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  parentId?: string;
  classId?: string;
  status: string;
  avatar?: string;
  createdAt: string;
}

export interface HafalanProgress {
  id: string;
  studentId: string;
  surah: string;
  ayahStart: number;
  ayahEnd: number;
  status: string;
  score?: number;
  notes?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentTransaction {
  id: string;
  studentId?: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  paymentMethod?: string;
  paidAt?: string;
  dueDate?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  studentId: string;
  planType: string;
  amount: number;
  status: string;
  billingCycle: string;
  nextBillingDate: string;
  autoRenewal: boolean;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          await this.logout();
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [{ text: 'OK' }]
          );
        } else if (error.response?.status >= 500) {
          Alert.alert(
            'Server Error',
            'Something went wrong on our end. Please try again later.',
            [{ text: 'OK' }]
          );
        } else if (!error.response) {
          Alert.alert(
            'Network Error',
            'Please check your internet connection and try again.',
            [{ text: 'OK' }]
          );
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      const { user, token, refreshToken } = response.data.data;
      
      // Store tokens
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Clear local storage
      await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await this.api.post('/auth/refresh', { refreshToken });
      const { token } = response.data.data;
      
      await AsyncStorage.setItem('userToken', token);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    try {
      const response = await this.api.get('/students');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  }

  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    try {
      const response = await this.api.get(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student'
      };
    }
  }

  // Hafalan
  async getHafalanProgress(studentId?: string): Promise<ApiResponse<HafalanProgress[]>> {
    try {
      const url = studentId ? `/hafalan?studentId=${studentId}` : '/hafalan';
      const response = await this.api.get(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch hafalan progress'
      };
    }
  }

  async submitHafalanProgress(data: Partial<HafalanProgress>): Promise<ApiResponse<HafalanProgress>> {
    try {
      const response = await this.api.post('/hafalan', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit hafalan progress'
      };
    }
  }

  async uploadHafalanRecording(hafalanId: string, audioFile: any): Promise<ApiResponse<string>> {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: audioFile.uri,
        type: audioFile.type,
        name: audioFile.fileName || 'hafalan_recording.m4a',
      } as any);

      const response = await this.api.post(`/hafalan/${hafalanId}/recording`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload recording'
      };
    }
  }

  // Attendance
  async getAttendance(studentId?: string, date?: string): Promise<ApiResponse<AttendanceRecord[]>> {
    try {
      const params = new URLSearchParams();
      if (studentId) params.append('studentId', studentId);
      if (date) params.append('date', date);
      
      const response = await this.api.get(`/attendance?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance'
      };
    }
  }

  async submitAttendance(data: Partial<AttendanceRecord>): Promise<ApiResponse<AttendanceRecord>> {
    try {
      const response = await this.api.post('/attendance', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit attendance'
      };
    }
  }

  // Payments
  async getPayments(studentId?: string): Promise<ApiResponse<PaymentTransaction[]>> {
    try {
      const url = studentId ? `/transactions?studentId=${studentId}` : '/transactions';
      const response = await this.api.get(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch payments'
      };
    }
  }

  async createPayment(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/payment/cart', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create payment'
      };
    }
  }

  // Subscriptions
  async getSubscriptions(studentId?: string): Promise<ApiResponse<Subscription[]>> {
    try {
      const url = studentId ? `/subscriptions?studentId=${studentId}` : '/subscriptions';
      const response = await this.api.get(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch subscriptions'
      };
    }
  }

  async createSubscription(data: any): Promise<ApiResponse<Subscription>> {
    try {
      const response = await this.api.post('/subscriptions', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create subscription'
      };
    }
  }

  // Analytics
  async getPaymentAnalytics(filters?: any): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/analytics/payments?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.api.get('/notifications');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  }

  // Utility methods
  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async uploadFile(file: any, endpoint: string): Promise<ApiResponse<string>> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.fileName || 'upload.jpg',
      } as any);

      const response = await this.api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload file'
      };
    }
  }
}

export default new ApiService();
