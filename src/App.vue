<script setup>

import Header from './components/Header.vue';
import Logo from './components/Logo.vue';
import AnfrageCard from './components/AnfrageCard.vue';

import {anfragen} from './data.js';

function getAnfragen(){
    return anfragen;
}

</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    <Header text="Filter" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <Logo />
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
        <AnfrageCard :anfrage="anfrage" />
      </div> 
    </div>
    
  </div>
</template>