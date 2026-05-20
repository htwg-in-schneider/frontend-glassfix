<script setup>
    defineProps({
        type: {
            type: String,
            default: 'header',
        },
        text: {
            type: String,
            default: 'Zurück',
        },
        onClick: {
            type: Function,
            default: null,
        }
    });
</script>
<template>
    <button 
        v-if="type === 'header'"
        @click="onClick ? onClick() : null"
        class="btn btn-light d-flex align-items-center fw-bold px-3 py-1 custom-filter-btn" 
        style="border-radius: 10px; font-size: 1.1rem;"
    >
        <span class="me-2" style="color: #d48416; font-size: 1.3rem;">⬅</span> 
        {{ text }}
    </button>

    <button 
        v-else-if="type === 'AnfrageCard'"
        @click="onClick ? onClick() : null"
        class="btn text-white fw-bold py-2 d-flex align-items-center justify-content-center custom-prüfen-btn"
        style="background-color: #f0a530; border-radius: 15px; border: none;"
    >
        <span class="style-btn-text">{{ text }}</span>
        <span class="ms-2 bg-white text-dark d-flex align-items-center justify-content-center rounded-circle arrow-icon" style="width: 20px; height: 20px;">❯</span>
    </button>
</template>
<style scoped>
    /* Styles for the header button */  
    .custom-filter-btn {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
    }
    .custom-filter-btn:active {
        transform: scale(0.95);
    }

    /* Styles for the AnfrageCard button */
    .custom-prüfen-btn {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
        transition: background-color 0.2s, transform 0.1s;
    }
    .custom-prüfen-btn:hover {
        background-color: #d48416 !important;
    }
    .custom-prüfen-btn:active {
        transform: scale(0.98);
    }
    .style-btn-text {
        font-size: 0.9rem;
    }
    .arrow-icon {
    font-size: 0.7rem;
    }
    @media (min-width: 768px) {
        .style-btn-text {
            font-size: 1rem;
        }
        .arrow-icon {
            font-size: 0.75rem;
        }
    }
</style>