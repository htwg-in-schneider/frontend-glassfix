<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Header from '../components/Header.vue';
import LogoAndTitle from '../components/LogoAndTitle.vue';
import Button from '../components/Button.vue';
import { useAuth0 } from '@auth0/auth0-vue';

import { updateAngebotStore } from '@/store/updateAngebotStore.js'; 
import { zeigeErgebnis } from '@/router/ergebnisNavigation'; 

const angebotStore = updateAngebotStore;
const loeschenBestaetigen = ref(false); 

const baseUrl = 'http://localhost:8081';

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const bearerToken = ref('');

const route = useRoute();
const router = useRouter();

const angebot = ref(null);               
const istAmLaden = ref(true);            
const fehlerMeldung = ref('');           

const benutzerId = ref(null);
const benutzerRolle = ref('');

const getBenutzerRolle = async () => {
  istAmLaden.value = true;
  fehlerMeldung.value = '';
  const token = await getAccessTokenSilently();
  bearerToken.value = token;

    try{
    const benutzerAntwort = await fetch(`${baseUrl}/api/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken.value}`
      }
    });

    if (benutzerAntwort.ok) {
      const benutzerDaten = await benutzerAntwort.json();
      benutzerRolle.value = benutzerDaten.rolle; 
      benutzerId.value = benutzerDaten.id;
    } else {
      console.warn('Das Backend hat den Token abgelehnt (401). Leite weiter auf /');
      router.push('/');
      return;
    }
  } catch (fehler) {
      console.error('Netzwerkfehler beim Abrufen der Benutzerrolle:', fehler);
      router.push('/');
      return;
  } finally {
    istAmLaden.value = false;
  }
};

const ladeAngebotDetailVomBackend = async () => {
  try {
    const anfrageId = route.params.id;

    const antwort = await fetch(`${baseUrl}/api/auskunft/anfrage/${anfrageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      }
    });

    if (antwort.ok) {
      const daten = await antwort.json();
      angebot.value = daten;
    } else if (antwort.status === 401) {
      fehlerMeldung.value = 'Nicht autorisiert. Bitte melden Sie sich zuerst an.';
    } else if (antwort.status === 403) {
      fehlerMeldung.value = 'Zugriff verweigert. Sie dürfen diese Anfrage nicht einsehen.';
    } else if (antwort.status === 404) {
      fehlerMeldung.value = 'Die gesuchte Angebot existiert nicht.';
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

onMounted(async () => {
  await getBenutzerRolle();
  await ladeAngebotDetailVomBackend();
});

const kundenName = computed(() => {
  return angebot.value && angebot.value.anfrage.kunde
    ? angebot.value.anfrage.kunde.name
    : 'Unbekannt';
});


function loescheAngebot() {
  loeschenBestaetigen.value = true; 
}

function abbrechenLoeschen() {
  loeschenBestaetigen.value = false; 
}

function loeschenBestaetigenUndAusfuehren() {
  fetch(`http://localhost:8081/api/auskunft/anfrage/${angebot.value.anfrage.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${bearerToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  .then(antwort => {
    if (antwort.ok) {
      zeigeErgebnis(router, true, 'Angebot erfolgreich gelöscht!', '/dashboard'); 
    } else if (antwort.status === 401) {
      zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/login'); 
    } else {
      zeigeErgebnis(router, false, 'Ein Fehler ist aufgetreten. Status Code: ' + antwort.status, `/angebot/${route.params.id}`); 
    }
  })
  .catch(fehler => {
    console.error('Netzwerkfehler:', fehler);
    zeigeErgebnis(router, false, 'Netzwerkfehler: Der Server konnte nicht erreicht werden.', `/angebot/${route.params.id}`); 
  });
}

async function updateAngebot(){
  if(isAuthenticated.value){
        try{
            const dataPayload = benutzerRolle === 'GESCHAEFTSFUEHRER' ? {
                preis: angebotStore.preis,
                istFreigegeben: true
            } : {
              reparaturEmpfehlung: angebotStore.reparaturEmpfehlung,
                zeitEinschaetzung: angebotStore.zeitEinschaetzung,
                arbeitsschritte: angebotStore.arbeitsschritte
              };

            const response = await fetch(`${baseUrl}/api/auskunft/anfrage/${angebot.value.anfrage.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${bearerToken.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPayload)
            })

            if(response.ok){
                zeigeErgebnis(router, true, 'Angebot erfolgreich aktualisiert!', '/dashboard'); 
                return; 
            } else{
                if (response.status === 401) {
                    zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/login'); 
                } else {
                    zeigeErgebnis(router, false, 'Ein Fehler ist aufgetreten. Status Code: ' + response.status, `/angebot/${route.params.id}`); 
                }
                return; 
            }
        } catch (e){
            console.warn('Could not get token:', e)
            zeigeErgebnis(router, false, 'Netzwerkfehler: Der Server konnte nicht erreicht werden.', `/angebot/${route.params.id}`); 
        }
    }
}

async function sendToAdmin(){
  if(isAuthenticated.value){
        try{
            const dataPayload = {
                reparaturEmpfehlung: angebotStore.reparaturEmpfehlung,
                zeitEinschaetzung: angebotStore.zeitEinschaetzung,
                arbeitsschritte: angebotStore.arbeitsschritte,
                vonExperteBearbeitet: true
              };

            const response = await fetch(`${baseUrl}/api/auskunft/anfrage/${angebot.value.anfrage.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${bearerToken.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPayload)
            })

            if(response.ok){
                angebotStore.reset();
                zeigeErgebnis(router, true, 'Angebot erfolgreich an Admin gesendet!', '/dashboard'); 
                return; 
            } else{
                if (response.status === 401) {
                    zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/login'); 
                } else {
                    zeigeErgebnis(router, false, 'Ein Fehler ist aufgetreten. Status Code: ' + response.status, `/angebot/${route.params.id}`); 
                }
                return;
            }
        } catch (e){
            console.error('Netzwerkfehler beim Senden an Admin:', e);
            console.warn('Could not get token:', e)
            zeigeErgebnis(router, false, 'Netzwerkfehler: Der Server konnte nicht erreicht werden.', `/angebot/${route.params.id}`); 
        }
    }
}

const readyToSendKunde = computed(() => {
  const hasPreis = angebotStore.preis?.trim() !== '';
  return hasPreis && !angebot.value?.istFreigegeben;
})

const readyToSend = computed(() =>{
  const hasZeiteinschaetzung = angebotStore.zeitEinschaetzung?.trim() !== '';
  const hasReparaturEmpfehlung = angebotStore.reparaturEmpfehlung?.trim() !== '';
  const hasArbeitsschritte = angebotStore.arbeitsschritte.length > 0;

  return !angebot.value?.istFreigegeben && hasReparaturEmpfehlung && hasZeiteinschaetzung && hasArbeitsschritte;
})

const readyToUpdate = computed(() =>{
  const hasZeiteinschaetzung = angebotStore.zeitEinschaetzung?.trim() !== '';
  const hasReparaturEmpfehlung = angebotStore.reparaturEmpfehlung?.trim() !== '';
  const hasArbeitsschritte = angebotStore.arbeitsschritte.length > 0;

  return (hasReparaturEmpfehlung || hasZeiteinschaetzung || hasArbeitsschritte) && !angebot.vlaue?.istFreigegeben;
})




</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    <Header text="Angebote" />

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

    <div v-else-if="angebot">
      <div class="row m-0 text-center justify-content-center pt-4">
        <LogoAndTitle :title="`${angebot.anfrage.kategorie} #${angebot.id}`" :subtitle="`Von ${kundenName}`" />
      </div>

      <section class="px-4 pb-5">
        <div class="detail-box mx-auto p-3">
          <p class="mb-4">
            <strong>Kategorie:</strong><br>
            {{ angebot.anfrage.kategorie }}
          </p>
          <p class="mb-4">
            <strong>Status:</strong><br>
            <span class="badge bg-secondary">{{ angebot.status }}</span>
          </p>

          <p class="mb-4">
            <strong>Erstellungsdatum:</strong><br>
            {{ angebot.erstellungsdatum.substring(0, 10) || 'Nicht angegeben' }}
          </p>

          <div v-if="!angebot.vonExperteBearbeitet && benutzerRolle === 'FACHKRAFT'" class="mb-3">
            <label class="form-label fw-bold">Reparaturempfehlung: *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="Reparaturempfehlung eingeben..."
              v-model="angebotStore.reparaturEmpfehlung"
            ></textarea>
          </div>

          <p v-else-if="angebot.vonExperteBearbeitet" class="mb-4">
            <strong>Reparaturempfehlung:</strong><br>
            {{ angebot.reparaturEmpfehlung }}
          </p>

          <div v-if="!angebot.vonExperteBearbeitet && benutzerRolle === 'FACHKRAFT'" class="mb-3">
            <label class="form-label fw-bold">Zeiterfassung: *</label>
            <textarea 
              class="form-control custom-input" 
              rows="1"
              placeholder="Arbeitsstunden..."
              v-model="angebotStore.zeitEinschaetzung"
            ></textarea>
          </div>

          

          <p v-else-if="angebot.vonExperteBearbeitet" class="mb-4">
            <strong>Zeiterfassung:</strong><br>
            {{ angebot.zeitEinschaetzung }}
          </p>

          <div v-if="!angebot.vonExperteBearbeitet && benutzerRolle == 'FACHKRAFT'" class="mb-3">
            <label class="form-label fw-bold">Arbeitsschritte wählen: *</label>
            
            <div class="p-3 border rounded bg-light custom-checkbox-list" style="max-height: 200px; overflow-y: auto;">
              
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" value="Sägen" id="step1" v-model="angebotStore.arbeitsschritte">
                <label class="form-check-label" for="step1">Sägen</label>
              </div>
              
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" value="Absprengen" id="step2" v-model="angebotStore.arbeitsschritte">
                <label class="form-check-label" for="step2">Absprengen</label>
              </div>
              
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" value="Schleifen" id="step3" v-model="angebotStore.arbeitsschritte">
                <label class="form-check-label" for="step3">Schleifen</label>
              </div>
              
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" value="Polieren" id="step4" v-model="angebotStore.arbeitsschritte">
                <label class="form-check-label" for="step4">Polieren</label>
              </div>

            </div>
          </div>
          <p v-if="angebot.vonExperteBearbeitet" class="mb-4">
            <strong>Arbeitsschritte:</strong><br>
            <span 
              v-for="schritt in angebot.arbeitsschritte" 
              :key="schritt" 
              class="badge bg-secondary me-1"
            >
              {{ schritt }}
            </span>
          </p>

          
          <div v-if="benutzerRolle === 'FACHKRAFT'" class="d-flex justify-content-between align-items-center mb-4">
              <div v-if="readyToUpdate" class="d-flex justify-content-center ">
                <Button :text="'Speichern'" :type="'default'" :onClick="updateAngebot" />
              </div>
              <div v-if="readyToSend" class="d-flex justify-content-center">
                <Button :text="'Senden'" :type="'default'" :onClick="sendToAdmin" />
              </div>
          </div>
          
          <div v-if="!angebot.istFreigegeben && angebot.vonExperteBearbeitet && benutzerRolle === 'GESCHAEFTSFUEHRER'" class="mb-3">
            <label class="form-label fw-bold">Preis: *</label>
            <textarea 
              class="form-control custom-input" 
              rows="1"
              placeholder="Preis der Reparatur..."
              v-model="angebotStore.preis"
            ></textarea>
          </div>

          

          <p v-else-if="angebot.istFreigegeben" class="mb-4">
            <strong>Preis:</strong><br>
            {{ angebot.preis }}
          </p>

          <div class="d-flex justify-content-between align-items-center mb-4">
              <div v-if="readyToSendKunde && benutzerRolle === 'GESHAEFTSFUEHRER'" class="d-flex justify-content-center ">
                <Button :text="'Freigeben'" :type="'default'" :onClick="angebotFreigeben" />
              </div>
              <div v-if="!angebot.istFreigegeben && benutzerRolle === 'GESHAEFTSFUEHRER'" class="d-flex justify-content-center">
                <Button :text="'Senden'" :type="'default'" :onClick="sendToAdmin" />
              </div>
          </div>

          

          <p v-if="angebot.anfrage.experte" class="mb-4">
            <strong>Greprüft von:</strong><br>
            {{ angebot.anfrage.experte.name }}
          </p>
          

          <div v-if="angebot.anfrage.bildUrl" class="mb-4">
            <strong>Bilder</strong>
            <div class="row mt-2 g-3">
              <div class="col-6">
                <img :src="angebot.anfrage.bildUrl" alt="Glas Objekt" class="img-fluid detail-image">
              </div>
            </div>
          </div>
          
        </div>

        <div v-if="loeschenBestaetigen" class="delete-confirmation mx-auto mt-3 p-3 text-center">
          <p class="fw-bold mb-3">Angebot wirklich löschen?</p>
          <div class="d-flex justify-content-center gap-3">
            <Button :text="'Abbrechen'" :type="'default'" :onClick="abbrechenLoeschen" />
            <Button :text="'Endgültig löschen'" :type="'default'" :onClick="loeschenBestaetigenUndAusfuehren" />
          </div>
        </div> <!-- GEÄNDERT: eigene Bestätigungsbox wie in AnfrageDetail.vue ergänzt -->
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