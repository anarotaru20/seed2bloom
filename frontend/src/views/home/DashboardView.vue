<script setup>
const stats = [
  { label: 'Plants', value: 7, icon: 'mdi-sprout' },
  { label: 'Needs water', value: 2, icon: 'mdi-water-alert' },
  { label: 'Due soon', value: 1, icon: 'mdi-timer-sand' },
  { label: 'Locations', value: 3, icon: 'mdi-map-marker' },
]

const needsWater = [
  { id: 'p1', name: 'Monstera', location: 'Living', status: 'needs', hint: 'Overdue by 2 days' },
  { id: 'p2', name: 'Pothos', location: 'Balcony', status: 'due', hint: 'Due today' },
  { id: 'p3', name: 'Ficus', location: 'Kitchen', status: 'ok', hint: 'Next in 2 days' },
]

const recent = [
  { id: 'l1', type: 'water', plant: 'Ficus', when: 'Today • 10:20', note: '250 ml' },
  { id: 'l2', type: 'fertilize', plant: 'Monstera', when: 'Yesterday • 18:05', note: 'Liquid fertilizer' },
  { id: 'l3', type: 'prune', plant: 'Pothos', when: 'Jan 14 • 09:10', note: 'Removed yellow leaves' },
]

const iconByType = (t) => {
  if (t === 'water') return 'mdi-water'
  if (t === 'fertilize') return 'mdi-sprout'
  if (t === 'prune') return 'mdi-content-cut'
  if (t === 'repot') return 'mdi-flower'
  return 'mdi-notebook-outline'
}

const statusColor = (s) => {
  if (s === 'needs') return 'rgba(239, 68, 68, 0.12)'
  if (s === 'due') return 'rgba(245, 158, 11, 0.12)'
  return 'rgba(34, 197, 94, 0.12)'
}

const statusText = (s) => (s === 'needs' ? 'Needs water' : s === 'due' ? 'Due soon' : 'OK')
</script>

<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="sub">Your plant overview for today</div>
      </div>

      <div class="hdr-actions">
        <v-btn rounded="xl" variant="outlined" disabled>
          <v-icon start>mdi-plus</v-icon>
          Add plant
        </v-btn>
      </div>
    </div>

    <v-row dense>
      <v-col v-for="s in stats" :key="s.label" cols="12" sm="6" md="3">
        <v-card class="kpi" rounded="2xl" elevation="0">
          <div class="kpi-top">
            <div class="kpi-ic"><v-icon>{{ s.icon }}</v-icon></div>
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
            <v-chip rounded="xl" class="chip" variant="flat">
              Sorted by urgency
            </v-chip>
          </div>

          <v-divider class="my-4" />

          <div class="list">
            <div v-for="p in needsWater" :key="p.id" class="row">
              <div class="row-left">
                <div class="dot" :style="{ background: statusColor(p.status) }"></div>
                <div>
                  <div class="row-title">{{ p.name }}</div>
                  <div class="row-sub">{{ p.location }} • {{ p.hint }}</div>
                </div>
              </div>

              <div class="row-right">
                <v-chip rounded="xl" class="status" variant="flat">
                  {{ statusText(p.status) }}
                </v-chip>
                <v-btn icon variant="text" disabled>
                  <v-icon>mdi-water</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-t">Recent care</div>
            <v-btn rounded="xl" variant="outlined" disabled>
              View all
            </v-btn>
          </div>

          <v-divider class="my-4" />

          <div class="timeline">
            <div v-for="r in recent" :key="r.id" class="t-item">
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
</style>
