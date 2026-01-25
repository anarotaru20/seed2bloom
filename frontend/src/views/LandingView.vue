<template>
  <v-container fluid class="landing">
    <Navbar>
      <template #actions>
        <div class="actions">
          <v-btn variant="outlined" class="btn-pill btn-orange-outline" to="/login"> Login </v-btn>
          <v-btn class="btn-pill btn-green" to="/register"> Register </v-btn>
        </div>
      </template>
    </Navbar>

    <v-container class="content">
      <v-row class="hero-row" align="center" no-gutters>
        <v-col cols="12" md="6" class="text-col">
          <div class="hero">
            <div class="pill">Your plant corner, thriving.</div>

            <h1 class="hero-title">Care, track, and grow your plants — in one calm place.</h1>

            <p class="hero-subtitle">
              Seed2Bloom helps you remember watering, track progress, and build a simple routine - so
              your plants stay happy.
            </p>

            <div class="cta">
              <v-btn size="large" class="btn-pill btn-green" to="/register"> Start free </v-btn>
              <v-btn
                size="large"
                variant="outlined"
                class="btn-pill btn-orange-outline"
                to="/login"
              >
                I already have an account
              </v-btn>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="image-col">
          <v-img src="/landing.png" class="illustration" contain eager />
        </v-col>
      </v-row>

      <div class="bottom-band">
        <AutoCardCarousel
          title="How it works"
          :items="carouselItems"
          numbered
          :interval-ms="3200"
        />
      </div>
    </v-container>

    <Footer />
  </v-container>
</template>

<script setup>
import AutoCardCarousel from '../components/AutoCardCarousel.vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const carouselItems = [
  {
    icon: 'mdi-sprout',
    title: 'Track your plants',
    text: 'Keep a simple log of care, growth, and notes for each plant.',
  },
  {
    icon: 'mdi-water',
    title: 'Watering reminders',
    text: 'Stay consistent with watering schedules without overdoing it.',
  },
  {
    icon: 'mdi-weather-sunny',
    title: 'Light & placement',
    text: 'Remember the best spot for each plant based on light needs.',
  },
  {
    icon: 'mdi-leaf',
    title: 'Care',
    text: 'Keep track of how you care for your plants',
  },
]
</script>

<style scoped>
:global(html),
:global(body),
:global(#app),
:global(.v-application) {
  height: 100%;
  overflow: hidden;
}

.landing {
  --appbar-h: 64px;
  --footer-h: 34px;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(1200px 700px at 12% 20%, rgba(76, 175, 80, 0.14), transparent 55%),
    radial-gradient(1100px 600px at 88% 22%, rgba(255, 152, 0, 0.16), transparent 58%), #fff;
}

:deep(.landing.v-container) {
  padding: 0 !important;
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

.btn-orange-outline {
  border: 2px solid #fb8c00;
  color: #fb8c00;
}

.btn-orange-outline:hover {
  background: rgba(251, 140, 0, 0.1);
}

.content {
  max-width: 1440px;
  height: calc(100dvh - var(--appbar-h));
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 20px;
  padding-bottom: calc(var(--footer-h) + 10px);
}

.hero-row {
  flex: 1 1 auto;
  min-height: 0;
  align-content: center;
}

.text-col {
  display: flex;
  align-items: center;
  min-height: 0;
}

.hero {
  max-width: 640px;
  animation: fadeUp 600ms ease both;
}

.pill {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-weight: 800;
  font-size: 0.9rem;
  width: fit-content;
}

.hero-title {
  margin-top: 18px;
  font-size: clamp(2.1rem, 4vw, 3.2rem);
  font-weight: 950;
  line-height: 1.04;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin-top: 14px;
  font-size: 1.05rem;
  opacity: 0.82;
  max-width: 560px;
}

.cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.image-col {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 0;
}

.illustration {
  width: 100%;
  max-width: 620px;
  max-height: 100%;
  filter: drop-shadow(0 22px 44px rgba(0, 0, 0, 0.12));
  animation: floatSoft 4.5s ease-in-out infinite;
}

.bottom-band {
  flex: 0 0 auto;
  padding: 10px 0 6px;
  overflow: hidden;
  min-height: 0;
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
    transform: translateY(-6px);
  }
}
</style>
