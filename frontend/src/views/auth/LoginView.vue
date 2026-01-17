<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const message = ref('')
const loading = ref(false)

const canSubmit = computed(() => {
  return email.value.trim().length > 0 && password.value.length > 0 && !loading.value
})

const handleLogin = async () => {
  message.value = ''
  loading.value = true

  try {
    await auth.login(email.value.trim(), password.value)
    router.push('/plants')
  } catch (e) {
    message.value = e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid class="auth">
    <Navbar>
      <template #actions>
        <div class="actions">
          <v-btn variant="outlined" class="btn-pill btn-orange-outline" to="/"> Explore </v-btn>
        </div>
      </template>
    </Navbar>

    <v-row class="auth-row" align="center" justify="center">
      <v-col cols="12" md="6" class="d-none d-md-block">
        <div class="left">
          <v-img src="/logo_img.png" max-width="320" class="logo mb-6" />

          <div class="title">
            Welcome back to <span class="green">Seed</span><span class="dot">2</span
            ><span class="orange">Bloom</span>.
          </div>

          <div class="subtitle">
            Log in to track watering, light, and care notes — and keep your plant routine calm and
            consistent.
          </div>

          <div class="badges mt-6">
            <div class="badge chip-green" style="animation-delay: 240ms">
              <v-icon size="18" class="mr-2">mdi-sprout</v-icon>
              Plant tracking
            </div>
            <div class="badge chip-orange" style="animation-delay: 360ms">
              <v-icon size="18" class="mr-2">mdi-water</v-icon>
              Watering routine
            </div>
            <div class="badge chip-red" style="animation-delay: 480ms">
              <v-icon size="18" class="mr-2">mdi-weather-sunny</v-icon>
              Light & placement
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="10" md="6" lg="5" class="right-col">
        <v-card class="card" elevation="4">
          <div class="top">
            <v-avatar size="58" color="green" variant="tonal" class="mb-3">
              <v-icon size="28">mdi-lock-outline</v-icon>
            </v-avatar>

            <div class="card-title">Login</div>
            <div class="card-subtitle">Continue your plant care journey.</div>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              rounded="lg"
              class="mb-3"
              autocomplete="email"
            />

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              autocomplete="current-password"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="showPassword = !showPassword"
            />

            <v-btn
              type="submit"
              size="large"
              block
              rounded="lg"
              class="btn-pill btn-green cta"
              :loading="loading"
              :disabled="!canSubmit"
            >
              Login
            </v-btn>

            <v-alert v-if="message" class="mt-4" variant="tonal" type="error" rounded="lg">
              {{ message }}
            </v-alert>
          </v-form>

          <div class="bottom text-center mt-6">
            <span class="text-medium-emphasis">New to the jungle?</span>
            <RouterLink to="/register" class="link-strong link-yellow">
              Create your account
            </RouterLink>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  background:
    radial-gradient(1200px 700px at 12% 20%, rgba(76, 175, 80, 0.14), transparent 55%),
    radial-gradient(1100px 600px at 88% 22%, rgba(255, 152, 0, 0.16), transparent 58%), #fff;
}

.auth-row {
  min-height: calc(100vh - 128px);
  max-width: 1280px;
  margin: 0 auto;
}

.right-col {
  padding-left: 18px;
  padding-right: 18px;
}

.left {
  max-width: 560px;
  padding-left: 18px;
  animation: fadeUp 650ms ease both;
}

.title {
  font-size: 2.1rem;
  font-weight: 900;
  line-height: 1.05;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-pill {
  border-radius: 999px;
  text-transform: none;
  font-weight: 850;
  letter-spacing: 0.2px;
}

.btn-green {
  background: #2e7d32;
  color: #fff;
  box-shadow: 0 12px 26px rgba(46, 125, 50, 0.22);
}

.btn-green:hover {
  filter: brightness(1.02);
}

.btn-orange-outline {
  border: 2px solid #fb8c00;
  color: #fb8c00;
}

.btn-orange-outline:hover {
  background: rgba(251, 140, 0, 0.1);
}

.subtitle {
  margin-top: 12px;
  font-size: 1.05rem;
  opacity: 0.88;
  max-width: 520px;
}

.green {
  color: #2e7d32;
}

.orange {
  color: #fb8c00;
}

.dot {
  color: #e53935;
  font-weight: 900;
}

.badges {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
}

.badge {
  justify-content: center;
  padding: 10px 12px;
  font-size: 1rem;
  white-space: nowrap;
  border-radius: 16px;
  font-weight: 700;
  opacity: 0;
  animation:
    fadeUp 650ms ease both,
    floatSoft 3.6s ease-in-out infinite;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSoft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

.card {
  border-radius: 24px;
  padding: 34px 36px;
  min-height: 430px;
  margin-top: 18px;
}

.top {
  text-align: center;
  margin-bottom: 14px;
}

.card-title {
  font-size: 1.55rem;
  font-weight: 900;
}

.card-subtitle {
  font-size: 0.95rem;
  opacity: 0.75;
}

.cta {
  animation: pulse 2.8s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.bottom {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.link-strong {
  text-decoration: none;
  font-weight: 900;
  color: #2e7d32;
}

.link-yellow {
  color: #fb8c00;
}

.link-yellow:hover {
  text-decoration: underline;
}

.chip-green {
  background: rgba(46, 125, 50, 0.14);
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.chip-orange {
  background: rgba(251, 140, 0, 0.16);
  color: #fb8c00;
  border: 1px solid rgba(251, 140, 0, 0.2);
}

.chip-red {
  background: rgba(229, 57, 53, 0.14);
  color: #e53935;
  border: 1px solid rgba(229, 57, 53, 0.18);
}
</style>
