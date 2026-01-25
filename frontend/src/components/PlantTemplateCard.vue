<template>
  <v-card class="card" rounded="2xl" elevation="0">
    <div class="top">
      <div class="pic">
        <v-icon size="22">mdi-sprout</v-icon>
      </div>

      <div class="top-chips">
        <v-chip
          v-if="plant.light"
          class="mini"
          rounded="xl"
          variant="flat"
          :style="miniStyle('light', plant.light)"
        >
          <v-icon start size="16">{{ lightIcon(plant.light) }}</v-icon>
          {{ plant.light }}
        </v-chip>

        <v-chip
          v-if="plant.water"
          class="mini"
          rounded="xl"
          variant="flat"
          :style="miniStyle('water', plant.water)"
        >
          <v-icon start size="16">{{ waterIcon(plant.water) }}</v-icon>
          {{ plant.water }}
        </v-chip>
      </div>
    </div>

    <div class="body">
      <div class="name">{{ plant.commonName || plant.name }}</div>
      <div class="sub">{{ plant.scientificName || plant.species }}</div>

      <div class="tags">
        <v-chip
          v-if="plant.petSafe"
          class="tag"
          rounded="xl"
          variant="flat"
          :style="chipStyle('petSafe')"
        >
          <v-icon start size="16">mdi-paw</v-icon>
          pet-safe
        </v-chip>

        <v-chip
          v-for="t in (plant.tags || []).slice(0, 3)"
          :key="t"
          class="tag"
          rounded="xl"
          variant="flat"
          :style="chipStyle(t)"
        >
          <v-icon start size="16">{{ tagIcon(t) }}</v-icon>
          {{ cap(t) }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  plant: {
    type: Object,
    required: true,
  },
})

const lightIcon = (v) =>
  v === 'low'
    ? 'mdi-weather-night'
    : v === 'medium'
      ? 'mdi-weather-partly-cloudy'
      : 'mdi-weather-sunny'

const waterIcon = (v) =>
  v === 'low' ? 'mdi-water-outline' : v === 'medium' ? 'mdi-water' : 'mdi-water-plus'

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

const tagIcon = (v) => {
  const s = String(v)
  const rules = [
    { k: ['low-light', 'shade', 'low'], ic: 'mdi-weather-night' },
    { k: ['medium-light', 'medium'], ic: 'mdi-weather-partly-cloudy' },
    { k: ['bright', 'sun', 'full-sun'], ic: 'mdi-weather-sunny' },
    { k: ['tropical', 'humid'], ic: 'mdi-palm-tree' },
    { k: ['succulent', 'cactus', 'drought'], ic: 'mdi-cactus' },
    { k: ['flower', 'bloom'], ic: 'mdi-flower-outline' },
    { k: ['herb', 'edible'], ic: 'mdi-leaf' },
    { k: ['air', 'purify'], ic: 'mdi-air-filter' },
    { k: ['fast', 'rapid'], ic: 'mdi-run-fast' },
    { k: ['slow', 'slow-growth'], ic: 'mdi-timer-sand' },
    { k: ['easy', 'beginner'], ic: 'mdi-thumb-up-outline' },
    { k: ['rare', 'exotic'], ic: 'mdi-diamond-stone' },
    { k: ['climbing', 'vine'], ic: 'mdi-vector-curve' },
    { k: ['hanging'], ic: 'mdi-ceiling-light' },
    { k: ['indoor'], ic: 'mdi-home-outline' },
    { k: ['outdoor'], ic: 'mdi-forest-outline' },
    { k: ['decor', 'decorative'], ic: 'mdi-palette-outline' },
    { k: ['water', 'thirsty'], ic: 'mdi-water-outline' },
    { k: ['pet', 'safe'], ic: 'mdi-paw' },
  ]
  for (const r of rules) if (r.k.some((kw) => s.includes(kw))) return r.ic
  return 'mdi-tag-outline'
}

const hashHue = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h % 360
}

const chipStyle = (v) => {
  return {
    background: 'rgba(15, 23, 42, 0.035)',
    borderColor: 'rgba(15, 23, 42, 0.08)',
    color: 'rgba(15, 23, 42, 0.85)',
  }
}

const miniStyle = (type, v) => {
  const key = `${type}:${String(v)}`
  const hue = hashHue(key)
  const bg = `hsla(${hue}, 78%, 62%, 0.16)`
  const br = `hsla(${hue}, 78%, 52%, 0.28)`
  const tx = `hsla(${hue}, 40%, 22%, 0.96)`

  return { background: bg, borderColor: br, color: tx }
}
</script>

<style scoped>
.card {
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.card:hover {
  transform: translateY(-1px);
  border-color: rgba(46, 125, 50, 0.22);
  box-shadow: 0 18px 55px rgba(18, 23, 38, 0.08);
}

.top {
  padding: 14px 14px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.pic {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.top-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.mini {
  font-weight: 900;
  font-size: 0.78rem;
  border: 1px solid rgba(20, 31, 24, 0.08);
  opacity: 0.92;
}

.body {
  padding: 12px 14px 14px;
}

.name {
  font-weight: 950;
  font-size: 1.05rem;
  letter-spacing: -0.2px;
}

.sub {
  margin-top: 2px;
  font-size: 0.88rem;
  opacity: 0.7;
  font-weight: 650;
}

.tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
}

.tag {
  font-weight: 800;
  font-size: 0.72rem;
  padding: 2px 8px;
  height: 22px;
  line-height: 1;
  border-radius: 999px;
  border: 1px solid rgba(18, 23, 38, 0.08);
  opacity: 0.95;
}

.tag :deep(.v-icon) {
  font-size: 14px;
}

</style>
