<template>
  <Navbar>
    <template #actions>
      <div class="actions">
        <span class="hello">
          Hello, <strong>{{ firstName }}</strong>
        </span>

        <v-menu location="bottom end" offset="10">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="top-icon">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>

          <v-list class="profile-menu" density="comfortable">
            <v-list-item to="/profile" rounded="xl">
              <template #prepend>
                <v-icon size="18">mdi-account</v-icon>
              </template>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>

            <v-divider class="my-2" />

            <v-list-item @click="handleLogout" rounded="xl">
              <template #prepend>
                <v-icon size="18">mdi-logout</v-icon>
              </template>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </Navbar>

  <v-navigation-drawer permanent width="292" class="sidebar" elevation="0">
    <div class="side-inner">
      <div class="today-card">
        <div class="today-icon" :class="{ night: isNight }">
          <v-icon size="22">{{ dayIcon }}</v-icon>
        </div>

        <div class="today-text">
          <div class="today-title">Today</div>

          <div class="today-meta">
            <span class="today-date">{{ dateLabel }}</span>
            <span class="dot">•</span>
            <span class="today-time">{{ timeLabel }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Workspace</div>

        <v-list nav density="comfortable" class="menu">
          <v-list-item
            v-for="i in items"
            :key="i.to"
            :to="i.to"
            class="menu-item"
            rounded="xl"
            :class="{ active: activePath === i.to }"
          >
            <template #prepend>
              <div class="icon-wrap">
                <v-icon size="20">{{ i.icon }}</v-icon>
              </div>
            </template>

            <v-list-item-title class="menu-title">{{ i.title }}</v-list-item-title>

            <template #append>
              <v-icon class="chev" size="18">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </div>

      <div class="foot">
        <Footer />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '@/services/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { auth } from '@/services/firebase'

const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  logout()
  router.push('/login')
}

const items = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
  { title: 'My plants', icon: 'mdi-sprout', to: '/plants' },
  { title: 'Care logs', icon: 'mdi-history', to: '/care-logs' },
  { title: 'Water needs', icon: 'mdi-water', to: '/needs-water' },
  { title: 'Locations', icon: 'mdi-map-marker', to: '/locations' },
]

const activePath = computed(() => route.path)

const now = ref(new Date())
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// Icon switches from sun to moon after 18:00
const isNight = computed(() => {
  const h = now.value.getHours()
  return h < 6 || h >= 18
})

const dayIcon = computed(() => (isNight.value ? 'mdi-weather-night' : 'mdi-weather-sunny'))

// display user's first name
const firstName = computed(
  () => auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'there',
)

const dateLabel = computed(() =>
  now.value.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
)

const timeLabel = computed(() =>
  now.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
)
</script>



<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-icon {
  opacity: 0.9;
}

.btn-pill {
  border-radius: 999px;
  font-weight: 800;
  letter-spacing: 0.2px;
  padding: 0 16px;
  height: 36px;
}

.btn-orange-outline {
  border: 2px solid #f27e21;
  color: #f27e21;
  background: rgba(255, 255, 255, 0.7);
}

.btn-orange-outline:hover {
  background: rgba(242, 126, 33, 0.1);
}

.sidebar {
  border-right: 1px solid rgba(20, 31, 24, 0.1);
  background: transparent;
}

:deep(.v-navigation-drawer__content) {
  padding: 0;
  height: 100%;
}

.side-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 14px 12px 12px 14px;
  background:
    radial-gradient(
      1000px 700px at 50% 80%,
      rgba(245, 200, 90, 0.2),
      /* pastel yellow */ transparent 65%
    ),
    radial-gradient(
      900px 600px at 88% 12%,
      rgba(38, 206, 105, 0.26),
      /* pastel green */ transparent 60%
    ),
    radial-gradient(
      900px 600px at 12% 8%,
      rgba(248, 66, 66, 0.418),
      /* pastel red */ transparent 60%
    ),
    linear-gradient(
      180deg,
      rgba(242, 240, 232, 0.97) 0%,
      rgba(238, 236, 220, 0.97) 5%,
      rgba(234, 232, 215, 0.97) 100%
    );
}

.today-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(20, 31, 24, 0.1);
  box-shadow: 0 18px 55px rgba(18, 23, 38, 0.08);
  backdrop-filter: blur(10px);
}

.today-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(255, 193, 7, 0.18);
  border: 1px solid rgba(255, 193, 7, 0.35);
  color: #f59e0b;
  transition: all 240ms ease;
}

.today-icon.night {
  background: rgba(99, 102, 241, 0.18);
  border-color: rgba(99, 102, 241, 0.35);
  color: #6366f1;
}

.today-text {
  line-height: 1.1;
}

.today-title {
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.2px;
  color: #121726;
}

.today-meta {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  opacity: 0.75;
  color: #2a2f3a;
}

.today-date {
  font-weight: 500;
  white-space: nowrap;
}

.today-time {
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.4px;
}

.dot {
  opacity: 0.6;
}

.section {
  margin-top: 14px;
}

.section-title {
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.7;
  padding: 8px 10px;
}

.menu {
  background: transparent;
}

.menu-item {
  margin: 8px 4px;
  padding: 10px 10px 10px 10px;
  border-radius: 18px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.66);
  backdrop-filter: blur(10px);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.menu-item:hover {
  transform: translateY(-1px);
  border-color: rgba(206, 161, 38, 0.22);
  background: rgba(255, 249, 195, 0.678);
}

.menu-item.active {
  border-color: rgba(131, 230, 74, 0.22);
  background: rgba(131, 230, 74, 0.22);
}

.icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(18, 23, 38, 0.04);
  border: 1px solid rgba(18, 23, 38, 0.08);
}

.menu-item.active .icon-wrap {
  border-color: rgba(131, 230, 74, 0.22);
  background: rgba(44, 102, 11, 0.22);
}

.menu-title {
  font-weight: 850;
  letter-spacing: 0.1px;
  color: #121726;
  padding-left: 12px;
}

.chev {
  opacity: 0.55;
}

.spacer {
  flex: 1;
}

@media (max-width: 1100px) {
  .side-inner {
    padding: 12px;
  }

  .menu-item {
    margin: 8px 2px;
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hello {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.85;
  white-space: nowrap;
}
.profile-menu {
  border-radius: 16px;
  padding: 6px;
  min-width: 180px;
}
</style>
