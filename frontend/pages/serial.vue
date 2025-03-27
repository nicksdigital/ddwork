<template>
  <div class="max-w-lg w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-10 rounded-lg shadow-2xl text-center">
    <h1 class="text-5xl font-bold text-white">Enter Your Serial Number</h1>
    <p class="text-lg text-gray-300 mt-2">To proceed, enter your game serial number.</p>

    <form @submit.prevent="validateSerial" class="mt-6">
      <div class="relative">
        <input v-model="serial" type="text" placeholder="Enter your serial number..."
          class="w-full p-5 text-xl rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-primary backdrop-blur-md shadow-md"
          required />
        <button type="submit"
          class="absolute top-1/2 right-3 transform -translate-y-1/2 px-6 py-3 text-xl bg-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
          Submit
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-400 text-lg mt-4">{{ error }}</p>
    <p v-if="success" class="text-green-400 text-lg mt-4">✅ Serial registered! Redirecting...</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const serial = ref('');
const error = ref(null);
const success = ref(false);

async function validateSerial() {
  try {
    error.value = null;
    success.value = false;

    const response = await $fetch('/api/serial/validate', {
      method: 'POST',
      body: { serial: serial.value },
    });

    if (response.success) {
      success.value = true;
      setTimeout(() => {
        router.push('/auth'); // Redirects to authentication page
      }, 2000);
    } else {
      error.value = response.message || 'Invalid serial number';
    }
  } catch (err) {
    error.value = err.data.message || 'An error occurred. Please try again.';
  }
}
</script>
