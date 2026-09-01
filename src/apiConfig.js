/**
 * Centralized API Base URL Configuration
 * Environment variable VITE_API_BASE_URL allows dynamic production API targeting.
 * Defaults to 'http://localhost:5000' during local development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
