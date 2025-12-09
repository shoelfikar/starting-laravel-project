<template>
  <div class="bg-slate-900 rounded-lg border border-slate-800">
    <!-- Header with Search and Filters -->
    <div class="p-4 border-b border-slate-800">
      <div class="flex items-center justify-between gap-4">
        <!-- Search Bar -->
        <div class="relative flex-1 max-w-xs">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Users..."
            class="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <!-- Filter Buttons -->
        <div class="flex items-center gap-2">
          <!-- Status Dropdown -->
          <div class="relative">
            <button
              @click="toggleStatusDropdown"
              class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors text-sm flex items-center gap-2"
            >
              <Filter class="w-4 h-4" />
              Status
              <span v-if="selectedStatuses.length > 0" class="ml-1 px-2 py-0.5 bg-slate-700 rounded-full text-xs">{{ selectedStatuses.length }}</span>
            </button>

            <!-- Status Dropdown Menu -->
            <div
              v-if="showStatusDropdown"
              class="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 p-3"
            >
              <div class="text-gray-400 text-xs font-medium mb-3">Filters</div>
              <div class="space-y-2">
                <label
                  v-for="status in statusOptions"
                  :key="status.value"
                  class="flex items-center justify-between p-2 hover:bg-slate-700 rounded-lg cursor-pointer group"
                >
                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      :value="status.value"
                      v-model="selectedStatuses"
                      class="w-4 h-4 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                    />
                    <span class="text-white text-sm">{{ status.label }}</span>
                  </div>
                  <span class="text-gray-400 text-sm">{{ status.count }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Sort Order Dropdown -->
          <div class="relative">
            <button
              @click="toggleSortDropdown"
              class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors text-sm flex items-center gap-2"
            >
              <ArrowUpDown class="w-4 h-4" />
              Sort Order
              <span v-if="selectedSort" class="ml-1 text-white">{{ selectedSort }}</span>
            </button>

            <!-- Sort Dropdown Menu -->
            <div
              v-if="showSortDropdown"
              class="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 p-3"
            >
              <div class="text-gray-400 text-xs font-medium mb-3">Sort By</div>
              <div class="space-y-2">
                <label
                  v-for="option in sortOptions"
                  :key="option.value"
                  class="flex items-center gap-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  <input
                    type="radio"
                    :value="option.value"
                    v-model="selectedSort"
                    class="w-4 h-4 bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-white text-sm">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <button class="px-4 py-2 bg-indigo-600 border border-indigo-500 rounded-lg text-white hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2">
            <SlidersHorizontal class="w-4 h-4" />
            Filters
          </button>

          <!-- Columns Dropdown -->
          <div class="relative">
            <button
              @click="toggleColumnsDropdown"
              class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors text-sm flex items-center gap-2"
            >
              <SlidersHorizontal class="w-4 h-4" />
              Columns
            </button>

            <!-- Columns Dropdown Menu -->
            <div
              v-if="showColumnsDropdown"
              class="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 p-3"
            >
              <div class="text-gray-400 text-xs font-medium mb-3">Toggle Columns</div>
              <div class="space-y-2">
                <label
                  v-for="column in columnOptions"
                  :key="column.key"
                  class="flex items-center gap-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    v-model="column.visible"
                    class="w-4 h-4 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  <span class="text-white text-sm">{{ column.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-800">
            <th class="px-4 py-3 text-left">
              <input type="checkbox" class="w-4 h-4 bg-slate-800 border-slate-600 rounded text-indigo-600 focus:ring-indigo-500" />
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-400">
              <div class="flex items-center gap-2">
                Member
                <ArrowUp class="w-4 h-4" />
              </div>
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-400">
              <div class="flex items-center gap-2">
                Role
                <ArrowUpDown class="w-4 h-4 opacity-50" />
              </div>
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-400">
              <div class="flex items-center gap-2">
                Status
                <ArrowUpDown class="w-4 h-4 opacity-50" />
              </div>
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-400">
              <div class="flex items-center gap-2">
                Location
                <ArrowUpDown class="w-4 h-4 opacity-50" />
              </div>
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-400">
              <div class="flex items-center gap-2">
                Activity
                <ArrowUpDown class="w-4 h-4 opacity-50" />
              </div>
            </th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in filteredUsers"
            :key="index"
            class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
          >
            <td class="px-4 py-4">
              <input type="checkbox" class="w-4 h-4 bg-slate-800 border-slate-600 rounded text-indigo-600 focus:ring-indigo-500" />
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {{ user.initials }}
                </div>
                <div>
                  <div class="text-white font-medium text-sm">{{ user.name }}</div>
                  <div class="text-gray-400 text-sm">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-gray-300 text-sm">{{ user.role }}</td>
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                  getStatusClass(user.status)
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(user.status)"></span>
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2 text-gray-300 text-sm">
                <span class="text-lg">{{ user.flag }}</span>
                {{ user.location }}
              </div>
            </td>
            <td class="px-4 py-4 text-gray-400 text-sm">{{ user.activity }}</td>
            <td class="px-4 py-4">
              <div class="relative">
                <button
                  @click="toggleActionMenu(index)"
                  class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400"
                >
                  <MoreVertical class="w-4 h-4" />
                </button>

                <!-- Action Menu Dropdown -->
                <div
                  v-if="openActionMenuIndex === index"
                  class="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1"
                >
                  <button
                    @click="handleEdit(user)"
                    class="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleCopyId(user, index)"
                    class="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    Copy ID
                  </button>
                  <button
                    @click="handleDelete(user)"
                    class="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="p-4 border-t border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-gray-400 text-sm">Rows per page</span>
        <select
          v-model="rowsPerPage"
          class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-gray-400 text-sm">1 - {{ Math.min(rowsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }}</span>
        <div class="flex items-center gap-1">
          <button class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button class="px-3 py-1.5 bg-indigo-600 rounded-lg text-white text-sm font-medium">1</button>
          <button class="px-3 py-1.5 hover:bg-slate-800 rounded-lg text-gray-400 text-sm">2</button>
          <button class="px-3 py-1.5 hover:bg-slate-800 rounded-lg text-gray-400 text-sm">3</button>
          <button class="px-3 py-1.5 hover:bg-slate-800 rounded-lg text-gray-400 text-sm">4</button>
          <button class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';

// Search and pagination
const searchQuery = ref('');
const rowsPerPage = ref(10);

// Dropdown states
const showStatusDropdown = ref(false);
const showSortDropdown = ref(false);
const showColumnsDropdown = ref(false);
const openActionMenuIndex = ref(null);

// Filter states
const selectedStatuses = ref([]);
const selectedSort = ref('');

// Column visibility options
const columnOptions = ref([
  { key: 'member', label: 'Member', visible: true },
  { key: 'role', label: 'Role', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'location', label: 'Location', visible: true },
  { key: 'activity', label: 'Activity', visible: true }
]);

// Users data
const users = ref([
  {
    name: 'Charles Carter',
    email: 'charles.carter@gmail.com',
    initials: 'CC',
    role: 'Engineer',
    status: 'In Office',
    location: 'Hungary',
    flag: '🇭🇺',
    activity: 'Today, 10:30'
  },
  {
    name: 'Jessica Evans',
    email: 'jessica.evans@gmail.com',
    initials: 'JE',
    role: 'Designer',
    status: 'Remote',
    location: 'Poland',
    flag: '🇵🇱',
    activity: 'Today, 13:45'
  },
  {
    name: 'Justin Adams',
    email: 'justin.adams@gmail.com',
    initials: 'JA',
    role: 'Viewer',
    status: 'On Leave',
    location: 'Czech Republic',
    flag: '🇨🇿',
    activity: 'Yesterday, 15:30'
  },
  {
    name: 'Thomas Clark',
    email: 'thomas.clark@gmail.com',
    initials: 'TC',
    role: 'Analyst',
    status: 'In Office',
    location: 'Switzerland',
    flag: '🇨🇭',
    activity: 'Today, 11:00'
  },
  {
    name: 'Steven Harris',
    email: 'steven.harris@gmail.com',
    initials: 'SH',
    role: 'Admin',
    status: 'Remote',
    location: 'Greece',
    flag: '🇬🇷',
    activity: 'Current session'
  },
  {
    name: 'Kevin Evans',
    email: 'kevin.evans@gmail.com',
    initials: 'KE',
    role: 'Support',
    status: 'In Office',
    location: 'Austria',
    flag: '🇦🇹',
    activity: 'Today, 14:00'
  },
  {
    name: 'Andrew Mitchell',
    email: 'andrew.mitchell@gmail.com',
    initials: 'AM',
    role: 'Product Manager',
    status: 'Remote',
    location: 'Portugal',
    flag: '🇵🇹',
    activity: 'Today, 12:45'
  },
  {
    name: 'Paul Walker',
    email: 'paul.walker@gmail.com',
    initials: 'PW',
    role: 'Developer',
    status: 'On Leave',
    location: 'Denmark',
    flag: '🇩🇰',
    activity: 'Yesterday, 16:00'
  },
  {
    name: 'Jason Reed',
    email: 'jason.reed@gmail.com',
    initials: 'JR',
    role: 'Engineer',
    status: 'In Office',
    location: 'Belgium',
    flag: '🇧🇪',
    activity: 'Month ago'
  },
  {
    name: 'Donald Coleman',
    email: 'donald.coleman@gmail.com',
    initials: 'DC',
    role: 'Manager',
    status: 'In Office',
    location: 'Ireland',
    flag: '🇮🇪',
    activity: 'Yesterday, 12:00'
  }
]);

// Status options with counts
const statusOptions = computed(() => {
  const counts = {
    'In Office': 0,
    'Remote': 0,
    'On Leave': 0
  };

  users.value.forEach(user => {
    if (counts.hasOwnProperty(user.status)) {
      counts[user.status]++;
    }
  });

  return [
    { value: 'In Office', label: 'In Office', count: counts['In Office'] },
    { value: 'Remote', label: 'Remote', count: counts['Remote'] },
    { value: 'On Leave', label: 'On Leave', count: counts['On Leave'] }
  ];
});

// Sort options
const sortOptions = ref([
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'activity-recent', label: 'Recent Activity' },
  { value: 'activity-oldest', label: 'Oldest Activity' }
]);

// Filtered and sorted users
const filteredUsers = computed(() => {
  let filtered = users.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (selectedStatuses.value.length > 0) {
    filtered = filtered.filter(user =>
      selectedStatuses.value.includes(user.status)
    );
  }

  // Apply sorting
  if (selectedSort.value) {
    const sorted = [...filtered];
    switch (selectedSort.value) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'activity-recent':
        // Simple sort based on activity text
        sorted.sort((a, b) => {
          if (a.activity.includes('Current')) return -1;
          if (b.activity.includes('Current')) return 1;
          if (a.activity.includes('Today') && !b.activity.includes('Today')) return -1;
          if (!a.activity.includes('Today') && b.activity.includes('Today')) return 1;
          return 0;
        });
        break;
      case 'activity-oldest':
        sorted.sort((a, b) => {
          if (a.activity.includes('Month ago')) return -1;
          if (b.activity.includes('Month ago')) return 1;
          if (a.activity.includes('Yesterday') && !b.activity.includes('Yesterday')) return -1;
          if (!a.activity.includes('Yesterday') && b.activity.includes('Yesterday')) return 1;
          return 0;
        });
        break;
    }
    return sorted;
  }

  return filtered;
});

// Toggle functions
const toggleStatusDropdown = () => {
  showStatusDropdown.value = !showStatusDropdown.value;
  showSortDropdown.value = false;
  showColumnsDropdown.value = false;
  openActionMenuIndex.value = null;
};

const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value;
  showStatusDropdown.value = false;
  showColumnsDropdown.value = false;
  openActionMenuIndex.value = null;
};

const toggleColumnsDropdown = () => {
  showColumnsDropdown.value = !showColumnsDropdown.value;
  showStatusDropdown.value = false;
  showSortDropdown.value = false;
  openActionMenuIndex.value = null;
};

const toggleActionMenu = (index) => {
  if (openActionMenuIndex.value === index) {
    openActionMenuIndex.value = null;
  } else {
    openActionMenuIndex.value = index;
    showStatusDropdown.value = false;
    showSortDropdown.value = false;
    showColumnsDropdown.value = false;
  }
};

// Action handlers
const handleEdit = (user) => {
  console.log('Edit user:', user);
  openActionMenuIndex.value = null;
  // Add your edit logic here
};

const handleCopyId = (user, index) => {
  // Copy user index/id to clipboard
  navigator.clipboard.writeText(`${index + 1}`);
  console.log('Copied ID:', index + 1);
  openActionMenuIndex.value = null;
  // You can add a toast notification here
};

const handleDelete = (user) => {
  console.log('Delete user:', user);
  openActionMenuIndex.value = null;
  // Add your delete logic here (with confirmation)
};

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const target = event.target;
  if (!target.closest('.relative')) {
    showStatusDropdown.value = false;
    showSortDropdown.value = false;
    showColumnsDropdown.value = false;
    openActionMenuIndex.value = null;
  }
};

// Status badge styling
const getStatusClass = (status) => {
  switch (status) {
    case 'In Office':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'Remote':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'On Leave':
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

const getStatusDotClass = (status) => {
  switch (status) {
    case 'In Office':
      return 'bg-green-400';
    case 'Remote':
      return 'bg-blue-400';
    case 'On Leave':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
