<template>
  <DashboardLayout :user="user" :menu-items="menuItems">
    <!-- Dashboard Content -->
    <div class="space-y-6">
      <!-- Welcome Card -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 class="text-2xl font-bold mb-2">Welcome back, {{ user.name }}! 👋</h2>
        <p class="text-indigo-100">Here's what's happening with your projects today.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="stat.bgColor"
            >
              <component :is="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
            </div>
            <span
              class="text-sm font-semibold px-2 py-1 rounded-full"
              :class="stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ stat.change }}
            </span>
          </div>
          <h3 class="text-gray-600 text-sm font-medium mb-1">{{ stat.label }}</h3>
          <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800">Recent Activity</h3>
            <button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="(activity, index) in recentActivities"
              :key="index"
              class="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', activity.bgColor]">
                <component :is="activity.icon" :class="['w-5 h-5', activity.iconColor]" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div class="space-y-3">
            <button
              v-for="(action, index) in quickActions"
              :key="index"
              class="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <component :is="action.icon" class="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
              <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{{ action.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import {
  LayoutDashboard,
  Mail,
  User,
  Settings,
  Users,
  ShoppingCart,
  Shield,
  TrendingUp,
  FileText,
  DollarSign,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Upload,
  Download,
  Share2
} from 'lucide-vue-next';

// User data
const user = ref({
  name: 'Demo User',
  email: 'demo@example.com',
  initials: 'D',
  role: 'Administrator'
});

// Menu items for sidebar
const menuItems = ref([
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
]);

// Stats data
const stats = ref([
  {
    label: 'Total Revenue',
    value: '$45,231',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    label: 'New Users',
    value: '2,345',
    change: '+8.2%',
    trend: 'up',
    icon: UserPlus,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    label: 'Active Projects',
    value: '18',
    change: '-2.4%',
    trend: 'down',
    icon: FileText,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    label: 'Completion Rate',
    value: '94%',
    change: '+5.1%',
    trend: 'up',
    icon: TrendingUp,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
]);

// Recent activities
const recentActivities = ref([
  {
    title: 'New user registered',
    description: 'John Doe joined the platform',
    time: '2 minutes ago',
    icon: UserPlus,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Project completed',
    description: 'Website redesign project marked as complete',
    time: '1 hour ago',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Pending approval',
    description: 'New template waiting for review',
    time: '3 hours ago',
    icon: Clock,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    title: 'System alert',
    description: 'Server maintenance scheduled for tonight',
    time: '5 hours ago',
    icon: AlertCircle,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600'
  }
]);

// Quick actions
const quickActions = ref([
  { label: 'Create New Project', icon: Plus },
  { label: 'Upload Files', icon: Upload },
  { label: 'Export Data', icon: Download },
  { label: 'Share Resources', icon: Share2 }
]);
</script>
