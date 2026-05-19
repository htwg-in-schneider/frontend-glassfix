<script setup>
import {anfragen} from './data.js';

function getAnfragen(){
    return anfragen;
}

function showAlert(descprition){
    alert(descprition);
}

import { ref } from 'vue';

</script>

<template>
    <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    
    <div class="row m-0 p-3 align-items-center" style="background-color: #f0a530;">
      <div class="col-auto">
        <button class="btn btn-light d-flex align-items-center fw-bold px-3 py-1 custom-filter-btn" style="border-radius: 10px; font-size: 1.1rem;">
          <span class="me-2" style="color: #d48416; font-size: 1.3rem;">⬅</span> Filter
        </button>
      </div>
    </div>

    <div class="row m-0 text-center justify-content-center pt-4">
      <div class="col-8 col-sm-4 col-md-3 mb-2">
        <img 
          src="./assets/ProjektBilder/GlassFix_Logo.png" 
          alt="GlassFix Logo" 
          class="img-fluid"
          style="max-height: 600px;"
        >
      </div>
      <div class="col-12 text-start px-4 mt-2">
        <h2 class="fw-bold m-0 ps-md-3" style="font-size: 1.8rem; color: #111;">Anfragen</h2>
        <p class="text-muted ps-md-3" style="font-size: 1.1rem;">Gefilterte Kundenanfragen</p>
      </div>
    </div>

    <div class="row m-0 px-2 px-md-5 pb-5 g-3 g-md-4">
      
      <div 
        v-for="anfrage in getAnfragen()" 
        :key="anfrage.id" 
        class="col-12 col-md-4 col-xl-3"
      >
        <div 
          class="card h-100 shadow-sm custom-anfrage-card d-flex flex-row flex-md-column justify-content-between"
          style="border-radius: 20px; border: 1.5px solid #222; overflow: hidden;"
        >
          
          <div class="position-relative flex-shrink-0 style-img-container">
            <img 
              :src="anfrage.bildUrl" 
              alt="Glas Objekt" 
              class="w-100 h-100 object-fit-cover"
              @error="(e) => e.target.src = 'https://via.placeholder.com/300x200'"
            >
          </div>

          <div class="card-body d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-stretch p-3 flex-grow-1 overflow-hidden">
            
            <div class="me-2 me-md-0 mb-md-3 style-text-block text-truncate">
              <h5 class="fw-bold mb-1 mb-md-3 text-dark text-truncate style-title">
                {{anfrage.kategorie}} #{{ anfrage.id }}
              </h5>
              
              <div class="d-flex flex-row flex-md-column flex-wrap gap-1 gap-md-2">
                <span class="badge border text-dark bg-white px-2 py-1 py-md-2 d-inline-flex align-items-center justify-content-start style-badge">
                  <span class="me-1 me-md-2 text-muted">👤</span> {{ anfrage.kunde }}
                </span>
                <span class="badge border text-dark bg-white px-2 py-1 py-md-2 d-inline-flex align-items-center justify-content-start style-badge">
                  <span class="me-1 me-md-2 text-muted">⏱</span> {{ anfrage.erstellungsdatum }}
                </span>
              </div>
            </div>

            <div class="flex-shrink-0 style-btn-container">
              <button 
                @click="showAlert(anfrage.beschreibung)"
                class="btn text-white fw-bold w-100 py-2 d-flex align-items-center justify-content-center custom-prüfen-btn"
                style="background-color: #f0a530; border-radius: 15px; border: none;"
              >
                <span class="style-btn-text">Details</span>
                <span class="ms-2 bg-white text-dark d-flex align-items-center justify-content-center rounded-circle arrow-icon" style="width: 20px; height: 20px;">❯</span>
              </button>
            </div>

          </div> 
        </div> 
      </div> 
    </div>
  </div>
</template>