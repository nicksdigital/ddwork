<template>
    <div class="min-h-screen bg-background dark:bg-darkBackground text-text dark:text-darkText">
      <button @click="toggleTheme" class="fixed top-4 right-4 p-2 rounded-xl bg-primary text-white">
      {{ darkMode ? "☀️ Light Mode" : "🌙 Dark Mode" }}
    </button>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</div>
</template>

<script setup lang="ts">

import { ref, watch, onMounted } from 'vue';

const darkMode = ref(false);

const route = useRoute();

// Load theme from localStorage



// Toggle dark mode
const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
  localStorage.setItem("theme", darkMode.value ? "dark" : "light");
};

onMounted(() => {
  // Skip auth check for the homepage
  darkMode.value = localStorage.getItem("theme") === "dark";
  document.documentElement.classList.toggle("dark", darkMode.value);

 
});
</script>
