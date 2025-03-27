<template>
    <button
      class="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200"
      :class="{
        'bg-primary hover:bg-blue-700': variant === 'primary',
        'bg-secondary hover:bg-purple-700': variant === 'secondary',
        'bg-accent hover:bg-yellow-500': variant === 'accent',
      }"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  defineProps({
    variant: {
      type: String,
      default: "primary",
    },
  });
  </script>
  