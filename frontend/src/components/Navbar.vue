<template>
  <v-app-bar class="topbar" elevation="0">
    <div class="bar-inner">
      <slot name="prepend" />

      <div class="brand">
        <v-img src="/logo_txt.png" class="brand-logo" contain />

        <div class="brand-text">
          <div class="brand-name">
            <span class="seed">Seed</span><span class="two">2</span><span class="bloom">Bloom</span>
          </div>
        </div>
      </div>

      <div class="center">
        <slot name="center" />
      </div>

      <v-spacer />

      <slot name="actions" />
    </div>
  </v-app-bar>
</template>

<script setup></script>

<style scoped>
.topbar {
  height: var(--appbar-h);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 50px;
}

.bar-inner {
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 50px;
  padding-right: 30px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 55px;
  height: 55px;
}

.brand-name {
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: -0.3px;
}

.brand-name .seed {
  color: #2e7d32;
}

.brand-name .two {
  color: #e53935;
  margin: 0 1px;
}

.brand-name .bloom {
  color: #f9a825;
}

.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}
</style>
