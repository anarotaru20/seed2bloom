<script setup>
import { computed, ref } from 'vue'
import BaseCard from '@/components/BaseCard.vue'

const today = new Date()
const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

const plants = ref([
  {
    id: 'w1',
    name: 'Monstera',
    location: 'Living room',
    every: 7,
    last: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
  },
  {
    id: 'w2',
    name: 'Pothos',
    location: 'Kitchen',
    every: 5,
    last: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
  },
  {
    id: 'w3',
    name: 'Snake plant',
    location: 'Bedroom',
    every: 14,
    last: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
  },
  {
    id: 'w4',
    name: 'ZZ plant',
    location: 'Office',
    every: 21,
    last: new Date(Date.now() - 25 * 86400000).toISOString().slice(0, 10),
  },
])

const dueInDays = (p) => {
  const last = new Date(p.last + 'T00:00:00').getTime()
  const due = last + p.every * 86400000
  return Math.round((due - t0) / 86400000)
}

const daysSince = (iso) => {
  const d0 = new Date(iso + 'T00:00:00').getTime()
  return Math.max(0, Math.round((t0 - d0) / 86400000))
}

const lastLabel = (iso) => {
  const d = daysSince(iso)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}

const groups = computed(() => {
  const g = { overdue: [], today: [], upcoming: [] }
  plants.value.forEach((p) => {
    const d = dueInDays(p)
    if (d < 0) g.overdue.push(p)
    else if (d === 0) g.today.push(p)
    else g.upcoming.push(p)
  })
  g.upcoming = [...g.upcoming].sort((a, b) => dueInDays(a) - dueInDays(b))
  g.today = [...g.today].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  g.overdue = [...g.overdue].sort((a, b) => dueInDays(a) - dueInDays(b))
  return g
})

const summary = computed(() => ({
  overdue: groups.value.overdue.length,
  today: groups.value.today.length,
  upcoming: groups.value.upcoming.length,
}))

const markDone = (p) => {
  p.last = new Date().toISOString().slice(0, 10)
}
</script>

<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">Water needs</div>
        <div class="sub">See which plants need water today</div>
      </div>
    </div>

    <div class="summary">
      <div class="sum-item sum-overdue">
        <div class="sum-icon"><v-icon>mdi-alert</v-icon></div>
        <div>
          <div class="sum-val">{{ summary.overdue }}</div>
          <div class="sum-lab">Overdue</div>
        </div>
      </div>

      <div class="sum-item sum-today">
        <div class="sum-icon"><v-icon>mdi-water</v-icon></div>
        <div>
          <div class="sum-val">{{ summary.today }}</div>
          <div class="sum-lab">Today</div>
        </div>
      </div>

      <div class="sum-item">
        <div class="sum-icon"><v-icon>mdi-calendar</v-icon></div>
        <div>
          <div class="sum-val">{{ summary.upcoming }}</div>
          <div class="sum-lab">Upcoming</div>
        </div>
      </div>
    </div>

    <div v-if="!groups.overdue.length && !groups.today.length && !groups.upcoming.length" class="empty">
      <v-icon size="36">mdi-water-off</v-icon>
      <div class="empty-title">All plants are happy</div>
      <div class="empty-sub">No watering needed right now.</div>
    </div>

    <div v-if="groups.overdue.length" class="group">
      <div class="group-title overdue">Overdue</div>
      <v-row dense>
        <v-col v-for="p in groups.overdue" :key="p.id" cols="12" md="6" lg="4">
          <div class="overdue-wrap">
            <BaseCard :title="p.name" :subtitle="p.location">
              <template #chips>
                <v-chip color="error" size="small" variant="flat">
                  <v-icon start size="16">mdi-alert</v-icon>
                  Overdue
                </v-chip>
                <v-chip size="small" variant="flat">
                  <v-icon start size="16">mdi-calendar</v-icon>
                  {{ Math.abs(dueInDays(p)) }} days late
                </v-chip>
              </template>

              <div class="meta">
                Last watered: <span class="meta-strong">{{ lastLabel(p.last) }}</span>
              </div>

              <template #actions>
                <v-btn rounded="xl" variant="flat" color="error" @click="markDone(p)">
                  Water now
                  <v-icon end>mdi-water</v-icon>
                </v-btn>
              </template>
            </BaseCard>
          </div>
        </v-col>
      </v-row>
    </div>

    <div v-if="groups.today.length" class="group">
      <div class="group-title today">Today</div>
      <v-row dense>
        <v-col v-for="p in groups.today" :key="p.id" cols="12" md="6" lg="4">
          <BaseCard :title="p.name" :subtitle="p.location">
            <template #chips>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-water</v-icon>
                Today
              </v-chip>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-clock-outline</v-icon>
                Every {{ p.every }} days
              </v-chip>
            </template>

            <div class="meta">
              Last watered: <span class="meta-strong">{{ lastLabel(p.last) }}</span>
            </div>

            <template #actions>
              <v-btn rounded="xl" variant="outlined" @click="markDone(p)">Mark watered</v-btn>
            </template>
          </BaseCard>
        </v-col>
      </v-row>
    </div>

    <div v-if="groups.upcoming.length" class="group">
      <div class="group-title upcoming">Upcoming</div>
      <v-row dense>
        <v-col v-for="p in groups.upcoming" :key="p.id" cols="12" md="6" lg="4">
          <BaseCard :title="p.name" :subtitle="p.location">
            <template #chips>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-calendar</v-icon>
                In {{ dueInDays(p) }} days
              </v-chip>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-clock-outline</v-icon>
                Every {{ p.every }} days
              </v-chip>
            </template>

            <div class="meta">
              Last watered: <span class="meta-strong">{{ lastLabel(p.last) }}</span>
            </div>
          </BaseCard>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 6px;
}

.hdr {
  margin-bottom: 14px;
}

.title {
  font-size: 1.6rem;
  font-weight: 900;
}

.sub {
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 700;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.sum-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 18px;
}

.sum-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.06);
}

.sum-val {
  font-weight: 950;
  font-size: 1.15rem;
  line-height: 1;
}

.sum-lab {
  margin-top: 3px;
  opacity: 0.7;
  font-weight: 800;
  font-size: 0.85rem;
}

.sum-overdue {
  border-color: rgba(198, 40, 40, 0.25);
}

.sum-today {
  border-color: rgba(21, 101, 192, 0.22);
}

.group {
  margin-top: 18px;
}

.group-title {
  font-weight: 950;
  margin-bottom: 10px;
}

.group-title.overdue {
  color: #c62828;
}

.group-title.today {
  color: #2e7d32;
}

.group-title.upcoming {
  color: #fb8c00;
}

.empty {
  margin-top: 40px;
  text-align: center;
  opacity: 0.75;
}

.empty-title {
  margin-top: 10px;
  font-weight: 950;
}

.empty-sub {
  margin-top: 6px;
  opacity: 0.75;
  font-weight: 700;
}

.meta {
  margin-top: 10px;
  opacity: 0.78;
  font-weight: 700;
}

.meta-strong {
  font-weight: 950;
  opacity: 0.95;
}

.overdue-wrap {
  border: 1px solid rgba(198, 40, 40, 0.22);
  background: rgba(198, 40, 40, 0.06);
  padding: 10px;
}

@media (max-width: 960px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
