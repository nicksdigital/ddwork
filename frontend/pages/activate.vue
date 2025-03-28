<template>
  <div class="max-w-lg w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-10 rounded-lg shadow-2xl text-center">
    <h1 class="text-5xl font-bold text-white">Activate Your Game</h1>
    <p class="text-xl text-gray-300 mt-4">Enter your serial number to get started.</p>

    <form @submit.prevent="validateSerial" class="mt-6">
      <input v-model="serialNumber" type="text" placeholder="Serial Number"
        class="w-full p-4 text-xl mt-4 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:ring-4 focus:ring-primary" required />

      <button type="submit"
        class="mt-6 w-full px-6 py-3 text-xl bg-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
        Activate
      </button>
    </form>

    <p v-if="error" class="text-red-400 text-lg mt-4">⚠️ {{ error }}</p>
    <p v-if="success" class="text-green-400 text-lg mt-4">✅ {{ success }}</p>

    <p class="text-gray-400 text-sm mt-6">
      Already have an account? <NuxtLink to="/login" class="text-primary hover:underline">Log in</NuxtLink>.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const serialNumber = ref('');
const error = ref(null);
const success = ref(null);

async function validateSerial() {
  try {
    error.value = null;
    success.value = null;

    // Validate the serial number
    const serialResponse = await $fetch('/api/serial/validate', {
      method: 'POST',
      body: { serial: serialNumber.value },
    });

    if (!serialResponse.success) {
      error.value = serialResponse.message || 'Invalid serial number';
      return;
    }

    // If serial is valid, redirect to registration page with serial as query param
    success.value = 'Serial number validated! Redirecting to registration...';
    setTimeout(() => {
      router.push(`/register?serial=${encodeURIComponent(serialNumber.value)}`);
    }, 1500);
  } catch (err) {
    error.value = err.data?.message || 'An error occurred.';
  }
}
</script>
