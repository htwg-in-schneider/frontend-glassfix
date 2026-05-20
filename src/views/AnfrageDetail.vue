<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import Header from '../components/Header.vue';
import LogoAndTitle from '../components/LogoAndTitle.vue';
import Button from '../components/Button.vue';

const route = useRoute();

// --- API INTEGRATION VARIABLES (DEUTSCH) ---
const anfrage = ref(null);               // Speichert die geladene Anfrage vom Backend
const istAmLaden = ref(true);            // Status-Indikator für den Ladevorgang
const fehlerMeldung = ref('');           // Speichert Fehlermeldungen bei Fehlschlägen

// Funktion zum Laden der spezifischen Anfrage anhand der ID aus der URL
const ladeAnfrageDetailVomBackend = async () => {
  istAmLaden.value = true;
  fehlerMeldung.value = '';
  
  try {
    const anfrageId = route.params.id;
    
    // Anfrage an den Endpunkt '/api/anfrage/{id}' mit aktivierten Session-Credentials
    const antwort = await fetch(`http://localhost:8081/api/anfrage/${anfrageId}`, {
      method: 'GET',
      credentials: 'include', // Sendet das JSESSIONID-Cookie mit
      headers: {
        'Accept': 'application/json'
      }
    });

    if (antwort.ok) {
      const daten = await antwort.json();
      anfrage.value = daten;
    } else if (antwort.status === 401) {
      fehlerMeldung.value = 'Nicht autorisiert. Bitte melden Sie sich zuerst an.';
    } else if (antwort.status === 403) {
      fehlerMeldung.value = 'Zugriff verweigert. Sie dürfen diese Anfrage nicht einsehen.';
    } else if (antwort.status === 404) {
      fehlerMeldung.value = 'Die gesuchte Anfrage existiert nicht.';
    } else {
      fehlerMeldung.value = 'Fehler beim Laden der Anfragedetails.';
    }
  } catch (fehler) {
    console.error('Netzwerkfehler:', fehler);
    fehlerMeldung.value = 'Es konnte keine Verbindung zum Server hergestellt werden.';
  } finally {
    istAmLaden.value = false;
  }
};

// Automatischer Aufruf, wenn die Detailseite geöffnet wird
onMounted(() => {
  ladeAnfrageDetailVomBackend();
});

// Da 'kunde' im Backend ein Benutzer-Objekt ist, lesen wir dynamisch den Benutzernamen aus
const kundenName = computed(() => {
  return anfrage.value && anfrage.value.kunde 
    ? anfrage.value.kunde.benutzername 
    : 'Unbekannt';
});
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    <Header text="Anfragen" />

    <div v-if="istAmLaden" class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Laden...</span>
      </div>
      <p class="mt-2 text-muted">Details werden geladen...</p>
    </div>

    <div v-else-if="fehlerMeldung" class="container text-center py-5">
      <div class="alert alert-danger mx-auto" style="max-width: 500px;" role="alert">
        {{ fehlerMeldung }}
      </div>
      <router-link to="/" class="text-decoration-none mt-3 d-inline-block">
        <Button :text="'Zurück zur Übersicht'" :type="'AnfrageCard'" />
      </router-link>
    </div>

    <div v-else-if="anfrage">
      <div class="row m-0 text-center justify-content-center pt-4">
        <LogoAndTitle
          :title="`${anfrage.kategorie} #${anfrage.id}`"
          :subtitle="`Von ${kundenName}`"
        />
      </div>

      <section class="px-4 pb-5">
        <div class="detail-box mx-auto p-3">
          <p class="mb-4">
            <strong>Kategorie:</strong><br>
            {{ anfrage.kategorie }}
          </p>

          <p class="mb-4">
            <strong>Status:</strong><br>
            <span class="badge bg-secondary">{{ anfrage.status }}</span>
          </p>

          <p class="mb-4">
            <strong>Erstellungsdatum:</strong><br>
            {{ anfrage.erstellungsdatum.substring(0, 10) || 'Nicht angegeben' }}
          </p>

          <p class="mb-4">
            <strong>Beschreibung</strong><br>
            {{ anfrage.beschreibung }}
          </p>

          <p class="mb-4">
            <strong>Fragen (optional)</strong><br>
            <span class="fragen-text">{{ anfrage.fragen || 'Keine Fragen hinterlegt.' }}</span>
          </p>

          <div v-if="anfrage.bildUrl" class="mb-4">
            <strong>Bilder</strong>
            <div class="row mt-2 g-3">
              <div class="col-6">
                <img
                  :src="anfrage.bildUrl"
                  alt="Glas Objekt"
                  class="img-fluid detail-image"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center mt-4">
          <Button :text="'Auskunft erstellen'" :type="'AnfrageCard'" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.detail-box {
  max-width: 520px;
  border: 2px solid #000000;
  border-radius: 15px;
  background-color: white;
  box-shadow: #00000048 4px 4px 0px;
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