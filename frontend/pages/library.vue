<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-white">My Game Library</h1>
      <LogoutButton />
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-xl text-gray-300">Loading your games...</p>
    </div>

    <div v-else-if="error" class="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
      <p class="text-xl text-red-300">{{ error }}</p>
      <button @click="fetchGames" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
        Try Again
      </button>
    </div>

    <div v-else-if="gameSets.length === 0" class="bg-gray-800/50 rounded-lg p-8 text-center">
      <h2 class="text-2xl text-gray-300 mb-4">No games in your library yet</h2>
      <p class="text-gray-400 mb-6">Activate a game code to add games to your library.</p>
      <NuxtLink to="/" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700">
        Activate a Code
      </NuxtLink>
    </div>

    <div v-else>
      <div v-for="gameSet in gameSets" :key="gameSet.id" class="mb-12">
        <h2 class="text-3xl font-bold text-white mb-4">{{ gameSet.name }}</h2>
        <p class="text-xl text-gray-300 mb-6">{{ gameSet.description }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="game in gameSet.games" :key="game.id" 
            class="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="h-48 bg-gray-700 relative overflow-hidden">
              <img v-if="game.image_url" :src="game.imageUrlResolved || '/placeholder-game.png'" :alt="game.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-700">
                <span class="text-gray-500 text-xl">No Image</span>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-2xl font-bold text-white mb-2">{{ game.name }}</h3>
              <div class="mt-4 flex justify-end">
                <button @click="downloadGame(game.id)" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LogoutButton from '../components/LogoutButton.vue';

const gameSets = ref([]);
const loading = ref(true);
const error = ref(null);

async function fetchGames() {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await $fetch('/api/user/game', {
      method: 'GET'
    });
    
    if (response.success && response.games) {
      // Process game sets and resolve image URLs
      const processedGameSets = await Promise.all(
        response.games.map(async (gameSet) => {
          // Process each game in the set to resolve image URLs
          const processedGames = await Promise.all(
            gameSet.games.map(async (game) => {
              // Add a resolved image URL property
              if (game.image_url) {
                game.imageUrlResolved = await resolveImageUrl(game.image_url);
              }
              return game;
            })
          );
          
          // Return the game set with processed games
          return {
            ...gameSet,
            games: processedGames
          };
        })
      );
      
      gameSets.value = processedGameSets;
      console.log('Game sets loaded:', gameSets.value);
    } else {
      gameSets.value = [];
      error.value = 'No games found in your library.';
    }
  } catch (err) {
    console.error('Error fetching games:', err);
    error.value = 'Failed to load your games. Please try again.';
  } finally {
    loading.value = false;
  }
}

async function resolveImageUrl(imagePath) {
  try {
    if (!imagePath) return null;
    
    // Check if it's an S3 URL
    if (imagePath.startsWith('s3://')) {
      console.log('Fetching S3 image URL for:', imagePath);
      
      const response = await $fetch('/api/image', {
        method: 'GET',
        query: { path: imagePath }
      });
      
      if (response.url) {
        return response.url;
      }
    }
    
    // Return the original path if it's not an S3 URL or if there was an error
    return imagePath;
  } catch (err) {
    console.error('Error fetching image URL:', err);
    return '/placeholder-game.png'; // Fallback to placeholder
  }
}

async function downloadGame(gameId) {
  try {
    console.log('Requesting download for game ID:', gameId);
    
    if (!gameId) {
      console.error('Game ID is missing');
      alert('Game ID is missing. Cannot generate download link.');
      return;
    }
    
    // Convert to string if it's not already
    const gameIdStr = String(gameId);
    
    const response = await $fetch('/api/download', {
      method: 'GET',
      query: { gameId: gameIdStr }
    });
    
    if (response.url) {
      console.log('Download URL received:', response.url);
      // Open the download URL in a new tab
      window.open(response.url, '_blank');
    } else {
      alert('Download link not available. Please try again.');
    }
  } catch (err) {
    console.error('Download error:', err);
    alert('Failed to generate download link. Please try again.');
  }
}

onMounted(() => {
  fetchGames();
});
</script>