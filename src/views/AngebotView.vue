<script setup>
import { computed, ref, onMounted } from 'vue';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import AngebotCard from '@/components/AngebotCard.vue';

import { useAngebotFilterStore } from '@/angebotFilter';
import { useAuth0 } from '@auth0/auth0-vue';

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const bearerToken = ref('');
const error = ref('');

const filterStore = useAngebotFilterStore();

// --- API INTEGRATION VARIABLES (DEUTSCH) ---
const backendAngebote = ref([]);         // Speichert die vom Backend geladenen Angebote
const istAmLaden = ref(true);            // Status-Indikator für den Ladevorgang
const fehlerMeldung = ref('');           // Speichert eventuelle Fehlermeldungen

// Funktion zum Abrufen der Angebote vom Spring Boot Backend
const ladeAngeboteVomBackend = async () => {
  istAmLaden.value = true;
  fehlerMeldung.value = '';
  const token = await getAccessTokenSilently();
  bearerToken.value = token;
  try {
    // 'credentials: "include"' ist zwingend erforderlich, damit die HttpSession-Cookie (JSESSIONID) übertragen wird
    const antwort = await fetch('http://localhost:8081/api/auskunft', {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.value}`
      }
    });

    if (antwort.ok) {
      const daten = await antwort.json();
      backendAngebote.value = daten;
    } else if (antwort.status === 401) {
      fehlerMeldung.value = 'Nicht autorisiert. Bitte melden Sie sich zuerst an.';
    } else {
      fehlerMeldung.value = 'Fehler beim Laden der Daten vom Server.';
    }
  } catch (fehler) {
    console.error('Netzwerkfehler:', fehler);
    fehlerMeldung.value = 'Es konnte keine Verbindung zum Server hergestellt werden.';
  } finally {
    istAmLaden.value = false;
  }
};

// Automatischer Aufruf beim Laden der View
onMounted(() => {
  ladeAngeboteVomBackend();
});

// Filter-Logik angepasst an die geladenen Backend-Daten
const filteredAngebote = computed(() => {
  // Wir filtern nun das reaktive Array aus der API statt der statischen Datei
  return backendAngebote.value.filter((angebot) => {
    const matchesCategory =
      !filterStore.category ||
      angebot.kategorie === filterStore.category;

    const matchesStatus =
      !filterStore.status ||
      angebot.status === filterStore.status;

    // Hinweis: erstellungsdatum muss im passenden Format vom Backend kommen
    const matchesPeriod =
      !filterStore.period ||
      angebot.erstellungsdatum === filterStore.period;

    // Da kunde im Backend ein Objekt (Benutzer) ist, greifen wir auf angebot.kunde.benutzername zu
    const matchesCustomer =
      !filterStore.kunde ||
      (angebot.kunde && angebot.kunde.name.toLowerCase().includes(filterStore.kunde.toLowerCase()));
    
    const matchesExpert =
      !filterStore.experte ||
      (angebot.experte && angebot.experte.name.toLowerCase().includes(filterStore.experte.toLowerCase()));

    const matchesRequestId =
      !filterStore.requestId ||
      String(angebot.id).includes(filterStore.requestId);

    return (
      matchesCategory &&
      matchesStatus &&
      matchesPeriod &&
      matchesCustomer &&
      matchesExpert &&
      matchesRequestId
    );
  });
});

function getAngebote() {
  return filteredAngebote.value;
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    <Header text="Angebot Filter" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle :title="'Angebote'" :subtitle="'Gefilterte Angebote'" />
    </div>

    <div v-if="istAmLaden" class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Laden...</span>
      </div>
      <p class="mt-2 text-muted">Anfragen werden geladen...</p>
    </div>

    <div v-else-if="fehlerMeldung" class="container text-center py-5">
      <div class="alert alert-danger mx-auto" style="max-width: 500px;" role="alert">
        {{ fehlerMeldung }}
      </div>
    </div>

    <div v-else-if="getAngebote().length === 0" class="text-center py-5">
      <h4 class="text-muted fw-bold">Keine Angebote zu den gewählten Filtern gefunden.</h4>
    </div>

    <div v-else class="row m-0 px-2 px-md-5 pb-5 g-3 g-md-4">
      <div
        v-for="angebot in getAngebote()"
        :key="angebot.id"
        class="col-12 col-md-4 col-xl-3"
      >
        <AngebotCard :angebot="angebot" />
      </div>
    </div>
  </div>
</template>