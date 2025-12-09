<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Login Form -->
    <div class="w-full lg:w-1/2 bg-slate-900 flex items-center justify-center p-8">
      <div class="w-full max-w-sm">
        <!-- Form Container with Border -->
        <div class="border border-slate-700 rounded-xl p-8 bg-slate-800/30 backdrop-blur-sm shadow-xl">
          <!-- Tailwind CSS Logo -->
          <div class="flex justify-center mb-6">
            <svg class="w-14 h-14" viewBox="0 0 248 204" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M124.001 0C87.3336 0 64.0003 19.8 54.0003 59.4C69.0003 39.6 86.667 32.1 107 37.8C116.511 40.3618 123.375 47.2627 130.852 54.7817C143.279 67.2745 158.006 82.2 186.001 82.2C222.668 82.2 246.001 62.4 256.001 22.8C241.001 42.6 223.334 50.1 203.001 44.4C193.49 41.8382 186.626 34.9373 179.149 27.4183C166.722 14.9255 151.995 0 124.001 0ZM54.0003 99C17.3336 99 -5.99969 118.8 -15.9997 158.4C-0.999687 138.6 16.667 131.1 37.0003 136.8C46.5112 139.362 53.3753 146.263 60.8521 153.782C73.2793 166.274 88.0058 181.2 116.001 181.2C152.668 181.2 176.001 161.4 186.001 121.8C171.001 141.6 153.334 149.1 133.001 143.4C123.49 140.838 116.626 133.937 109.149 126.418C96.7217 113.926 81.9952 99 54.0003 99Z" fill="#4F46E5"/>
            </svg>
          </div>

          <!-- Title -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-white mb-2 text-center">Sign in to your account</h1>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2.5 pr-10 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.remember"
                type="checkbox"
                class="w-4 h-4 bg-slate-800 border-slate-700 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-2"
              />
              <label for="remember" class="ml-2 text-sm text-gray-300">
                Remember me
              </label>
            </div>
          </div>

          <!-- Sign in Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>
        </div>
      </div>
    </div>

    <!-- Right Side - Illustration -->
    <div class="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
      <div class="max-w-lg w-full">
        <!-- Mobile Login Illustration from undraw.co -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" class="w-full h-auto">
          <g id="freepik--background-simple--inject-4">
            <path d="M398.08,333.51s-49.46,59.47-130.34,76.88S102.19,429.18,64,338.51s14.77-165,87.11-196.07S295.56,96.76,349,139.38,451.6,267.09,398.08,333.51Z" style="fill:#6c63ff;opacity:0.7"/>
          </g>
          <g id="freepik--Floor--inject-4">
            <ellipse cx="250" cy="438.5" rx="193.89" ry="11.32" style="fill:#f5f5f5"/>
          </g>
          <g id="freepik--Device--inject-4">
            <rect x="178.5" y="89.98" width="143" height="283" rx="12" style="fill:#6c63ff"/>
            <rect x="185.5" y="97.98" width="129" height="267" rx="8" style="fill:#fff"/>
            <circle cx="250" cy="106.98" r="3" style="fill:#6c63ff"/>
            <line x1="238.5" y1="354.98" x2="261.5" y2="354.98" style="fill:none;stroke:#6c63ff;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px"/>

            <!-- Lock Icon -->
            <g transform="translate(230, 180)">
              <circle cx="20" cy="20" r="35" style="fill:#6c63ff;opacity:0.2"/>
              <path d="M20,25 L20,25 C16.7,25 14,22.3 14,19 L14,13 C14,9.7 16.7,7 20,7 C23.3,7 26,9.7 26,13 L26,19 C26,22.3 23.3,25 20,25 Z" style="fill:none;stroke:#6c63ff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
              <rect x="12" y="23" width="16" height="12" rx="2" style="fill:none;stroke:#6c63ff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
              <circle cx="20" cy="29" r="1.5" style="fill:#6c63ff"/>
            </g>

            <!-- Email Icon -->
            <g transform="translate(230, 250)">
              <rect x="5" y="10" width="30" height="20" rx="2" style="fill:none;stroke:#e0e0e0;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
              <path d="M5,12 L20,22 L35,12" style="fill:none;stroke:#e0e0e0;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
            </g>

            <!-- Button -->
            <rect x="198.5" y="310" width="103" height="28" rx="4" style="fill:#6c63ff"/>
            <text x="250" y="327" text-anchor="middle" style="fill:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:600">Sign In</text>
          </g>
          <g id="freepik--Character--inject-4">
            <!-- Person sitting with laptop -->
            <g transform="translate(320, 280)">
              <!-- Head -->
              <circle cx="30" cy="20" r="18" style="fill:#ffb6b6"/>
              <!-- Hair -->
              <path d="M30,2 C18,2 12,8 12,20 C12,22 13,23 15,23 C15,15 20,10 30,10 C40,10 45,15 45,23 C47,23 48,22 48,20 C48,8 42,2 30,2 Z" style="fill:#2f2e41"/>
              <!-- Body -->
              <path d="M25,38 L35,38 L38,75 L22,75 Z" style="fill:#6c63ff"/>
              <!-- Arms -->
              <path d="M25,40 L15,55 L18,57 L28,42 Z" style="fill:#ffb6b6"/>
              <path d="M35,40 L45,55 L42,57 L32,42 Z" style="fill:#ffb6b6"/>
              <!-- Laptop -->
              <rect x="8" y="55" width="44" height="2" style="fill:#3f3d56"/>
              <path d="M10,55 L50,55 L48,45 L12,45 Z" style="fill:#f5f5f5"/>
              <rect x="15" y="47" width="30" height="2" style="fill:#6c63ff"/>
            </g>
          </g>
          <!-- Decorative Elements -->
          <g id="freepik--Plants--inject-4" opacity="0.5">
            <path d="M90,400 Q85,380 90,360 Q95,380 90,400" style="fill:#6c63ff;opacity:0.3"/>
            <path d="M410,400 Q405,375 410,350 Q415,375 410,400" style="fill:#6c63ff;opacity:0.3"/>
            <ellipse cx="90" cy="402" rx="8" ry="4" style="fill:#6c63ff;opacity:0.3"/>
            <ellipse cx="410" cy="402" rx="8" ry="4" style="fill:#6c63ff;opacity:0.3"/>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/lib/axios';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const formData = ref({
  email: '',
  password: '',
  remember: false
});
const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/api/auth/login', {
      email: formData.value.email,
      password: formData.value.password,
      remember: formData.value.remember
    });

    const { access_token, refresh_token, user, expires_in } = response.data;

    // Store tokens and user info
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));

    // Store remember me preference
    localStorage.setItem('remember_me', formData.value.remember.toString());

    // Store token expiry time (current time + expires_in seconds)
    const expiryTime = Date.now() + (expires_in * 1000);
    localStorage.setItem('token_expiry', expiryTime.toString());

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    if (error.response?.data?.errors?.email) {
      errorMessage.value = error.response.data.errors.email[0];
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
