import { createRouter, createWebHistory } from 'vue-router';

// Import pages
import Login from '@/pages/Login.vue';
import Home from '@/pages/Home.vue';
import Dashboard from '@/pages/Dashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  // Placeholder routes untuk menu items (nanti bisa dibuat page-nya)
  {
    path: '/templates',
    name: 'templates',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'Templates',
      requiresAuth: true
    }
  },
  {
    path: '/profile/overview',
    name: 'profile.overview',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'Profile Overview',
      requiresAuth: true
    }
  },
  {
    path: '/profile/settings',
    name: 'profile.settings',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'Profile Settings',
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'account',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'My Account',
      requiresAuth: true
    }
  },
  {
    path: '/network',
    name: 'network',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'Network',
      requiresAuth: true
    }
  },
  {
    path: '/store',
    name: 'store',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'Store - Client',
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: Dashboard, // Sementara redirect ke dashboard
    meta: {
      title: 'Authentication',
      requiresAuth: true
    }
  },
  // Redirect semua route yang tidak ditemukan ke dashboard
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard untuk set document title
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Laravel Vue` : 'Laravel Vue';
  next();
});

export default router;
