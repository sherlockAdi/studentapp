// API Configuration
export const API_BASE_URL = 'http://webnestapi.multifacet-software.com';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Reminders
  REMINDERS: {
    GET_ALL: '/reminders',
    CREATE: '/reminders',
    GET_BY_ID: (id) => `/reminders/${id}`,
    UPDATE: (id) => `/reminders/${id}`,
    DELETE: (id) => `/reminders/${id}`,
    COMPLETE: (id) => `/reminders/${id}/complete`,
  },
  
  // Pharmacy
  PHARMACY: {
    GET_ALL: '/pharmacy',
    NEARBY: '/pharmacy/nearby',
    CREATE: '/pharmacy',
    GET_BY_ID: (id) => `/pharmacy/${id}`,
    UPDATE: (id) => `/pharmacy/${id}`,
    DELETE: (id) => `/pharmacy/${id}`,
  },
  
  // Files
  FILES: {
    GET_ALL: '/files',
    UPLOAD: '/files',
    GET_BY_ID: (id) => `/files/${id}`,
    DELETE: (id) => `/files/${id}`,
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
