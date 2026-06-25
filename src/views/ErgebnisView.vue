<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter();

const istErfolgreich = computed(() => route.query.status === 'erfolgreich');

const titel = computed(() =>
  istErfolgreich.value ? 'Erfolgreich' : 'Nicht erfolgreich'
);

const hinweis = computed(() =>
  typeof route.query.hinweis === 'string' ? route.query.hinweis : ''
);

function weiter() {
  const ziel = typeof route.query.zurueck === 'string'
    ? route.query.zurueck
    : '/dashboard';

  router.push(ziel);
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view ergebnis-view">
    <Header text="Dashboard" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
        :title="titel"
        :subtitle="hinweis"
      />
    </div>

    <div class="row m-0 d-flex justify-content-center mt-3 pb-5">
      <div class="col-11 col-sm-8 col-md-5 col-lg-4">
        <div class=" d-flex justify-content-center ergebnis-card p-4 text-center">
          <Button 
            :text="'Weiter'"
            :type="'default'"
            :onClick="weiter"
          />
        </div>
      </div>
    </div>
  </div>
</template>