<script setup>
import { computed, ref } from 'vue'
import { auth } from '@/services/firebase'

const firstName = computed(() => auth.currentUser?.displayName || '')
const email = computed(() => auth.currentUser?.email || '')

const formName = ref(firstName.value)

const units = ref('ml')
const dueSoonDays = ref(1)
const reminders = ref(true)
</script>

<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="sub">Manage your account and preferences</div>
      </div>

      <v-btn class="btn" rounded="xl" variant="outlined" disabled>
        <v-icon start>mdi-content-save</v-icon>
        Save changes
      </v-btn>
    </div>

    <v-row dense>
      <v-col cols="12" md="7">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-ic"><v-icon>mdi-account</v-icon></div>
            <div>
              <div class="card-t">Account</div>
              <div class="card-s">Basic profile details</div>
            </div>
          </div>

          <v-divider class="my-4" />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formName"
                label="Display name"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                prepend-inner-icon="mdi-account-circle"
                placeholder="Your name"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                :model-value="email"
                label="Email"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                prepend-inner-icon="mdi-email-outline"
                readonly
              />
            </v-col>
          </v-row>

          <div class="hint">
            Tip: You can change your display name anytime. Email changes require security checks.
          </div>
        </v-card>

        <v-card class="card mt16" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-ic warn"><v-icon>mdi-shield-lock-outline</v-icon></div>
            <div>
              <div class="card-t">Security</div>
              <div class="card-s">Password & access</div>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="rowline">
            <div>
              <div class="rowtitle">Password reset</div>
              <div class="rowdesc">Send yourself an email to reset your password.</div>
            </div>

            <v-btn rounded="xl" variant="outlined" disabled>
              <v-icon start>mdi-email-send-outline</v-icon>
              Send email
            </v-btn>
          </div>

          <v-divider class="my-4" />

          <div class="rowline">
            <div>
              <div class="rowtitle">Session</div>
              <div class="rowdesc">You are currently signed in on this device.</div>
            </div>

            <v-chip rounded="xl" class="chip" variant="flat">
              <v-icon start size="16">mdi-check-circle</v-icon>
              Active
            </v-chip>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-ic"><v-icon>mdi-tune-variant</v-icon></div>
            <div>
              <div class="card-t">Preferences</div>
              <div class="card-s">Personalize your experience</div>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="pref">
            <div class="pref-l">
              <div class="rowtitle">Water units</div>
              <div class="rowdesc">Choose how amounts are displayed.</div>
            </div>

            <v-btn-toggle
              v-model="units"
              class="toggle"
              rounded="xl"
              mandatory
              density="comfortable"
            >
              <v-btn value="ml" rounded="xl">ml</v-btn>
              <v-btn value="oz" rounded="xl">oz</v-btn>
            </v-btn-toggle>
          </div>

          <v-divider class="my-4" />

          <div class="pref">
            <div class="pref-l">
              <div class="rowtitle">Due soon threshold</div>
              <div class="rowdesc">Mark plants as “due soon” this many days before.</div>
            </div>

            <div class="slider">
              <v-slider v-model="dueSoonDays" :min="0" :max="3" :step="1" hide-details />
              <div class="slider-val">{{ dueSoonDays }} day(s)</div>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="pref">
            <div class="pref-l">
              <div class="rowtitle">Reminders</div>
              <div class="rowdesc">Show watering reminder prompts inside the app.</div>
            </div>

            <v-switch v-model="reminders" inset color="green" hide-details />
          </div>

          <div class="hint mt16">
            These settings are UI-only for now. 
          </div>
        </v-card>

        <v-card class="card mt16" rounded="2xl" elevation="0">
          <div class="mini">
            <v-avatar size="52" rounded="xl" class="ava">
              <v-icon>mdi-account</v-icon>
            </v-avatar>

            <div class="mini-txt">
              <div class="mini-name">{{ firstName || 'Your name' }}</div>
              <div class="mini-mail">{{ email }}</div>
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
  margin-bottom: 16px;
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

.btn {
  font-weight: 900;
}

.card {
  padding: 18px 18px 16px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

.mt16 {
  margin-top: 16px;
}

.card-h {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-ic {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.card-ic.warn {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.2);
}

.card-t {
  font-weight: 900;
}

.card-s {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 700;
}

.hint {
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.75;
  font-weight: 650;
}

.rowline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.rowtitle {
  font-weight: 900;
}

.rowdesc {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 650;
}

.chip {
  font-weight: 900;
}

.pref {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.pref-l {
  flex: 1;
}

.toggle {
  background: rgba(18, 23, 38, 0.04);
  border: 1px solid rgba(18, 23, 38, 0.08);
  padding: 4px;
}

.slider {
  min-width: 200px;
}

.slider-val {
  text-align: right;
  font-size: 0.85rem;
  font-weight: 900;
  opacity: 0.8;
}

.mini {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ava {
  background: rgba(18, 23, 38, 0.06);
  border: 1px solid rgba(18, 23, 38, 0.08);
}

.mini-name {
  font-weight: 950;
}

.mini-mail {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 650;
}
</style>
