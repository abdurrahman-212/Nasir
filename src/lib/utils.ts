import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('admin_token');
    if (window.location.pathname.startsWith('/admin')) {
       window.location.href = '/admin/login';
    }
  }

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    let errorDetail = '';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetail = JSON.stringify(errorData);
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    console.error(`[API ERROR] ${endpoint}:`, errorMessage, errorDetail);
    throw new Error(errorMessage);
  }
  return response.json();
};
