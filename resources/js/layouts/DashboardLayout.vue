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
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
                  <p class="text-xs text-gray-500">{{ user.role }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {{ user.initials }}
                </div>
                <ChevronDown class="w-4 h-4 text-gray-600" :class="{ 'rotate-180': showUserMenu }" />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  :disabled="isLoggingOut"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut class="w-4 h-4" />
                  <span v-if="isLoggingOut">Logging out...</span>
                  <span v-else>Logout</span>
                </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/common/Sidebar.vue';
import { Bell, ChevronDown, LogOut } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';

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
const { logout } = useAuth();

const showUserMenu = ref(false);
const isLoggingOut = ref(false);

const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard';
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  isLoggingOut.value = true;
  await logout();
  isLoggingOut.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const userMenu = event.target.closest('.relative');
  if (!userMenu && showUserMenu.value) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
