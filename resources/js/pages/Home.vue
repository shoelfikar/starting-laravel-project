<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          Selamat Datang di Laravel 11 + Vue 3
        </h1>
        <p class="text-xl text-gray-600 mb-6">
          Dengan Tailwind CSS
        </p>

        <div class="flex justify-center gap-4 mb-8">
          <span class="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full font-semibold">
            Laravel 11
          </span>
          <span class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
            Vue 3
          </span>
          <span class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
            Tailwind CSS
          </span>
        </div>

        <div class="bg-gray-50 rounded-xl p-6 mb-6">
          <p class="text-lg text-gray-700 mb-4">Counter: <span class="font-bold text-blue-600">{{ count }}</span></p>
          <button
            @click="increment"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Tambah +1
          </button>
        </div>

        <div class="text-sm text-gray-500">
          <p>Edit file ini di <code class="bg-gray-200 px-2 py-1 rounded">resources/js/components/App.vue</code></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>
