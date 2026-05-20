<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { createAnfrageStore } from '@/store/createAnfrageStore';

const router = useRouter();

function weiterZuSchritt2() {
  if (!createAnfrageStore.kategorie) {
    alert('Bitte wählen Sie eine Kategorie aus.');
    return;
  }
  if (!createAnfrageStore.beschreibung.trim()) {
    alert('Bitte geben Sie eine Beschreibung des Schadens ein.');
    return;
  }
  if (!createAnfrageStore.fragen.trim()) {
    alert('Bitte geben Sie Ihre Fragen oder Anmerkungen ein.');
    return;
  }
  router.push('/create-anfrage/schritt-2');
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />
    
    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle 
        title="Neue Anfrage (1/3)" 
        subtitle="Geben Sie die Objektdaten ein" 
      />
    </div>

    <div class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-sm-8 col-md-5 col-lg-4">
        <div class="filter-card p-3">
          
          <div class="mb-3">
            <label class="form-label fw-bold">Kategorie *</label>
            <select 
              class="form-select custom-input" 
              v-model="createAnfrageStore.kategorie"
            >
              <option value="" disabled selected>Bitte wählen...</option>
              <option value="Trinkglas">Trinkglas</option>
              <option value="Spiegel">Spiegel</option>
              <option value="Fensterglas">Fensterglas</option>
              <option value="Vase">Vase / Sonstiges</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Beschreibung des Schadens *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B. Tiefer Kratzer auf der Vorderseite..."
              v-model="createAnfrageStore.beschreibung"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Fragen / Anmerkungen *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B. Kann man das ohne Rückstände polieren?"
              v-model="createAnfrageStore.fragen"
            ></textarea>
          </div>

          <div class="d-flex justify-content-center mt-4">
            <Button :text="'Weiter'" :type="'default'" :onClick="weiterZuSchritt2" />
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