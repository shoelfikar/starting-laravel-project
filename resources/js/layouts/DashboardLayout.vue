<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar
      :user="user"
      :menu-items="menuItems"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800">{{ pageTitle }}</h1>

          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell class="w-5 h-5 text-gray-600" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.role }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {{ user.initials }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/common/Sidebar.vue';
import { Bell } from 'lucide-vue-next';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Demo User',
      email: 'demo@example.com',
      initials: 'D',
      role: 'Administrator'
    })
  },
  menuItems: {
    type: Array,
    default: () => []
  }
});

const route = useRoute();

const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard';
});
</script>
