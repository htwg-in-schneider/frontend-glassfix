<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { createAnfrageStore } from '@/store/createAnfrageStore';

const router = useRouter();

function zurueckZuSchritt1() {
  router.push('/create-anfrage/schritt-1');
}

function weiterZuSchritt3() {
  if (!createAnfrageStore.bildUrl.trim()) {
    createAnfrageStore.bildUrl = '/ProjektBilder/GlassFix_Logo.png';
  }
  router.push('/create-anfrage/schritt-3');
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle 
        title="Neue Anfrage (2/3)" 
        subtitle="Geben Sie den Bildpfad an" 
      />
    </div>

    <div class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-sm-8 col-md-5 col-lg-4">
        <div class="filter-card p-3">
          
          <div class="mb-3">
            <label class="form-label fw-bold">Bild URL / Pfad</label>
            <input 
              class="form-control custom-input" 
              type="text"
              placeholder="z.B. /ProjektBilder/mein_kaputtes_glas.png"
              v-model="createAnfrageStore.bildUrl"
            />
            <div class="form-text text-muted small mt-2">
              Tragen Sie hier den Pfad oder die Web-Adresse des Bildes ein (kein Upload nötig).
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <Button :text="'Zurück'" :type="'default'" :onClick="zurueckZuSchritt1" />
            <Button :text="'Weiter'" :type="'default'" :onClick="weiterZuSchritt3" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anfragen-filter-view {
  
  margin: 0 auto;
  border: 1px solid #dee2e6;
}

.filter-card {
  border: 2px solid #000000;
  border-radius: 15px;
  background-color: white;
  box-shadow: #00000048 4px 4px 0px;
}

.custom-input {
  border: 2px solid #000000 !important;
  border-radius: 10px !important;
  padding: 10px;
  font-weight: 500;
}
</style>