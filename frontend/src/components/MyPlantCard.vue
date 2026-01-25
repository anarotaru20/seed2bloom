<template>
  <v-card class="card" rounded="2xl" elevation="0">
    <div class="top">
      <div class="pic">
        <img v-if="plant.photoUrl" :src="plant.photoUrl" alt="plant" class="img" />
        <v-icon v-else size="26">mdi-image-outline</v-icon>
      </div>

      <div class="chips" v-if="chips.length">
        <v-chip
          v-for="c in chips"
          :key="c.key"
          class="chip"
          size="small"
          label
          rounded="xl"
          variant="tonal"
          :color="c.color"
        >
          <v-icon start size="16">{{ c.icon }}</v-icon>
          {{ c.label }}
        </v-chip>

        <v-menu v-model="tagsMenu" location="bottom end" offset="10" v-if="moreTagsCount > 0">
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              class="chip chip-more"
              size="small"
              label
              rounded="xl"
              variant="tonal"
            >
              <v-icon start size="16">mdi-dots-horizontal</v-icon>
              +{{ moreTagsCount }}
            </v-chip>
          </template>

          <v-card rounded="xl" class="menu-card">
            <div class="menu-title">All tags</div>
            <div class="menu-tags">
              <v-chip
                v-for="t in allTags"
                :key="t"
                class="chip"
                size="small"
                label
                rounded="xl"
                variant="tonal"
              >
                <v-icon start size="16">mdi-tag</v-icon>
                {{ t }}
              </v-chip>
            </div>
          </v-card>
        </v-menu>
      </div>
    </div>

    <div class="body">
      <div class="name">{{ plant.name }}</div>

      <div class="meta">
        <span class="meta-item">
          <v-icon size="16">mdi-map-marker</v-icon>
          {{ plant.location }}
        </span>
        <span class="dot">•</span>
        <span class="meta-item">
          <v-icon size="16">mdi-calendar-clock</v-icon>
          Every {{ plant.waterEveryDays }} days
        </span>
      </div>

      <div class="note">
        {{ plant.note?.trim() ? plant.note : 'No description' }}
      </div>

      <div class="actions">
        <v-btn rounded="xl" variant="outlined" class="btn btn-edit" @click.stop="emit('edit', plant)">
          <v-icon start>mdi-pencil</v-icon>
          Edit
        </v-btn>

        <v-btn
          rounded="xl"
          variant="outlined"
          class="btn btn-danger"
          color="red"
          @click.stop="emit('delete', plant)"
        >
          <v-icon start>mdi-delete</v-icon>
          Delete
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  plant: { type: Object, required: true },
})
const emit = defineEmits(['edit', 'delete'])

const tagsMenu = ref(false)

const SAFE = new Set([
  'spider plant',
  'areca palm',
  'parlor palm',
  'boston fern',
  'calathea',
  'prayer plant',
])

const UNSAFE = new Set([
  'peace lily',
  'pothos',
  'monstera',
  'snake plant',
  'zz plant',
  'rubber plant',
  'croton',
  'yucca',
  'fiddle leaf fig',
])

const norm = (s) => String(s || '').trim().toLowerCase()

const toBool = (v) => {
  if (v === true) return true
  if (v === false) return false
  if (v === 1 || v === '1') return true
  if (v === 0 || v === '0') return false
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    if (['true', 'yes', 'y'].includes(s)) return true
    if (['false', 'no', 'n'].includes(s)) return false
  }
  return null
}

const derivePetSafe = (name) => {
  const n = norm(name)
  if (!n) return null
  if (SAFE.has(n)) return true
  if (UNSAFE.has(n)) return false
  return null
}

const resolvedPetSafe = computed(() => {
  const p = props.plant || {}
  const direct =
    toBool(p.petSafe) ??
    toBool(p.pet_safe) ??
    toBool(p.isPetSafe) ??
    toBool(p.is_pet_safe) ??
    null
  if (direct !== null) return direct
  return derivePetSafe(p.commonName) ?? derivePetSafe(p.name) ?? derivePetSafe(p.species) ?? null
})

const allTags = computed(() => {
  const p = props.plant || {}
  return Array.isArray(p.tags) ? p.tags.map((x) => String(x)) : []
})

const shownTags = computed(() => allTags.value.slice(0, 2))
const moreTagsCount = computed(() => Math.max(0, allTags.value.length - shownTags.value.length))

const chips = computed(() => {
  const p = props.plant || {}
  const out = []

  if (resolvedPetSafe.value !== null) {
    out.push({
      key: 'petSafe',
      label: resolvedPetSafe.value ? 'Pet safe' : 'Not pet safe',
      icon: resolvedPetSafe.value ? 'mdi-paw' : 'mdi-paw-off',
      color: resolvedPetSafe.value ? '#FBBF24' : 'red',
    })
  }

  if (p.species) {
    out.push({ key: 'species', label: p.species, icon: 'mdi-leaf', color: 'green' })
  }

  shownTags.value.forEach((t, i) => {
    out.push({ key: `tag-${i}-${t}`, label: t, icon: 'mdi-tag', color: 'grey' })
  })

  return out.slice(0, 5)
})
</script>

<style scoped>
.card {
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.top {
  padding: 14px 14px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.pic {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(18, 23, 38, 0.04);
  border: 1px solid rgba(18, 23, 38, 0.08);
  overflow: hidden;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  max-width: 70%;
}

.chip {
  border: 1px solid rgba(20, 31, 24, 0.08);
  font-weight: 850;
}

.chip-more {
  cursor: pointer;
}

.menu-card {
  padding: 12px;
  min-width: 260px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
}

.menu-title {
  font-weight: 950;
  letter-spacing: -0.2px;
  margin-bottom: 10px;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.body {
  padding: 14px 14px 16px;
}

.name {
  font-weight: 950;
  font-size: 1.05rem;
  letter-spacing: -0.2px;
}

.meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.75;
  font-weight: 750;
  font-size: 0.86rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dot {
  opacity: 0.5;
}

.note {
  margin-top: 10px;
  font-size: 0.88rem;
  opacity: 0.75;
  font-weight: 600;
  font-style: italic;
}

.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  font-weight: 900;
}

.btn-danger {
  border-color: rgba(239, 68, 68, 0.35);
}

.btn-edit {
  color: #2563eb;
}
</style>
