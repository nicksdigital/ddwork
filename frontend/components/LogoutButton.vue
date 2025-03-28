<template>
  <button @click="logout" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
    Logout
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

async function logout() {
  try {
    const response = await $fetch('/api/auth/logout', {
      method: 'POST'
    });
    
    if (response.success) {
      // Clear any user data from localStorage
      localStorage.removeItem('user');
      
      // Redirect to login page
      router.push('/login');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
</script>
