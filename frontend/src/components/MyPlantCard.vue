<script setup>
const props = defineProps({
  plant: { type: Object, required: true },
})
const emit = defineEmits(['edit', 'delete'])

const statusLabel = (s) => (s === 'needs' ? 'Needs water' : s === 'due' ? 'Due soon' : 'OK')
const statusIcon = (s) =>
  s === 'needs' ? 'mdi-water-alert' : s === 'due' ? 'mdi-timer-sand' : 'mdi-check-circle'
const statusClass = (s) => (s === 'needs' ? 'needs' : s === 'due' ? 'due' : 'ok')
</script>

<template>
  <v-card class="card" rounded="2xl" elevation="0">
    <div class="top">
      <div class="pic">
        <img v-if="plant.photoUrl" :src="plant.photoUrl" alt="plant" class="img" />
        <v-icon v-else size="26">mdi-image-outline</v-icon>
      </div>

      <div class="badges">
        <div class="badge" :class="statusClass(plant.status)">
          <v-icon size="16">{{ statusIcon(plant.status) }}</v-icon>
          <span>{{ statusLabel(plant.status) }}</span>
        </div>
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

      <div class="note" v-if="plant.note">{{ plant.note }}</div>

      <div class="actions">
        <v-btn rounded="xl" variant="outlined" class="btn" @click.stop="emit('edit', plant)">
          <v-icon start>mdi-pencil</v-icon>
          Edit
        </v-btn>

        <v-btn rounded="xl" variant="flat" class="btn btn-primary" disabled>
          <v-icon start>mdi-water</v-icon>
          Water now
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

.badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  font-weight: 900;
  font-size: 0.82rem;
  white-space: nowrap;
}

.badge.ok {
  background: rgba(34, 197, 94, 0.12);
}

.badge.due {
  background: rgba(245, 158, 11, 0.12);
}

.badge.needs {
  background: rgba(239, 68, 68, 0.12);
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
  opacity: 0.78;
  font-weight: 650;
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

.btn-primary {
  background: rgba(46, 125, 50, 0.14);
  border: 1px solid rgba(46, 125, 50, 0.22);
}

.btn-danger {
  border-color: rgba(239, 68, 68, 0.35);
}
</style>
