<script setup>
import Header from '@/components/Header.vue'
import LogoAndTitle from '@/components/LogoAndTitle.vue'
import Button from '@/components/Button.vue'

import { useRouter } from 'vue-router'
import { useAnfragenFilterStore } from '@/anfragenFilter'

const router = useRouter()
const filterStore = useAnfragenFilterStore()

function applyFilter() {
  router.push('/anfragen')
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Startseite" />
    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
      title="Anfragen Filter"
      subtitle="Finde passende Anfragen"/>
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
              <option value="">Alle Kategorien</option>
              <option value="Kategorie 1">Kategorie 1</option>
              <option value="Kategorie 2">Kategorie 2</option>
              <option value="Kategorie 3">Kategorie 3</option>
              <option value="Kategorie 4">Kategorie 4</option>
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
              <option value="Offen">Offen</option>
              <option value="In Bearbeitung">In Bearbeitung</option>
              <option value="Abgeschlossen">Abgeschlossen</option>
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
            <label class="form-label fw-bold">Benutzername</label>
            <input
              class="form-control custom-input"
              type="text"
              placeholder="z.B. Kunde A"
              :value="filterStore.username"
              @input="filterStore.setUsername($event.target.value)"
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
