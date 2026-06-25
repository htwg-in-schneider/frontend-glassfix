<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import LogoAndTitle from '@/components/LogoAndTitle.vue'
import Button from '@/components/Button.vue'

import { useRouter } from 'vue-router'
import { useAngebotFilterStore } from '@/angebotFilter'

const router = useRouter()
const filterStore = useAngebotFilterStore()

const kategorien = ref([])
const baseUrl = 'http://localhost:8081'

async function ladeKategorien() {
  try {
    const response = await fetch(`${baseUrl}/api/kategorien`)

    if (response.ok) {
      kategorien.value = await response.json()
    }
  } catch (error) {
    console.error('Kategorien konnten nicht geladen werden:', error)
  }
}

function applyFilter() {
  router.push('/angebote')
}
onMounted(ladeKategorien)
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />
    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
      title="Angebot Filter"
      subtitle="Finde passende Angebote"/>
    </div>
    

    <div class="row m-0 justify-content-center mt-3">
      <div class="col-11 col-sm-8 col-md-5 col-lg-4">
        <div class="filter-card p-3">
          <div class="mb-3">
            <label class="form-label fw-bold">Kategorie</label>
            <select
              class="form-select custom-input"
              :value="filterStore.category"
              @change="filterStore.setCategory($event.target.value)"
            >
              <option
                v-for="kategorie in kategorien"
                :key="kategorie.id"
                :value="kategorie.name"
              >
                {{ kategorie.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Status</label>
            <select
              class="form-select custom-input"
              :value="filterStore.status"
              @change="filterStore.setStatus($event.target.value)"
            >
              <option value="">Alle Status</option>
              <option value="IN_BEARBEITUNG">IN_BEARBEITUNG</option>
              <option value="ANGEBOT_VORHANDEN">ANGEBOT_VORHANDEN</option>
              <option value="ANGENOMMEN">ANGENOMMEN</option>
              <option value="ABGELEHNT">ABGELEHNT</option>
              <option value="FERTIG">FERTIG</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Erstellungsdatum/Zeitraum</label>
            <select
              class="form-select custom-input"
              :value="filterStore.period"
              @change="filterStore.setPeriod($event.target.value)"
            >
              <option value="">Alle Zeiträume</option>
              <option value="28.4.2026">28.4.2026</option>
              <option value="27.4.2026">27.4.2026</option>
              <option value="26.4.2026">26.4.2026</option>
              <option value="25.4.2026">25.4.2026</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Kunde</label>
            <input
              class="form-control custom-input"
              type="text"
              placeholder="z.B. Kunde A"
              :value="filterStore.kunde"
              @input="filterStore.setKunde($event.target.value)"
            >
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Experte</label>
            <input
              class="form-control custom-input"
              type="text"
              placeholder="z.B. Experte X"
              :value="filterStore.experte"
              @input="filterStore.setExperte($event.target.value)"
            >
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">ID</label>
            <input
              class="form-control custom-input"
              type="text"
              placeholder="z.B. 1"
              :value="filterStore.requestId"
              @input="filterStore.setRequestId($event.target.value)"
            >
          </div>
          <div class ="d-flex justify-content-center mt-4">
            <Button :text="'Zurücksetzen'" :type="'default'" :onClick="filterStore.resetFilter" />
            <Button :text="'Anwenden'" :type="'AnfrageCard'" :onClick="applyFilter" class="ms-2" /> <br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
