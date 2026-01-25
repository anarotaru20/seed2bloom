<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">Dashboard</div>
        <div class="sub">Your plant overview for today</div>
      </div>
    </div>

    <v-row dense>
      <v-col v-for="s in stats" :key="s.label" cols="12" sm="6" md="3">
        <v-card class="kpi" rounded="2xl" elevation="0">
          <div class="kpi-top">
            <div class="kpi-ic">
              <v-icon>{{ s.icon }}</v-icon>
            </div>
            <div class="kpi-val">{{ s.value }}</div>
          </div>
          <div class="kpi-lab">{{ s.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt16">
      <v-col cols="12" md="7">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-t">Watering status</div>
            <v-chip rounded="xl" class="chip" variant="flat">Sorted by urgency</v-chip>
          </div>

          <v-divider class="my-4" />

          <div class="list">
            <template v-if="needsWater.length === 0">
              <div class="row">
                <div class="row-left">
                  <div class="dot" :style="{ background: statusColor('ok') }"></div>
                  <div>
                    <div class="row-title">All good 🎉</div>
                    <div class="row-sub">No plants need watering right now</div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div
                v-for="(p, i) in needsWater"
                :key="p.id || `${p.name}-${p.location}-${i}`"
                class="row"
              >
                <div class="row-left">
                  <div class="dot" :style="{ background: statusColor(p.status) }"></div>
                  <div>
                    <div class="row-title">{{ p.name }}</div>
                    <div class="row-sub">{{ p.location }} • {{ p.hint }}</div>
                  </div>
                </div>

                <div class="row-right">
                  <v-chip rounded="xl" class="status" :class="p.status || 'ok'" variant="flat">
                    {{ statusText(p.status, p) }}
                  </v-chip>

                  <v-btn icon variant="text" disabled>
                    <v-icon class="water-icon">mdi-water</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-t" style="padding-top: 7px">Recent activity</div>
          </div>

          <v-divider class="my-4" />

          <div class="timeline">
            <div v-if="recent.length === 0" class="t-item">
              <div class="t-ic">
                <v-icon size="18">mdi-notebook-outline</v-icon>
              </div>
              <div class="t-body">
                <div class="t-top">
                  <div class="t-title">No activity yet</div>
                  <div class="t-when">—</div>
                </div>
                <div class="t-sub">Add plants and log care to see history here</div>
              </div>
            </div>

            <div
              v-for="(r, i) in recent"
              :key="r.id || `${r.type}-${r.plant}-${r.when}-${i}`"
              class="t-item"
            >
              <div class="t-ic">
                <v-icon size="18">{{ iconByType(r.type) }}</v-icon>
              </div>

              <div class="t-body">
                <div class="t-top">
                  <div class="t-title">{{ r.plant }}</div>
                  <div class="t-when">{{ r.when }}</div>
                </div>
                <div class="t-sub">{{ r.note }}</div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePlantsStore } from '@/stores/plants'
import { useLocationsStore } from '@/stores/locations'
import { useCareLogsStore } from '@/stores/careLogs'

const plantsStore = usePlantsStore()
const locationsStore = useLocationsStore()
const careLogsStore = useCareLogsStore()

const rawPlants = computed(() => plantsStore.plants || [])
const rawLocations = computed(() => locationsStore.locations || [])
const rawCareLogs = computed(() => careLogsStore?.logs || careLogsStore?.careLogs || [])

const localIsoDate = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const startOfDayIso = (d = new Date()) => localIsoDate(d)

const normalizeDate = (v) => {
  if (!v) return null
  if (v instanceof Date) return v
  if (typeof v === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'number') {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'object' && typeof v.seconds === 'number') {
    const d = new Date(v.seconds * 1000)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'object' && typeof v.toDate === 'function') {
    const d = v.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }
  return null
}

const toIsoDate = (v) => {
  const d = normalizeDate(v)
  if (!d) return ''
  if (typeof d === 'string') return d
  return localIsoDate(d)
}

const addDaysIso = (isoDate, days) => {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + Number(days || 0))
  return localIsoDate(d)
}

const diffDays = (fromIso, toIso) => {
  const a = new Date(fromIso + 'T00:00:00').getTime()
  const b = new Date(toIso + 'T00:00:00').getTime()
  return Math.round((b - a) / 86400000)
}

const daysSinceIso = (iso) => {
  const today = startOfDayIso()
  const d = diffDays(iso, today)
  return Math.max(0, d)
}

const lastWateredLabel = (iso) => {
  const d = daysSinceIso(iso)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}

const pad2 = (n) => String(n).padStart(2, '0')

const formatWhen = (d) => {
  if (!d) return '—'
  const now = new Date()
  const todayKey = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
  const dKey = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

  const hh = pad2(d.getHours())
  const mm = pad2(d.getMinutes())

  if (dKey === todayKey) return `Today • ${hh}:${mm}`

  const y = new Date(now)
  y.setDate(now.getDate() - 1)
  const yKey = `${y.getFullYear()}-${pad2(y.getMonth() + 1)}-${pad2(y.getDate())}`
  if (dKey === yKey) return `Yesterday • ${hh}:${mm}`

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[d.getMonth()]} ${d.getDate()} • ${hh}:${mm}`
}

const plantNameOf = (p) =>
  p?.template?.commonName || p?.commonName || p?.name || p?.template?.species || 'Unnamed plant'

const locationOf = (p) =>
  p?.settings?.location || p?.location || p?.locationName || p?.room || p?.place || '—'

const everyDaysOf = (p) =>
  Number(p?.settings?.waterEveryDays || p?.waterEveryDays || p?.template?.care?.waterEveryDays || 7)

const lastIsoOf = (p) =>
  toIsoDate(p?.timestamps?.lastWateredAt) ||
  toIsoDate(p?.timestamps?.updatedAt) ||
  toIsoDate(p?.timestamps?.createdAt) ||
  toIsoDate(p?.lastWateredAt) ||
  toIsoDate(p?.updatedAt) ||
  toIsoDate(p?.createdAt) ||
  startOfDayIso()

const plants = computed(() =>
  rawPlants.value.map((p) => ({
    id: p.id,
    name: plantNameOf(p),
    location: locationOf(p),
    every: everyDaysOf(p),
    lastIso: lastIsoOf(p),
    createdAt: normalizeDate(p?.timestamps?.createdAt || p?.createdAt),
    updatedAt: normalizeDate(p?.timestamps?.updatedAt || p?.updatedAt),
  })),
)

const plantsById = computed(() => {
  const m = new Map()
  for (const p of rawPlants.value) m.set(p.id, p)
  return m
})

const dueInDays = (p) => {
  const todayIso = startOfDayIso()
  const dueIso = addDaysIso(p.lastIso, p.every)
  return diffDays(todayIso, dueIso)
}

const wateringStatusOf = (p) => {
  const d = dueInDays(p)
  const lastLbl = lastWateredLabel(p.lastIso)

  if (d < 0) {
    const overdue = Math.abs(d)
    return {
      status: 'needs',
      hint: `Last watered: ${lastLbl} • Overdue by ${overdue} day${overdue === 1 ? '' : 's'}`,
    }
  }

  if (d === 0) return { status: 'today', hint: `Last watered: ${lastLbl} • Due today` }

  if (d === 1) return { status: 'due', hint: `Last watered: ${lastLbl} • Due tomorrow` }

  if (d <= 3) return { status: 'due', hint: `Last watered: ${lastLbl} • Next in ${d} days` }

  return { status: 'ok', hint: `Last watered: ${lastLbl} • Next in ${d} days` }
}

const needsWater = computed(() => {
  const rows = plants.value.map((p) => {
    const st = wateringStatusOf(p)
    const d = dueInDays(p)
    return {
      id: p.id || null,
      name: p.name,
      location: p.location,
      status: st.status,
      hint: st.hint,
      dueDays: d,
      _sort: st.status === 'needs' ? 0 : st.status === 'today' ? 1 : st.status === 'due' ? 2 : 3,
    }
  })

  rows.sort((a, b) => a._sort - b._sort || a.dueDays - b.dueDays || a.name.localeCompare(b.name))
  return rows.slice(0, 5).map(({ _sort, ...rest }) => rest)
})

const recent = computed(() => {
  const rows = []

  for (const p of plants.value) {
    const created = p.createdAt
    const updated = p.updatedAt
    const isUpdate = !!updated && (!created || updated.getTime() !== created.getTime())
    const d = isUpdate ? updated : created
    if (!d) continue

    rows.push({
      id: `plant-${p.id || p.name}-${d.getTime()}`,
      type: 'plant',
      plant: p.name,
      when: formatWhen(d),
      note: isUpdate ? 'Updated plant details' : 'Add new plant',
      _t: d.getTime(),
    })
  }

  for (const l of rawLocations.value) {
    const name = l?.name || 'Location'
    const created = normalizeDate(l?.timestamps?.createdAt || l?.createdAt)
    const updated = normalizeDate(l?.timestamps?.updatedAt || l?.updatedAt)
    const isUpdate = !!updated && (!created || updated.getTime() !== created.getTime())
    const d = isUpdate ? updated : created
    if (!d) continue

    rows.push({
      id: `location-${l?.id || name}-${d.getTime()}`,
      type: 'location',
      plant: name,
      when: formatWhen(d),
      note: isUpdate ? 'Updated location details' : 'Add new location',
      _t: d.getTime(),
    })
  }

  for (const log of rawCareLogs.value) {
    const created = normalizeDate(
      log?.timestamps?.createdAt || log?.createdAt || log?.at || log?.date,
    )
    const updated = normalizeDate(log?.timestamps?.updatedAt || log?.updatedAt)
    const d = updated || created
    if (!d) continue

    const plantId = log?.plantId || log?.plant?.id
    const plantRaw = plantId ? plantsById.value.get(plantId) : null
    const plantName =
      plantRaw?.template?.commonName || plantRaw?.commonName || plantRaw?.name || 'Plant'

    const t = log?.type || log?.action || 'care'
    const label =
      t === 'water'
        ? 'Water'
        : t === 'fertilize'
          ? 'Fertilize'
          : t === 'prune'
            ? 'Prune'
            : t === 'repot'
              ? 'Repot'
              : 'Care'

    const isUpdate = !!updated && !!created && updated.getTime() !== created.getTime()

    rows.push({
      id: `care-${log?.id || plantName}-${d.getTime()}`,
      type: t,
      plant: plantName,
      when: formatWhen(d),
      note: isUpdate ? `Updated care: ${label}` : `Added care: ${label}`,
      _t: d.getTime(),
    })
  }

  rows.sort((a, b) => b._t - a._t)
  return rows.slice(0, 5).map(({ _t, ...rest }) => rest)
})

const stats = computed(() => {
  const all = plants.value.length

  const waterToday = plants.value.filter((p) => dueInDays(p) <= 0).length

  const dueSoon = plants.value.filter((p) => {
    const d = dueInDays(p)
    return d >= 1 && d <= 3
  }).length

  const loc = rawLocations.value.length

  return [
    { label: 'Plants', value: all, icon: 'mdi-sprout' },
    { label: 'Water today', value: waterToday, icon: 'mdi-water' },
    { label: 'Due soon', value: dueSoon, icon: 'mdi-timer-sand' },
    { label: 'Locations', value: loc, icon: 'mdi-map-marker' },
  ]
})

const iconByType = (t) => {
  if (t === 'water') return 'mdi-water'
  if (t === 'fertilize') return 'mdi-sprout'
  if (t === 'prune') return 'mdi-content-cut'
  if (t === 'repot') return 'mdi-flower'
  if (t === 'plant') return 'mdi-sprout'
  if (t === 'location') return 'mdi-map-marker'
  return 'mdi-notebook-outline'
}

const statusColor = (s) => {
  if (s === 'needs') return 'rgba(239, 68, 68, 0.12)'
  if (s === 'due') return 'rgba(245, 158, 11, 0.12)'
  return 'rgba(34, 197, 94, 0.12)'
}

const statusText = (s) => {
  if (s === 'needs') return 'Needs water'
  if (s === 'today') return 'Today'
  if (s === 'due') return 'Due soon'
  return 'OK'
}

onMounted(async () => {
  const tasks = [
    plantsStore.fetchPlants?.(),
    locationsStore.fetchLocations?.(),
    careLogsStore.fetchLogs?.() || careLogsStore.fetchCareLogs?.(),
  ].filter(Boolean)
  await Promise.allSettled(tasks)
})
</script>

<style scoped>
.page {
  padding-top: 20px;
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

.mt16 {
  margin-top: 16px;
}

.kpi {
  padding: 16px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-ic {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.kpi-val {
  font-size: 1.6rem;
  font-weight: 950;
}

.kpi-lab {
  margin-top: 10px;
  font-weight: 850;
  opacity: 0.85;
}

.card {
  padding: 18px 18px 16px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

.card-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-t {
  font-weight: 950;
  font-size: 1.05rem;
}

.chip {
  font-weight: 900;
  opacity: 0.9;
  background: #2e7d32 !important;
  color: #ffffff !important;
}

.list {
  display: grid;
  gap: 10px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid rgba(20, 31, 24, 0.06);
  background: rgba(255, 255, 255, 0.6);
}

.row-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(20, 31, 24, 0.08);
}

.row-title {
  font-weight: 950;
}

.row-sub {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 650;
}

.row-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status {
  font-weight: 900;
}

:deep(.status.due) {
  background-color: rgba(245, 158, 11, 0.25) !important;
  color: #92400e !important;
}

:deep(.status.needs) {
  background-color: rgba(239, 68, 68, 0.25) !important;
  color: #7f1d1d !important;
}

:deep(.status.ok) {
  background-color: rgba(34, 197, 94, 0.25) !important;
  color: #14532d !important;
}

:deep(.status.due .v-chip__underlay),
:deep(.status.needs .v-chip__underlay),
:deep(.status.ok .v-chip__underlay) {
  opacity: 0 !important;
}

.timeline {
  display: grid;
  gap: 12px;
}

.t-item {
  display: flex;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(20, 31, 24, 0.06);
  background: rgba(255, 255, 255, 0.6);
}

.t-ic {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(18, 23, 38, 0.04);
  border: 1px solid rgba(18, 23, 38, 0.08);
}

.t-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.t-title {
  font-weight: 950;
}

.t-when {
  font-size: 0.8rem;
  opacity: 0.7;
  font-weight: 700;
}

.t-sub {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.75;
  font-weight: 650;
}

.water-icon {
  color: #3b82f6 !important;
}

:deep(.status.today) {
  background-color: rgba(59, 130, 246, 0.25) !important;
  color: #1d4ed8 !important;
}
</style>
