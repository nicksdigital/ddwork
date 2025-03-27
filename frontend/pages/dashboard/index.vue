<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
  </div>
</template>
<script setup lang="ts">


definePageMeta({
  middleware: 'sidebase-auth',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/'
  }
})
</script>