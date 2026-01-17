<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const auth = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const day = ref(null)
const month = ref(null)
const year = ref(null)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const monthIndex = computed(() => months.indexOf(month.value))

const birthDateIso = computed(() => {
  if (!day.value || monthIndex.value < 0 || !year.value) return null
  const mm = String(monthIndex.value + 1).padStart(2, '0')
  const dd = String(day.value).padStart(2, '0')
  return `${year.value}-${mm}-${dd}`
})

const canSubmit = computed(() => {
  return (
    email.value.trim().length > 0 &&
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    !loading.value
  )
})

const handleRegister = async () => {
  message.value = ''
  loading.value = true

  try {
    if (password.value !== confirmPassword.value) {
      message.value = 'Passwords do not match'
      return
    }

    const profile = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      birthDate: birthDateIso.value,
    }

    await auth.register(email.value.trim(), password.value, profile)
    router.push('/plants')
  } catch (e) {
    message.value = e?.message || 'Register failed'
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

    <v-row class="auth-row row-gap" align="center" justify="center">
      <v-col cols="12" sm="10" md="5" lg="4">
        <v-card class="card" elevation="4">
          <div class="top">
            <v-avatar size="58" color="green" variant="tonal" class="mb-3">
              <v-icon size="28">mdi-account-plus-outline</v-icon>
            </v-avatar>

            <div class="card-title">Create account</div>
            <div class="card-subtitle">Start your plant care space in seconds.</div>
          </div>

          <v-form @submit.prevent="handleRegister">
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="firstName"
                  label="First name"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="lastName"
                  label="Last name"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
            </v-row>

            <v-row dense class="mb-2">
              <v-col cols="4">
                <v-select
                  v-model="day"
                  label="Day"
                  :items="Array.from({ length: 31 }, (_, i) => i + 1)"
                  prepend-inner-icon="mdi-calendar-blank"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>

              <v-col cols="4">
                <v-select
                  v-model="month"
                  label="Month"
                  :items="months"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>

              <v-col cols="4">
                <v-select
                  v-model="year"
                  label="Year"
                  :items="Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i)"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              rounded="lg"
              class="mb-3"
              autocomplete="email"
            />

            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  rounded="lg"
                  autocomplete="new-password"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  variant="outlined"
                  rounded="lg"
                  autocomplete="new-password"
                />
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              size="large"
              block
              rounded="lg"
              class="btn-pill btn-green cta mt-4"
              :loading="loading"
              :disabled="!canSubmit"
            >
              Start growing
            </v-btn>

            <v-alert v-if="message" class="mt-4" variant="tonal" type="error" rounded="lg">
              {{ message }}
            </v-alert>
          </v-form>

          <div class="bottom text-center mt-5">
            <span>Already part of the greenhouse?</span>
            <RouterLink to="/login" class="link-strong link-yellow">Sign in</RouterLink>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="d-none d-md-block">
        <div class="right">
          <v-img src="/logo_img.png" max-width="320" class="logo mb-6" />

          <div class="title">
            Create your <span class="green">Seed</span><span class="dot">2</span
            ><span class="orange">Bloom</span>
            account.
          </div>

          <div class="subtitle">Track watering, light, and care notes. Keep every plant happy.</div>

          <div class="badges mt-6">
            <div class="badge chip-green">
              <v-icon size="18">mdi-sprout</v-icon>
              Plant profiles
            </div>
            <div class="badge chip-orange">
              <v-icon size="18">mdi-water</v-icon>
              Watering routine
            </div>
            <div class="badge chip-red">
              <v-icon size="18">mdi-weather-sunny</v-icon>
              Light & placement
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  padding: 64px 24px;
  background:
    radial-gradient(1200px 600px at 18% 0%, rgba(76, 175, 80, 0.12) 0%, transparent 58%),
    radial-gradient(1000px 520px at 82% 16%, rgba(251, 140, 0, 0.12) 0%, transparent 55%),
    radial-gradient(900px 520px at 60% 40%, rgba(229, 57, 53, 0.07) 0%, transparent 60%),
    linear-gradient(180deg, #ffffff, #ffffff);
}

.auth-row {
  min-height: calc(100vh - 180px);
}

.row-gap {
  column-gap: 28px;
}

.card {
  border-radius: 22px;
  padding: 34px 36px;
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

.right {
  max-width: 560px;
  text-align: right;
}

.right .logo {
  margin-left: auto;
}

.title {
  font-size: 2.1rem;
  font-weight: 900;
  line-height: 1.05;
}

.subtitle {
  margin-top: 12px;
  font-size: 1.05rem;
  opacity: 0.88;
  max-width: 520px;
  margin-left: auto;
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
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  font-weight: 700;
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
</style>
