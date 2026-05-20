<script setup>
    import Button from './Button.vue';
    defineProps({
        anfrage: {
            type: Object,
            required: true,
        }
    });

    function showAlert(description){
        alert(description);
    }
</script>
<template>
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
              <Button 
                :text="'Details'" 
                :type="'AnfrageCard'" 
                @click="showAlert(anfrage.beschreibung)"
              />
            </div>

          </div> 
        </div>
</template>
<style scoped>
    .custom-anfrage-card {
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.08) !important;
        background-color: #ffffff;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    @media (min-width: 768px) {
    .custom-anfrage-card:hover {
        transform: translateY(-5px);
        box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.12) !important;
        }
    }
    .style-img-container {
        width: 110px;
        height: auto;
        }
    @media (min-width: 768px) {
    .style-img-container {
        width: 100% !important;
        height: 200px;
        }
    }
    .style-title {
        font-size: 1.1rem;
    }
    @media (min-width: 768px) {
        .style-title {
            font-size: 1.25rem;
        }
    }
    .style-badge {
        border-radius: 10px; 
        font-size: 0.75rem; 
        border-color: #ccc !important;
    }
    @media (min-width: 768px) {
        .style-badge {
            font-size: 0.85rem;
        }
    }
    
</style>