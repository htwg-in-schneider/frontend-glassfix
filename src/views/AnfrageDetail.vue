<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { anfragen } from '@/data.js';

const route = useRoute();

const anfrage = computed(() => {
  return anfragen.find(a => String(a.id) === String(route.params.id)) || null;
});

</script>
<template>
    <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
        <Header text="Anfragen" />

        <div v-if="anfrage">
            <div class="row m-0 text-center justify-content-center pt-4">
                <LogoAndTitle class="text-center w-100" :title="`${anfrage.kategorie} #${anfrage.id}`" :subtitle="`Von ${anfrage.kunde}`" />
            </div>

            <section class="px-4 pb-5">
                <div class="detail-box mx-auto p-3">
                    <p class="mb-4">
                        <strong>Kategorie:</strong><br>
                        {{ anfrage.kategorie }}
                    </p>

                    <p class="mb-4">
                        <strong>Beschreibung</strong><br>
                        {{ anfrage.beschreibung }}
                    </p>

                    <p class="mb-4">
                        <strong>Fragen (optional)</strong><br>
                        <span class="fragen-text">{{ anfrage.fragen }}</span>
                    </p>

                    <div class="mb-4">
                        <strong>Bilder</strong>

                        <div class="row mt-2 g-3">
                            <div class="col-6">
                                <img :src="anfrage.bildUrl" alt="Glas Objekt" class="img-fluid detail-image">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex mt-4 justify-content-center">
                    <Button :text="'Auskunft erstellen'" :type="'AnfrageCard'" />
                </div>
            </section>
        </div>

        <div v-else class="text-center py-5">
            <h2 class="fw-bold">Anfrage wurde nicht gefunden.</h2>

            <router-link to="/" class="text-decoration-none">
                <Button :text="'Zurück zur Übersicht'" :type="'AnfrageCard'" />
            </router-link>
        </div>




    </div>
</template>

<style scoped>
.detail-box {
    max-width: 520px;
    border: 2px solid #000000;
    background-color: white;
    border-radius: 15px;
    box-shadow: #544f4f47 4px 4px 0px;
}

.detail-image {
    width: 100%;
    height: 140px;
    object-fit: cover;
}

.fragen-text {
    white-space: pre-line;
}

@media (min-width: 768px) {
    .detail-image {
        height: 220px;
    }
}
</style>
