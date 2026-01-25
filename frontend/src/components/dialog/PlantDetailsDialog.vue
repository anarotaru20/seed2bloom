<template>
  <BaseDialog
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :title="mode === 'add' ? 'Add a new plant' : 'Edit plant details'"
    :subtitle="
      mode === 'add'
        ? 'Set details before adding this plant to your collection.'
        : 'Update this plant’s details and save your changes.'
    "
    max-width="560"
  >
    <v-form v-model="isFormValid" validate-on="input">
      <div class="preview">
        <div class="preview-ic">
          <v-icon size="22">mdi-sprout</v-icon>
        </div>

        <div class="preview-txt">
          <div class="p-name">{{ plant?.commonName || plant?.name }}</div>
          <div class="p-sub">{{ plant?.scientificName || plant?.species }}</div>
        </div>

        <div class="preview-tags">
          <v-chip
            v-if="plant?.petSafe"
            class="tag"
            rounded="xl"
            variant="flat"
            size="small"
            :style="tagTheme('pet-safe')"
          >
            <v-icon start size="16">mdi-paw</v-icon>
            Pet-safe
          </v-chip>

          <v-chip
            v-for="t in (plant?.tags || []).slice(0, 3)"
            :key="t"
            class="tag"
            rounded="xl"
            variant="flat"
            size="small"
            :style="tagTheme(t)"
          >
            {{ t }}
          </v-chip>
        </div>
      </div>

      <v-row dense class="mt12">
        <v-col cols="12">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.location"
                :items="locations"
                label="Location"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                :rules="[rules.required('Location')]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.waterEveryDays"
                type="number"
                min="1"
                label="Water every (days)"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                :rules="[rules.waterEvery]"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.photoUrl"
            label="Photo URL"
            placeholder="https://..."
            variant="outlined"
            density="comfortable"
            rounded="xl"
            :rules="[rules.photoUrl]"
          />
        </v-col>

        <v-col v-if="form.photoUrl && isValidPhotoUrl(form.photoUrl)" cols="12">
          <div class="img-prev">
            <img :src="form.photoUrl" alt="plant" />
          </div>
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="form.notes"
            label="Notes"
            placeholder="Anything to remember?"
            variant="outlined"
            density="comfortable"
            rounded="xl"
            rows="3"
            auto-grow
            :rules="[rules.notes]"
          />
        </v-col>
      </v-row>
    </v-form>

    <template #actions>
      <div class="actions-bar">
        <v-btn rounded="xl" variant="outlined" @click="emit('back')">Back</v-btn>

        <v-btn
          rounded="xl"
          variant="flat"
          class="save"
          :disabled="!isFormValid"
          @click="emit('save')"
        >
          <v-icon start>mdi-check</v-icon>
          {{ mode === 'add' ? 'ADD' : 'SAVE' }}
        </v-btn>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseDialog from './BaseDialog.vue'
import {
  isValidPlantLocation,
  isValidWaterEveryDays,
  isValidPhotoUrl,
  isValidPlantNotes,
} from '@/utils/validators'

defineProps({
  modelValue: Boolean,
  mode: String,
  plant: Object,
  form: Object,
  locations: Array,
})

const emit = defineEmits(['update:modelValue', 'back', 'save'])

const isFormValid = ref(false)

const normTag = (t) =>
  String(t || '').trim().toLowerCase().replace(/\s+/g, '-')

const tagTheme = (t) => {
  const k = normTag(t)

  const palette = {
    decorative: { bg: '#fdecef', fg: '#9b2c3e' },
    'slow-growth': { bg: '#eef2ff', fg: '#3730a3' },
    tropical: { bg: '#ecfdf5', fg: '#065f46' },
    indoor: { bg: '#f0fdf4', fg: '#166534' },
    'low-light': { bg: '#f1f5f9', fg: '#334155' },
    'pet-safe': { bg: '#fff7ed', fg: '#9a3412' },
    'easy-care': { bg: '#fef9c3', fg: '#854d0e' },
    'air-purifying': { bg: '#e0f2fe', fg: '#075985' },
    succulent: { bg: '#fce7f3', fg: '#9d174d' },
    cactus: { bg: '#ede9fe', fg: '#5b21b6' },
    fern: { bg: '#dcfce7', fg: '#166534' },
    flowering: { bg: '#ffe4e6', fg: '#9f1239' },
    variegated: { bg: '#e2e8f0', fg: '#334155' },
    hanging: { bg: '#fae8ff', fg: '#7e22ce' },
    'fast-growth': { bg: '#dbeafe', fg: '#1d4ed8' },
    fragrant: { bg: '#ffedd5', fg: '#9a3412' },
    hardy: { bg: '#e5e7eb', fg: '#374151' },
    'low-water': { bg: '#e0f2fe', fg: '#0c4a6e' },
  }

  if (palette[k]) {
    return {
      background: palette[k].bg,
      color: palette[k].fg,
    }
  }

  let h = 0
  for (let i = 0; i < k.length; i++) {
    h = (h * 31 + k.charCodeAt(i)) % 360
  }

  return {
    background: `hsl(${h} 80% 92%)`,
    color: `hsl(${h} 45% 28%)`,
  }
}

const rules = computed(() => ({
  required: (label) => (v) =>
    isValidPlantLocation(v) ? true : `${label} is required`,
  waterEvery: (v) =>
    isValidWaterEveryDays(v)
      ? true
      : 'Water frequency must be between 1 and 365 days',
  photoUrl: (v) =>
    isValidPhotoUrl(v) ? true : 'Enter a valid http(s) URL',
  notes: (v) =>
    isValidPlantNotes(v)
      ? true
      : 'Notes must be at least 3 characters or empty',
}))
</script>

<style scoped>
.mt12 {
  margin-top: 12px;
}

.preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

.preview-ic {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.preview-tags {
  margin-left: auto;
  display: flex;
  gap: 6px;
}

.tag {
  font-weight: 600;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save {
  background: #2e7d32;
  color: white;
  font-weight: 900;
  padding: 10px 22px;
  border-radius: 999px !important;
}
</style>
