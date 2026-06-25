<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { createAnfrageStore } from '@/store/createAnfrageStore';
import { useAuth0 } from '@auth0/auth0-vue';
import { zeigeErgebnis } from '@/router/ergebnisNavigation';

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const bearerToken = ref('');
const error = ref('');

const router = useRouter();
const istAmSpeichern = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const seitenTitel = computed(() => {
  return createAnfrageStore.id ? 'Anfrage bearbeiten' : 'Zusammenfassung (3/3)';
});

const seitenUntertitel = computed(() => {
  return createAnfrageStore.id 
    ? 'Überprüfen Sie Ihre Änderungen vor dem Speichern' 
    : 'Prüfen Sie Ihre Angaben vor dem Absenden';
});

function zurueckZuSchritt2() {
  router.push('/create-anfrage/schritt-2');
}

async function speichereAnfrage() {
  istAmSpeichern.value = true;
  const token = await getAccessTokenSilently();
  bearerToken.value = token;
  
  const anfragePayload = {
    kategorie: createAnfrageStore.kategorie,
    beschreibung: createAnfrageStore.beschreibung,
    fragen: createAnfrageStore.fragen,
    bildUrl: createAnfrageStore.bildUrl
  };

  const istEditModus = createAnfrageStore.id !== null && createAnfrageStore.id !== undefined;

  const url = istEditModus 
    ? `${baseUrl}/api/anfrage/${createAnfrageStore.id}` 
    : `${baseUrl}/api/anfrage`;
  
  const HTTPMethode = istEditModus ? 'PUT' : 'POST';

  try {
    const antwort = await fetch(url, {
      method: HTTPMethode,
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(anfragePayload),
      credentials: 'include' 
    });

    if (antwort.ok) {
      const erfolgsMeldung = istEditModus
        ? 'Anfrage erfolgreich aktualisiert!'
        : 'Anfrage erfolgreich erstellt!';

      createAnfrageStore.reset();

      zeigeErgebnis(router, true, erfolgsMeldung, '/dashboard');
      return;
    } else {
      if (antwort.status === 401) {
        zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/login');
      } else {
        zeigeErgebnis(router, false, 'Ein Fehler ist aufgetreten. Status Code: ' + antwort.status, '/create-anfrage/schritt-3');
      }

      return;
    }
  } catch (fehler) {
    console.error('Verbindungsfehler zum Backend:', fehler);
    zeigeErgebnis(router, false, 'Netzwerkfehler: Der Server konnte nicht erreicht werden.', '/create-anfrage/schritt-3');
  } finally {
    istAmSpeichern.value = false;
  }
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle 
        :title="seitenTitel" 
        :subtitle="seitenUntertitel" 
      />
    </div>

    <div class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-sm-8 col-md-5 col-lg-4">
        <div class="filter-card p-3">
          
          <div class="zusammenfassung-box p-2 mb-4">
            
            <div class="mb-3">
              <span class="fw-bold d-block text-dark small">Kategorie:</span>
              <div class="custom-data-box mt-1">{{ createAnfrageStore.kategorie }}</div>
            </div>

            <div class="mb-3">
              <span class="fw-bold d-block text-dark small">Beschreibung des Schadens:</span>
              <div class="custom-data-box mt-1 text-break">{{ createAnfrageStore.beschreibung }}</div>
            </div>

            <div class="mb-3">
              <span class="fw-bold d-block text-dark small">Fragen / Anmerkungen:</span>
              <div class="custom-data-box mt-1 text-break">{{ createAnfrageStore.fragen }}</div>
            </div>

            <div class="mb-1">
              <span class="fw-bold d-block text-dark small">Bild URL / Pfad:</span>
              <div class="custom-data-box mt-1 text-break text-muted font-monospace small">
                {{ createAnfrageStore.bildUrl || 'Kein Bild angegeben' }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-4">
            <Button 
              :text="'Zurück'" 
              :type="'default'" 
              :onClick="zurueckZuSchritt2" 
              :disabled="istAmSpeichern" 
            />
            
            <button 
              @click="speichereAnfrage" 
              class="btn submit-comic-btn fw-bold d-flex align-items-center justify-content-center"
              :disabled="istAmSpeichern"
            >
              <span v-if="istAmSpeichern" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ istAmSpeichern ? 'Speichert...' : (createAnfrageStore.id ? 'Speichern' : 'Absenden') }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anfragen-filter-view {
  margin: 0 auto;
  border: 1px solid #dee2e6;
}

.filter-card {
  border: 2px solid #000000;
  border-radius: 15px;
  background-color: white;
  box-shadow: #00000048 4px 4px 0px;
}

.zusammenfassung-box {
  background-color: #fafafa;
  border-radius: 8px;
}


.custom-data-box {
  border: 2px solid #000000;
  background-color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  color: #212529;
}


.submit-comic-btn {
  background-color: #ffffff;
  border: 2px solid #000000;
  border-radius: 25px;
  padding: 6px 24px;
  font-size: 1rem;
  box-shadow: #000000 2px 2px 0px;
  transition: transform 0.1s, box-shadow 0.1s;
}

.submit-comic-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.submit-comic-btn:disabled {
  background-color: #e0e0e0;
  border-color: #666666;
  color: #666666;
  cursor: not-allowed;
  box-shadow: none;
}
</style>