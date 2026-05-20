<script setup>
import { computed, ref, onMounted } from 'vue';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import AnfrageCard from '@/components/AnfrageCard.vue';

import { useAnfragenFilterStore } from '@/anfragenFilter';

const filterStore = useAnfragenFilterStore();

// --- API INTEGRATION VARIABLES (DEUTSCH) ---
const backendAnfragen = ref([]);         // Speichert die vom Backend geladenen Anfragen
const istAmLaden = ref(true);            // Status-Indikator für den Ladevorgang
const fehlerMeldung = ref('');           // Speichert eventuelle Fehlermeldungen

// Funktion zum Abrufen der Anfragen vom Spring Boot Backend
const ladeAnfragenVomBackend = async () => {
  istAmLaden.value = true;
  fehlerMeldung.value = '';
  
  try {
    // 'credentials: "include"' ist zwingend erforderlich, damit die HttpSession-Cookie (JSESSIONID) übertragen wird
    const antwort = await fetch('http://localhost:8081/api/anfrage', {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Accept': 'application/json'
      }
    });

    if (antwort.ok) {
      const daten = await antwort.json();
      backendAnfragen.value = daten;
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
  ladeAnfragenVomBackend();
});

// Filter-Logik angepasst an die geladenen Backend-Daten
const filteredAnfragen = computed(() => {
  // Wir filtern nun das reaktive Array aus der API statt der statischen Datei
  return backendAnfragen.value.filter((anfrage) => {
    const matchesCategory =
      !filterStore.category ||
      anfrage.kategorie === filterStore.category;

    const matchesStatus =
      !filterStore.status ||
      anfrage.status === filterStore.status;

    // Hinweis: erstellungsdatum muss im passenden Format vom Backend kommen
    const matchesPeriod =
      !filterStore.period ||
      anfrage.erstellungsdatum === filterStore.period;

    // Da kunde im Backend ein Objekt (Benutzer) ist, greifen wir auf anfrage.kunde.benutzername zu
    const matchesCustomer =
      !filterStore.username ||
      (anfrage.kunde && anfrage.kunde.benutzername.toLowerCase().includes(filterStore.username.toLowerCase()));

    const matchesRequestId =
      !filterStore.requestId ||
      String(anfrage.id).includes(filterStore.requestId);

    return (
      matchesCategory &&
      matchesStatus &&
      matchesPeriod &&
      matchesCustomer &&
      matchesRequestId
    );
  });
});

function getAnfragen() {
  return filteredAnfragen.value;
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    <Header text="Filter" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle :title="'Anfragen'" :subtitle="'Gefilterte Kundenanfragen'" />
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

    <div v-else-if="getAnfragen().length === 0" class="text-center py-5">
      <h4 class="text-muted fw-bold">Keine Anfragen zu den gewählten Filtern gefunden.</h4>
    </div>

    <div v-else class="row m-0 px-2 px-md-5 pb-5 g-3 g-md-4">
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