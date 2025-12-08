<template>
  <div
    :class="[
      'h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Header -->
    <div class="p-4 border-b border-slate-800">
      <div class="flex items-center justify-between">
        <div v-if="!isCollapsed" class="flex items-center gap-3">
          <!-- User Avatar -->
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {{ user.initials }}
          </div>
          <!-- User Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-white font-medium text-sm truncate">{{ user.name }}</h3>
            <p class="text-gray-400 text-xs truncate">{{ user.email }}</p>
          </div>
        </div>
        <div v-else class="w-full flex justify-center">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            {{ user.initials }}
          </div>
        </div>
        <!-- Toggle Button (Visible only when expanded) -->
        <button
          v-if="!isCollapsed"
          @click="toggleSidebar"
          class="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Toggle Button (Visible only when collapsed - Moved below header) -->
    <div v-if="isCollapsed" class="w-full flex justify-center py-3 border-b border-slate-800">
      <button
        @click="toggleSidebar"
        class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400"
      >
        <Menu class="w-5 h-5" />
      </button>
    </div>

    <!-- Search Bar -->
    <div v-if="!isCollapsed" class="p-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto px-3 py-2">
      <div class="space-y-1">
        <template v-for="(item, index) in menuItems" :key="index">
          <!-- Regular Menu Item -->
          <div v-if="!item.children">
            <router-link
              :to="item.to || '#'"
              @click="item.onClick ? item.onClick() : null"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                isCollapsed ? 'justify-center' : '',
                isActive(item.to)
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!isCollapsed" class="flex-1">{{ item.label }}</span>
              <ChevronRight v-if="!isCollapsed && item.hasArrow" class="w-4 h-4" />
            </router-link>
          </div>

          <!-- Menu Item with Children (Expandable) -->
          <div v-else>
            <button
              @click="toggleSubmenu(index)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                isCollapsed ? 'justify-center' : '',
                'text-gray-300 hover:bg-slate-800 hover:text-white'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!isCollapsed" class="flex-1 text-left">{{ item.label }}</span>
              <ChevronDown
                v-if="!isCollapsed"
                :class="[
                  'w-4 h-4 transition-transform',
                  openSubmenus.includes(index) ? 'rotate-180' : ''
                ]"
              />
            </button>

            <!-- Submenu -->
            <div
              v-if="!isCollapsed && openSubmenus.includes(index)"
              class="ml-8 mt-1 space-y-1"
            >
              <router-link
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                :to="child.to || '#'"
                class="block px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              >
                {{ child.label }}
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-slate-800">
      <!-- <div :class="['flex items-center gap-3', isCollapsed ? 'justify-center' : '']">
        <div class="relative">
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
        </div>
        <div v-if="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-white text-sm font-medium">System Online</p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  Menu,
  Search,
  LayoutDashboard,
  Mail,
  User,
  Settings,
  Users,
  ShoppingCart,
  Shield,
  ChevronRight,
  ChevronDown
} from 'lucide-vue-next';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'demo',
      email: 'demo@example.com',
      initials: 'D'
    })
  },
  menuItems: {
    type: Array,
    default: () => [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        to: '/dashboard'
      },
      {
        icon: Mail,
        label: 'Templates',
        to: '/templates'
      },
      {
        icon: User,
        label: 'Public Profile',
        children: [
          { label: 'Overview', to: '/profile/overview' },
          { label: 'Settings', to: '/profile/settings' }
        ]
      },
      {
        icon: Settings,
        label: 'My Account',
        to: '/account',
        hasArrow: true
      },
      {
        icon: Users,
        label: 'Network',
        to: '/network',
        hasArrow: true
      },
      {
        icon: ShoppingCart,
        label: 'Store - Client',
        to: '/store',
        hasArrow: true
      },
      {
        icon: Shield,
        label: 'Authentication',
        to: '/auth',
        hasArrow: true
      }
    ]
  }
});

const route = useRoute();
const isCollapsed = ref(false);
const openSubmenus = ref([]);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  if (isCollapsed.value) {
    openSubmenus.value = [];
  }
};

const toggleSubmenu = (index) => {
  const idx = openSubmenus.value.indexOf(index);
  if (idx > -1) {
    openSubmenus.value.splice(idx, 1);
  } else {
    openSubmenus.value.push(index);
  }
};

const isActive = (path) => {
  if (!path) return false;
  return route.path === path;
};
</script>
