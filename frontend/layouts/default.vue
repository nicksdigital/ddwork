<template>
    <!-- Background Image (Full Width & Height) -->
    <div class="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style="background-image: url('/ddbg2.jpeg');"></div>
    <div class="fixed inset-0 w-full h-full bg-black/80"></div> <!-- Dark overlay -->
  
    <!-- Main Container -->
    <div class="relative flex flex-col min-h-screen">
  
      <!-- 🏆 Top Navigation Menu (No Authentication Buttons) -->
      <nav class="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between bg-black/30 backdrop-blur-lg shadow-md z-50">
        <!-- Logo -->
        <NuxtLink to="/" class="text-white text-2xl font-bold">
          <div class="flex items-center">
            <img class="h-8 w-auto" src="/logo.png" alt="digital download Logo">
            <img class="h-8 w-auto ml-2" src="/logotext-dd.png" alt="digital download">
          </div>
        </NuxtLink>
  
        <!-- Navigation Links -->
        <div class="flex space-x-6">
          <NuxtLink to="/serial" class="text-white text-lg hover:text-gray-300">Register</NuxtLink>
          <NuxtLink to="/download" class="text-white text-lg hover:text-gray-300">Download</NuxtLink>
          <NuxtLink to="/support" class="text-white text-lg hover:text-gray-300">Support</NuxtLink>
        </div>
      </nav>
  
      <!-- Page Content (Centered) -->
      <main class="relative z-10 flex-grow flex items-center justify-center">
        <slot />
      </main>
  
      <!-- 📌 Footer (Sticks to Bottom) -->
      <footer class="bg-gray-800 text-white mt-auto py-6">
        <div class="container mx-auto px-4 flex justify-between items-center">
          <!-- Footer Logo -->
          <img class="h-8 w-auto" src="/logo.png" alt="Logo">
  
          <!-- Footer Links -->
          <div class="flex space-x-6">
            <NuxtLink to="/privacy" class="text-gray-300 hover:text-gray-100">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="text-gray-300 hover:text-gray-100">Terms of Service</NuxtLink>
          </div>
        </div>
      </footer>
  
    </div>
  </template>
  
  