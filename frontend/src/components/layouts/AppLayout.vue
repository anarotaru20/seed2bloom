<template>
  <v-layout class="app-shell">
    <AppSide />

    <v-main class="main">
      <div class="content">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import AppSide from '../AppSidebar.vue'
import AppTopbar from '../AppTopBar.vue'
</script>

<style scoped>
.app-shell {
  height: 100vh;
  overflow: hidden;
}

.main {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.content {
  background:
    radial-gradient(1000px 700px at 50% 80%, rgba(236, 204, 121, 0.2), transparent 65%),
    radial-gradient(900px 600px at 88% 12%, rgba(169, 231, 194, 0.26), transparent 60%),
    radial-gradient(900px 600px at 12% 8%, rgba(241, 223, 223, 0.37), transparent 60%),
    linear-gradient(
      180deg,
      rgba(242, 240, 232, 0.97) 0%,
      rgba(238, 236, 220, 0.97) 5%,
      rgba(234, 232, 215, 0.97) 100%
    );
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 70px 24px;
}

</style>
