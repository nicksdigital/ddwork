<template>
  <div class="max-w-lg w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-10 rounded-lg shadow-2xl text-center">
    <h1 class="text-5xl font-bold text-white">Download Your Game</h1>
    <p class="text-xl text-gray-300 mt-4">Click below to start your download.</p>

    <button v-if="loading" disabled class="mt-6 px-8 py-3 text-xl bg-gray-500 text-white rounded-lg shadow-lg">
      Loading...
    </button>

    <a v-else-if="downloadUrl" :href="downloadUrl" target="_blank"
      class="mt-6 inline-block px-8 py-3 text-xl bg-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
      🎮 Download Now
    </a>

    <p v-else class="text-red-400 text-lg mt-4">⚠️ {{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { status } = useAuth();
const downloadUrl = ref(null);
const error = ref(null);
const loading = ref(true);

async function fetchDownloadLink() {
  try {
    const response = await $fetch('/api/download');
    downloadUrl.value = response.url;
  } catch (err) {
    error.value = err.data.message || 'Failed to generate download link';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (status.value === 'authenticated') {
    fetchDownloadLink();
  } else {
    error.value = 'You must be logged in to download this game.';
    loading.value = false;
  }
});
</script>
