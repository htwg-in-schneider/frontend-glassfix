<template>
    <div class="col-8 col-sm-4 col-md-3 mb-2">
    <img 
        src="/ProjektBilder/GlassFix_Logo.png" 
        alt="GlassFix Logo" 
        class="img-fluid"
        style="max-height: 600px;"
    >
    </div>
    <div class="col-12 text-start px-4 mt-2">
        <h2 class="fw-bold m-0 ps-md-3" style="font-size: 1.8rem; color: #111;">{{ title }}</h2>
        <p class="text-muted ps-md-3" style="font-size: 1.1rem;">{{ subtitle }}</p>
    </div>
    
</template>
<script setup>
    defineProps({
        title: {
            type: String,
            default: 'Anfragen',
        },
        subtitle: {
            type: String,
            default: 'Gefilterte Kundenanfragen',
        }
    });
</script>