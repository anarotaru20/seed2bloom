<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => route.meta.title || '')
</script>

<template>
  <v-toolbar flat class="topbar">
    <v-toolbar-title class="title">
      {{ title }}
    </v-toolbar-title>

    <v-spacer />
  </v-toolbar>
</template>

<style scoped>
.topbar {
  background: transparent;
  padding: 10px 8px;
  border-bottom: 5px solid rgba(20, 31, 24, 0.08);
}

.title {
  font-weight: 900;
  font-size: 1.2rem;
}
</style>
