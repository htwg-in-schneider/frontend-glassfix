<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Header from '../components/Header.vue';
import LogoAndTitle from '../components/LogoAndTitle.vue';
import Button from '../components/Button.vue';
import { createAnfrageStore } from '@/store/createAnfrageStore';
import { useAuth0 } from '@auth0/auth0-vue';

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const bearerToken = ref('');
const error = ref('');

const route = useRoute();
const router = useRouter();

const anfrage = ref(null);               
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
    const benutzerAntwort = await fetch('http://localhost:8081/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
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
  }
};

// Funktion zum Laden der spezifischen Anfrage anhand der ID aus der URL
const ladeAnfrageDetailVomBackend = async () => {
  try {
    const anfrageId = route.params.id;

    const antwort = await fetch(`http://localhost:8081/api/anfrage/${anfrageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
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

onMounted(async () => {
  await getBenutzerRolle();
  await ladeAnfrageDetailVomBackend();
});

const kundenName = computed(() => {
  return anfrage.value && anfrage.value.kunde
    ? anfrage.value.kunde.name
    : 'Unbekannt';
});
function geheZuBearbeiten() {
  if (anfrage.value) {
    createAnfrageStore.id = anfrage.value.id;
    createAnfrageStore.kategorie = anfrage.value.kategorie;
    
    createAnfrageStore.beschreibung = anfrage.value.beschreibung || '';
    createAnfrageStore.fragen = anfrage.value.fragen || '';
    createAnfrageStore.bildUrl = anfrage.value.bildUrl || '';

    router.push('/create-anfrage/schritt-1');
  } else {
    console.warn("Bearbeiten nicht möglich: Anfragedaten sind noch nicht geladen.");
  }
}

function loescheAnfrage() {
  if (confirm('Sind Sie sicher, dass Sie diese Anfrage löschen möchten?')) {
    fetch(`http://localhost:8081/api/anfrage/${anfrage.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    .then(antwort => {
      if (antwort.ok) {
        alert('Anfrage erfolgreich gelöscht!');
        router.push('/dashboard');
      } else if (antwort.status === 401) {
        alert('Fehler: Sie müssen angemeldet sein, um fortzufahren.');
        router.push('/login');
      } else {
        alert('Ein Fehler ist aufgetreten. Status Code: ' + antwort.status);
      }
    })
    .catch(fehler => {
      console.error('Netzwerkfehler:', fehler);
      alert('Netzwerkfehler: Der Server konnte nicht erreicht werden.');
    });
  }
}

function anfragePruefen(){
  fetch(`http://localhost:8081/api/anfrage/${anfrage.value.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${bearerToken.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...anfrage.value,
      status: 'IN_PRUEFUNG'
      })
    })
  .then(antwort => {
    if (antwort.ok) {
      alert('Anfrage erfolgreich geprüft!');
      router.push(`/dashboard`);
    } else if (antwort.status === 401) {
      alert('Fehler: Sie müssen angemeldet sein, um fortzufahren.');
        router.push('/');
      } else {
        alert('Ein Fehler ist aufgetreten. Status Code: ' + antwort.status);
      }
    })
    .catch(fehler => {
      console.error('Netzwerkfehler:', fehler);
      alert('Netzwerkfehler: Der Server konnte nicht erreicht werden.');
    });
  }
  
  const anfrageAntwort = ref('');
  function antwortAbgeben() {
    if (!anfrageAntwort.value) {
      alert('Bitte geben Sie eine Antwort ein.');
      return;
    }
    fetch(`http://localhost:8081/api/anfrage/${anfrage.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...anfrage.value,
        status: 'PRUEFUNG_ABGESCHLOSSEN',
        antwort: anfrageAntwort.value
      })
    })
    .then(antwort => {
      if (antwort.ok) {
        alert('Antwort erfolgreich abgegeben!');
        router.push('/dashboard');
      } else if (antwort.status === 401) {
        alert('Fehler: Sie müssen angemeldet sein, um fortzufahren.');
        router.push('/login');
      } else {
        alert('Ein Fehler ist aufgetreten. Status Code: ' + antwort.status);
      }
    })
    .catch(fehler => {
      console.error('Netzwerkfehler:', fehler);
      alert('Netzwerkfehler: Der Server konnte nicht erreicht werden.');
    });
  }

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
        <LogoAndTitle :title="`${anfrage.kategorie} #${anfrage.id}`" :subtitle="`Von ${kundenName}`" />
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
          <div v-if="anfrage.antwort" class="mb-4">
            <strong class="mt-4 mb-3">Antwort der Experte:</strong>
            <p>{{ anfrage.antwort }}</p>
          </div>
          <p v-if="anfrage.experte" class="mb-4">
            <strong>Greprüft von:</strong><br>
            {{ anfrage.experte.name }}
          </p>


          <div v-if="anfrage.bildUrl" class="mb-4">
            <strong>Bilder</strong>
            <div class="row mt-2 g-3">
              <div class="col-6">
                <img :src="anfrage.bildUrl" alt="Glas Objekt" class="img-fluid detail-image">
              </div>
            </div>
          </div>
          
        </div>

        

        <div v-if="benutzerRolle === 'FACHKRAFT' && !anfrage.antwort && anfrage.experte && anfrage.experte.id === benutzerId" class="mb-3">
            <label class="form-label fw-bold">Antwort *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B. Tiefer Kratzer auf der Vorderseite..."
              v-model="anfrageAntwort"
            ></textarea>
          </div>
          <div v-if="benutzerRolle === 'FACHKRAFT' && !anfrage.antwort && anfrage.experte && anfrage.experte.id === benutzerId" class="d-flex justify-content-center mt-3">
            <Button :text="'Antwort Abgeben'" :type="'AnfrageCard'" :onClick="antwortAbgeben" />
          </div>

        <div v-if="benutzerRolle === 'KUNDE' && anfrage.status === 'ERSTELLT'" class="d-flex justify-content-center mt-4">
          <Button :text="'Bearbeiten'" :type="'AnfrageCard'" :onClick="geheZuBearbeiten" />
        </div>
        <div v-if="benutzerRolle === 'KUNDE' && anfrage.status === 'ERSTELLT'" class="d-flex justify-content-center mt-4">
          <Button :text="'Löschen'" :type="'default'" :onClick="loescheAnfrage"/>
        </div>
        <div v-if="benutzerRolle === 'FACHKRAFT' && anfrage.status === 'ERSTELLT'" class="d-flex justify-content-center mt-4">
          <Button :text="'Prüfen'" :type="'default'" :onClick="anfragePruefen"/>
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