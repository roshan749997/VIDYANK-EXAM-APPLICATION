import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure API base URL based on platform
// For web: use localhost
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost
// For physical devices: use your machine's local IP address

// IMPORTANT: Change this to your machine's local IP if testing on a physical device
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
const LOCAL_IP = '192.168.1.44'; // Update this with your actual local IP address

// Set to true if testing on a physical device (iOS/Android)
// Set to false if using simulator/emulator
const USE_PHYSICAL_DEVICE = false; // Change to true for physical device testing

let BASE_URL = 'http://localhost:5000/api';

if (Platform.OS === 'web') {
  BASE_URL = 'http://localhost:5000/api';
} else if (Platform.OS === 'android') {
  if (USE_PHYSICAL_DEVICE) {
    BASE_URL = `http://${LOCAL_IP}:5000/api`;
  } else {
    // Android emulator
    BASE_URL = 'http://10.0.2.2:5000/api';
  }
} else if (Platform.OS === 'ios') {
  // iOS simulator sometimes has issues with localhost
  // Using IP address works for both simulator and physical device
  BASE_URL = `http://${LOCAL_IP}:5000/api`;
} else {
  BASE_URL = `http://${LOCAL_IP}:5000/api`;
}

// Log the API URL for debugging
console.log(`API Base URL: ${BASE_URL}`);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - Server took too long to respond');
        } else if (error.message === 'Network Error') {
            console.error(`Network Error - Cannot reach server at ${BASE_URL}`);
            console.error('Make sure:');
            console.error('1. Backend server is running on port 5000');
            console.error('2. If using physical device, update LOCAL_IP in api.ts');
            console.error('3. Device and computer are on the same network');
        }
        return Promise.reject(error);
    }
);

// Request interceptor to add token
api.interceptors.request.use(
    async (config) => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
