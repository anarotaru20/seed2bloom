<script setup>
import { computed, ref, onMounted } from 'vue'
import MyPlantCard from '@/components/MyPlantCard.vue'
import PlantDetailsDialog from '@/components/dialog/PlantDetailsDialog.vue'
import PlantCatalogDialog from '@/components/dialog/PlantCatalogDialog.vue'
import { usePlantsStore } from '@/stores/plants'

const plantsStore = usePlantsStore()

const q = ref('')
const status = ref('all')
const location = ref('all')

const addDialog = ref(false)
const detailsDialog = ref(false)
const selectedTemplate = ref(null)

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

const form = ref({
  location: '',
  waterEveryDays: 3,
  notes: '',
})

const locationItems = ['Living', 'Balcony', 'Kitchen', 'Bedroom']

onMounted(() => {
  plantsStore.fetchPlants()
})

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

const backToCatalog = () => {
  detailsDialog.value = false
  addDialog.value = true
}

const saveNewPlant = async () => {
  if (!selectedTemplate.value) return
  await plantsStore.addPlant({
    templateId: selectedTemplate.value.id,
    location: form.value.location,
    waterEveryDays: Number(form.value.waterEveryDays),
    notes: form.value.notes,
  })
  detailsDialog.value = false
  selectedTemplate.value = null
}

const locations = computed(() => {
  const locs = plantsStore.plants.map((p) => p?.settings?.location).filter(Boolean)
  return ['all', ...Array.from(new Set(locs))]
})

const normalizedPlants = computed(() =>
  (plantsStore.plants || []).map((p) => ({
    id: p.id,
    name: p?.template?.commonName || 'Plant',
    location: p?.settings?.location || '',
    waterEveryDays: p?.settings?.waterEveryDays ?? 0,
    note: p?.settings?.notes || '',
    photoUrl: p?.template?.imageUrl || '',
    status: 'ok',
    _raw: p,
  })),
)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return normalizedPlants.value.filter((p) => {
    const matchesQ =
      !term || p.name.toLowerCase().includes(term) || (p.location || '').toLowerCase().includes(term)
    const matchesStatus = status.value === 'all' || p.status === status.value
    const matchesLoc = location.value === 'all' || p.location === location.value
    return matchesQ && matchesStatus && matchesLoc
  })
})

const editDialog = ref(false)
const selectedPlant = ref(null)
const editSaving = ref(false)

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

const saveEdit = async () => {
  if (!selectedPlant.value) return
  editSaving.value = true
  try {
    await plantsStore.updatePlant(selectedPlant.value.id, {
      location: editForm.value.location,
      waterEveryDays: Number(editForm.value.waterEveryDays),
      notes: editForm.value.notes,
    })
    editDialog.value = false
    selectedPlant.value = null
  } finally {
    editSaving.value = false
  }
}

const deleteDialog = ref(false)
const plantToDelete = ref(null)
const deleteLoading = ref(false)

const openDelete = (p) => {
  plantToDelete.value = p
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!plantToDelete.value) return
  deleteLoading.value = true
  try {
    await plantsStore.deletePlant(plantToDelete.value.id)
    deleteDialog.value = false
    plantToDelete.value = null
  } finally {
    deleteLoading.value = false
  }
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

    <div v-if="plantsStore.loading" class="state">Loading...</div>
    <div v-else-if="plantsStore.error" class="state error">{{ plantsStore.error }}</div>
    <div v-else-if="filtered.length === 0" class="state">No plants yet. Add your first one 🌱</div>

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
      :saving="editSaving"
      @update:form="editForm = $event"
      @back="editDialog = false"
      @save="saveEdit"
    />

    <PlantDetailsDialog
      v-model="detailsDialog"
      :plant="selectedTemplate"
      :form="form"
      :locations="locationItems"
      @update:form="form = $event"
      @back="backToCatalog"
      @save="saveNewPlant"
    />

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="2xl">
        <v-card-title class="font-weight-black">Delete plant?</v-card-title>
        <v-card-text>
          This will permanently delete <strong>{{ plantToDelete?.name }}</strong>.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn rounded="xl" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            rounded="xl"
            variant="flat"
            color="red"
            :loading="deleteLoading"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row v-if="!plantsStore.loading && !plantsStore.error" dense class="grid-my-plants" style="row-gap: 12px">
      <v-col v-for="p in filtered" :key="p.id" cols="12" sm="6" md="4" lg="4">
        <MyPlantCard :plant="p" @edit="openEdit" @delete="openDelete" />
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

.state {
  padding: 14px 4px;
  font-weight: 800;
  opacity: 0.75;
}

.error {
  opacity: 1;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
