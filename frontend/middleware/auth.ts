import { defineNuxtRouteMiddleware, navigateTo } from '#imports';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for public routes
  const publicRoutes = ['/login', '/signup', '/serial', '/', '/auth/error'];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Check if running on client-side
  if (typeof window !== 'undefined') {
    // Check for auth token in cookies
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    
    if (!authCookie) {
      // No auth token found, redirect to login
      return navigateTo('/login');
    }
  }
});
