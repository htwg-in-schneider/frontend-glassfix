<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { createAnfrageStore } from '@/store/createAnfrageStore';
import { computed } from 'vue';

const router = useRouter();
const baseUrl = import.meta.env.BASE_URL;

function zurueckZuSchritt1() {
  router.push('/create-anfrage/schritt-1');
}

function weiterZuSchritt3() {
  router.push('/create-anfrage/schritt-3');
}

const readyForNextStep = computed(() => {
 return createAnfrageStore.bildUrl && createAnfrageStore.bildUrl.trim() !== '';
});

</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle 
        title="Neue Anfrage (2/3)" 
        subtitle="Wählen Sie ein Bild aus:" 
      />
    </div>

    <div class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-md-10 col-lg-8">
        
        <div class="row g-3 justify-content-center m-0 p-2" style="max-height: 480px; overflow-y: auto;">
          
          <div class="col-12 col-sm-6">
            <div class="image-card p-2 d-flex align-items-center gap-3">
              <input class="form-check-input flex-shrink-0" type="radio" value="/AuftragBspBilder/Fensterglas.png" id="fenster" v-model="createAnfrageStore.bildUrl">
              <label class="form-check-label w-100 h-100 d-flex justify-content-center align-items-center" for="fenster">
                <img :src="`${baseUrl}/AuftragBspBilder/Fensterglas.png`" alt="Fensterglas" class="img-fluid rounded image-contain">
              </label>
            </div>
          </div>
          
          <div class="col-12 col-sm-6">
            <div class="image-card p-2 d-flex align-items-center gap-3">
              <input class="form-check-input flex-shrink-0" type="radio" value="/AuftragBspBilder/TrinkglasKratzer.png" id="TGK" v-model="createAnfrageStore.bildUrl">
              <label class="form-check-label w-100 h-100 d-flex justify-content-center align-items-center" for="TGK">
                <img :src="`${baseUrl}/AuftragBspBilder/TrinkglasKratzer.png`" alt="Trinkglas Kratzer" class="img-fluid rounded image-contain">
              </label>
            </div>
          </div>
          
          <div class="col-12 col-sm-6">
            <div class="image-card p-2 d-flex align-items-center gap-3">
              <input class="form-check-input flex-shrink-0" type="radio" value="/AuftragBspBilder/TrinkglasRand.png" id="TGR" v-model="createAnfrageStore.bildUrl">
              <label class="form-check-label w-100 h-100 d-flex justify-content-center align-items-center" for="TGR">
                <img :src="`${baseUrl}/AuftragBspBilder/TrinkglasRand.png`" alt="Trinkglas Rand" class="img-fluid rounded image-contain">
              </label>
            </div>
          </div>
          
          <div class="col-12 col-sm-6">
            <div class="image-card p-2 d-flex align-items-center gap-3">
              <input class="form-check-input flex-shrink-0" type="radio" value="/AuftragBspBilder/VaseKratzer.png" id="VK" v-model="createAnfrageStore.bildUrl">
              <label class="form-check-label w-100 h-100 d-flex justify-content-center align-items-center" for="VK">
                <img :src="`${baseUrl}/AuftragBspBilder/VaseKratzer.png`" alt="Vase Kratzer" class="img-fluid rounded image-contain">
              </label>
            </div>
          </div>

          <div class="col-12 col-sm-6">
            <div class="image-card p-2 d-flex align-items-center gap-3">
              <input class="form-check-input flex-shrink-0" type="radio" value="/AuftragBspBilder/VaseRand.png" id="VR" v-model="createAnfrageStore.bildUrl">
              <label class="form-check-label w-100 h-100 d-flex justify-content-center align-items-center" for="VR">
                <img :src="`${baseUrl}/AuftragBspBilder/VaseRand.png`" alt="Vase Rand" class="img-fluid rounded image-contain">
              </label>
            </div>
          </div>

        </div>

        <div class="d-flex justify-content-between mt-4 px-2">
          <Button v-if="readyForNextStep" :text="'Zurück'" :type="'default'" :onClick="zurueckZuSchritt1" />
          <Button :text="'Weiter'" :type="'default'" :onClick="weiterZuSchritt3" />
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

/* Sub-tarjetas individuales */
.image-card {
  border: 2px solid #000000;
  border-radius: 12px;
  background-color: #ffffff; /* Fondo limpio para las imágenes */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 160px; /* Un poco más de margen de altura para que luzcan las fotos */
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: #00000020 0px 4px 8px;
}

/* Forzar que el label maneje el centrado flex */
.image-card label {
  cursor: pointer;
  display: flex !important;
}

/* Ajuste para que las imágenes entren ENTERAS sin cortarse */
.image-contain {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ajusta la imagen entera dentro del cuadro conservando proporciones */
}

/* Estilo para los botones de opción (Radio) */
.form-check-input {
  width: 1.35rem;
  height: 1.35rem;
  cursor: pointer;
  border: 2px solid #000000;
}

.form-check-input:checked {
  background-color: #ffc107; /* O tu color de acento del tema GlassFix */
  border-color: #000000;
}
</style>