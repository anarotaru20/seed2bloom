<script setup>
import { computed, ref, watch } from 'vue'
import BaseDialog from './BaseDialog.vue'
import PlantCard from '../PlantTemplateCard.vue'
import { fetchPlantCatalog } from '@/services/plantCatalog'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  templates: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  search: { type: String, default: '' },
  activeTag: { type: String, default: 'all' },
})

const emit = defineEmits(['update:modelValue', 'update:search', 'update:activeTag', 'select'])

const loading = ref(false)
const localTemplates = ref([])
const loadError = ref('')

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    if (props.templates?.length) return
    if (localTemplates.value.length) return

    loading.value = true
    loadError.value = ''
    try {
      localTemplates.value = await fetchPlantCatalog()
    } catch (e) {
      loadError.value = 'Catalog unavailable'
      localTemplates.value = []
    } finally {
      loading.value = false
    }
  },
)

const templatesSource = computed(() =>
  props.templates?.length ? props.templates : localTemplates.value,
)

const tagsSource = computed(() => {
  if (props.tags?.length) return props.tags

  const set = new Set()
  for (const p of templatesSource.value) {
    const arr = Array.isArray(p.tags) ? p.tags : []
    for (const t of arr) set.add(t)
  }

  return [
    { title: 'All', value: 'all' },
    ...Array.from(set)
      .sort()
      .map((t) => ({ title: t, value: t })),
  ]
})

const filteredTemplates = computed(() => {
  const s = (props.search || '').toLowerCase().trim()

  return templatesSource.value.filter((p) => {
    const matchesSearch =
      !s ||
      String(p.commonName || '')
        .toLowerCase()
        .includes(s) ||
      String(p.species || '')
        .toLowerCase()
        .includes(s)

    const tags = Array.isArray(p.tags) ? p.tags : []
    const matchesTag =
      props.activeTag === 'all' ||
      (props.activeTag === 'petSafe' ? Boolean(p.petSafe) : tags.includes(props.activeTag))

    return matchesSearch && matchesTag
  })
})
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Add a plant"
    subtitle="Choose from the catalog"
    max-width="920"
  >
    <v-text-field
      :model-value="search"
      @update:modelValue="emit('update:search', $event)"
      placeholder="Search plants..."
      variant="outlined"
      density="comfortable"
      rounded="xl"
      prepend-inner-icon="mdi-magnify"
      hide-details
      class="dlg-search"
    />

    <div class="chips">
      <v-chip-group
        :model-value="activeTag"
        @update:modelValue="emit('update:activeTag', $event)"
        mandatory
        selected-class="chip-active"
      >
        <v-chip
          v-for="t in tagsSource"
          :key="t.value"
          :value="t.value"
          rounded="xl"
          class="chip"
          variant="flat"
        >
          {{ t.title }}
        </v-chip>
      </v-chip-group>
    </div>

    <div v-if="loading" class="empty">
      <v-progress-circular indeterminate size="28" />
      <div class="empty-t">Loading catalog...</div>
    </div>

    <div v-else-if="loadError" class="empty">
      <v-icon size="26">mdi-alert-circle-outline</v-icon>
      <div class="empty-t">{{ loadError }}</div>
      <div class="empty-s">Check backend and try again.</div>
    </div>

    <div v-else-if="filteredTemplates.length" class="grid">
      <PlantCard
        v-for="p in filteredTemplates"
        :key="p.templateId || p.id"
        :plant="p"
        @click="emit('select', p)"
      />
    </div>

    <div v-else class="empty">
      <v-icon size="26">mdi-magnify-remove-outline</v-icon>
      <div class="empty-t">No plants found</div>
      <div class="empty-s">Try a different search or filter.</div>
    </div>
  </BaseDialog>
</template>

<style scoped>
.dlg-search {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 18px;
}

.chips {
  margin-top: 12px;
  margin-bottom: 12px;
}

.chip {
  font-weight: 900;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

:deep(.chip-active) {
  background: rgba(46, 125, 50, 0.14) !important;
  border-color: rgba(46, 125, 50, 0.22) !important;
}

.grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.empty {
  margin-top: 20px;
  text-align: center;
  opacity: 0.75;
  font-weight: 650;
}

.empty-t {
  margin-top: 8px;
  font-weight: 900;
}

.empty-s {
  margin-top: 2px;
  font-size: 0.9rem;
}
</style>
