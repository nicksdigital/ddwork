<template>
    <div class="max-w-5xl mx-auto py-10">
      <h1 class="text-5xl font-bold text-white text-center">Your Game Library</h1>
  
      <div v-if="loading" class="text-center text-gray-300 mt-6">Loading...</div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div v-for="gameSet in gameSets" :key="gameSet.id" class="bg-white/10 rounded-lg shadow-lg p-4">
          <h2 class="text-2xl font-bold text-white">{{ gameSet.name }}</h2>
          <img :src="gameSet.cover_image" class="w-full h-40 object-cover rounded-md mt-2">
          <div v-for="game in gameSet.games" :key="game.id">
            <p class="text-lg text-white">{{ game.name }}</p>
            <a :href="game.download_url" class="text-primary underline">Download</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';


  const gameSets = ref([]);
  const loading = ref(true);


  onMounted(async () => {
    if (!user.value) {
      // Redirect to login if user is not authenticated
      navigateTo('/auth/signin');
    } else {
      // Fetch user's games if authenticated
      const { data: games, error } = await supabase
        .from('user_game_sets')
        .select('game_sets(id, name, description, cover_image, games(id, name, download_url, image_url))')
        .eq('user_id', user.value.id);

      if (error) {
        console.error('Failed to fetch games:', error);
      } else {
        gameSets.value = games;
      }
    }
  });
  </script>