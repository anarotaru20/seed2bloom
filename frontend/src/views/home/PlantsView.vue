<script setup>
import { computed, ref } from 'vue'
import MyPlantCard from '@/components/MyPlantCard.vue'
import PlantDetailsDialog from '@/components/dialog/PlantDetailsDialog.vue'
import PlantCatalogDialog from '@/components/dialog/PlantCatalogDialog.vue'

const q = ref('')
const status = ref('all')
const location = ref('all')
// dialog for adding new plant
const addDialog = ref(false)
// searched/filtered plants
const search = ref('')
const activeTag = ref('all')
const tags = [
  { title: 'All', value: 'all' },
  { title: 'Indoor', value: 'indoor' },
  { title: 'Outdoor', value: 'outdoor' },
  { title: 'Exotic', value: 'exotic' },
  { title: 'Easy', value: 'easy' },
  { title: 'Pet-safe', value: 'petSafe' },
]
// mock plant data
const plantTemplates = ref([
  {
    id: 't1',
    commonName: 'Monstera',
    scientificName: 'Monstera deliciosa',
    tags: ['indoor', 'exotic'],
    light: 'bright',
    water: 'medium',
    petSafe: false,
  },
  {
    id: 't2',
    commonName: 'Pothos',
    scientificName: 'Epipremnum aureum',
    tags: ['indoor', 'easy'],
    light: 'medium',
    water: 'medium',
    petSafe: false,
  },
  {
    id: 't3',
    commonName: 'Snake Plant',
    scientificName: 'Sansevieria',
    tags: ['indoor', 'easy'],
    light: 'low',
    water: 'low',
    petSafe: false,
  },
  {
    id: 't4',
    commonName: 'ZZ Plant',
    scientificName: 'Zamioculcas',
    tags: ['indoor', 'easy'],
    light: 'low',
    water: 'low',
    petSafe: false,
  },
  {
    id: 't5',
    commonName: 'Lavender',
    scientificName: 'Lavandula',
    tags: ['outdoor'],
    light: 'bright',
    water: 'low',
    petSafe: true,
  },
  {
    id: 't6',
    commonName: 'Basil',
    scientificName: 'Ocimum basilicum',
    tags: ['outdoor'],
    light: 'bright',
    water: 'high',
    petSafe: true,
  },
  {
    id: 't7',
    commonName: 'Calathea',
    scientificName: 'Calathea orbifolia',
    tags: ['indoor', 'exotic'],
    light: 'medium',
    water: 'high',
    petSafe: true,
  },
  {
    id: 't8',
    commonName: 'Aloe',
    scientificName: 'Aloe vera',
    tags: ['indoor', 'easy'],
    light: 'bright',
    water: 'low',
    petSafe: false,
  },
])

//plant details
const detailsDialog = ref(false)
const selectedTemplate = ref(null)

const form = ref({
  location: '',
  waterEveryDays: 3,
  notes: '',
})

const locationItems = ['Living', 'Balcony', 'Kitchen', 'Bedroom']

const openDetails = (tpl) => {
  selectedTemplate.value = tpl
  form.value = {
    location: '',
    waterEveryDays: 3,
    notes: '',
  }
  addDialog.value = false
  detailsDialog.value = true
}

const closeDetails = () => {
  detailsDialog.value = false
  selectedTemplate.value = null
}

const saveNewPlant = () => {
  detailsDialog.value = false
  selectedTemplate.value = null
}

const backToCatalog = () => {
  detailsDialog.value = false
  addDialog.value = true
}

// my plants page
const filteredTemplates = computed(() => {
  const term = search.value.trim().toLowerCase()
  const tag = activeTag.value

  return plantTemplates.value.filter((p) => {
    const matchesText =
      !term ||
      p.commonName.toLowerCase().includes(term) ||
      (p.scientificName || '').toLowerCase().includes(term)

    const matchesTag = tag === 'all' || (tag === 'petSafe' ? p.petSafe : p.tags.includes(tag))

    return matchesText && matchesTag
  })
})

const iconByLight = (l) =>
  l === 'low'
    ? 'mdi-weather-night'
    : l === 'medium'
      ? 'mdi-weather-partly-cloudy'
      : 'mdi-weather-sunny'
const iconByWater = (w) =>
  w === 'low' ? 'mdi-water-outline' : w === 'medium' ? 'mdi-water' : 'mdi-water-plus'

const pickTemplate = (p) => {
  addDialog.value = false
}

const plants = ref([
  {
    id: 'p1',
    name: 'Monstera',
    location: 'Living',
    waterEveryDays: 3,
    status: 'needs',
    note: 'Big leaves, likes bright light.',
    photoUrl: '',
  },
  {
    id: 'p2',
    name: 'Pothos',
    location: 'Balcony',
    waterEveryDays: 5,
    status: 'due',
    note: 'Fast grower.',
  },
  { id: 'p3', name: 'Ficus', location: 'Kitchen', waterEveryDays: 7, status: 'ok', note: 'lala' },
  {
    id: 'p4',
    name: 'Aloe',
    location: 'Bedroom',
    waterEveryDays: 10,
    status: 'ok',
    note: 'Low maintenance.',
  },
])

const locations = computed(() => [
  'all',
  ...Array.from(new Set(plants.value.map((p) => p.location))),
])

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return plants.value.filter((p) => {
    const matchesQ =
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.location || '').toLowerCase().includes(term)
    const matchesStatus = status.value === 'all' || p.status === status.value
    const matchesLoc = location.value === 'all' || p.location === location.value
    return matchesQ && matchesStatus && matchesLoc
  })
})

// edit plants
const editDialog = ref(false)
const selectedPlant = ref(null)

const editForm = ref({
  location: '',
  waterEveryDays: 3,
  notes: '',
  photoUrl: '',
})

const openEdit = (p) => {
  selectedPlant.value = p
  editForm.value = {
    location: p.location || '',
    waterEveryDays: p.waterEveryDays ?? 3,
    notes: p.note || '',
    photoUrl: p.photoUrl || '',
  }

  editDialog.value = true
}

const saveEdit = () => {
  if (!selectedPlant.value) return
  const idx = plants.value.findIndex((x) => x.id === selectedPlant.value.id)
  if (idx === -1) return

  plants.value[idx] = {
    ...plants.value[idx],
    location: editForm.value.location,
    waterEveryDays: Number(editForm.value.waterEveryDays) || plants.value[idx].waterEveryDays,
    note: editForm.value.notes,
    photoUrl: editForm.value.photoUrl,
  }

  editDialog.value = false
  selectedPlant.value = null
}
</script>

<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">My plants</div>
        <div class="sub">All your plants in one place</div>
      </div>

      <v-btn rounded="xl" variant="outlined" class="add" @click="addDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Add plant
      </v-btn>
    </div>

    <div class="controls">
      <v-text-field
        v-model="q"
        placeholder="Search plants..."
        variant="outlined"
        density="comfortable"
        rounded="xl"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search"
      />

      <v-select
        v-model="status"
        :items="[
          { title: 'All', value: 'all' },
          { title: 'OK', value: 'ok' },
          { title: 'Due soon', value: 'due' },
          { title: 'Needs water', value: 'needs' },
        ]"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        rounded="xl"
        hide-details
        class="sel"
        label="Status"
      />

      <v-select
        v-model="location"
        :items="locations"
        variant="outlined"
        density="comfortable"
        rounded="xl"
        hide-details
        class="sel"
        label="Location"
      />
    </div>

    <!-- DIALOG FOR CATALOG - ADD PLANTS -->
    <PlantCatalogDialog
      v-model="addDialog"
      v-model:search="search"
      v-model:activeTag="activeTag"
      @select="openDetails"
    />

    <PlantDetailsDialog
      v-model="editDialog"
      :mode="'edit'"
      :plant="selectedPlant"
      :form="editForm"
      :locations="locationItems"
      @update:form="editForm = $event"
      @back="editDialog = false"
      @save="saveEdit"
    />

    <!-- PLANT DETAILS -->
    <PlantDetailsDialog
      v-model="detailsDialog"
      :plant="selectedTemplate"
      :form="form"
      :locations="locationItems"
      @update:form="form = $event"
      @back="backToCatalog"
      @save="saveNewPlant"
    />

    <!-- PLANT CARDS -->
    <v-row dense class="grid-my-plants" style="row-gap: 12px">
      <v-col v-for="p in filtered" :key="p.id" cols="12" sm="6" md="4" lg="4">
        <MyPlantCard :plant="p" @edit="openEdit" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.page {
  padding-top: 6px;
}

.hdr {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.3px;
}

.sub {
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 700;
}

.add {
  font-weight: 900;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 220px 220px;
  gap: 12px;
  margin-bottom: 14px;
}

.search,
.sel {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 18px;
}

.grid-my-plants {
  margin-top: 2px;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
