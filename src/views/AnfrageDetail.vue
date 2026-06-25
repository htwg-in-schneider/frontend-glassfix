<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Header from '../components/Header.vue';
import LogoAndTitle from '../components/LogoAndTitle.vue';
import Button from '../components/Button.vue';
import { createAnfrageStore } from '@/store/createAnfrageStore';
import { useAuth0 } from '@auth0/auth0-vue';

import { zeigeErgebnis } from '@/router/ergebnisNavigation';

const loeschenBestaetigen = ref(false);
const viteBaseUrl = import.meta.env.BASE_URL;

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
    const benutzerAntwort = await fetch('http://localhost:8081/api/profile', {
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

function bestaetigen(){
  loeschenBestaetigen.value = true;
}

function abbrechenLoeschen(){
  loeschenBestaetigen.value = false;
}

function loeschenBestaetigenUndAusfuehren() {
    fetch(`http://localhost:8081/api/anfrage/${anfrage.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    .then(antwort => {
      if (antwort.ok) {
        zeigeErgebnis(router, true, 'Anfrage erfolgreich gelöscht!', '/dashboard');
      } else if (antwort.status === 401) {
        zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/');
      } else {
        zeigeErgebnis(router, false, 'Ein Fehler ist aufgetreten. Status Code: ' + antwort.status, `/anfrage/${anfrage.value.id}`);
      }
    })
    .catch(fehler => {
      console.error('Netzwerkfehler:', fehler);
      zeigeErgebnis(router, false, 'Netzwerkfehler: Der Server konnte nicht erreicht werden.', `/anfrage/${anfrage.value.id}`);
    });
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
      zeigeErgebnis(router, true, 'Anfrage erfolgreich geprüft', '/dashboard');
    } else if (antwort.status === 401) {
      zeigeErgebnis(router, false, 'Sie müssen angemeldet sein', '/')
      } else {
        zeigeErgebnis(router, false, 'Fehler aufgetreten. Status Code:' + antwort.status, `/anfrage/${anfrage.value.id}`);
      }
    })
    .catch(fehler => {
      console.error('Netzwerkfehler:', fehler);
      zeigeErgebnis(router, false, 'Netzwerk Fehler', `/anfrage/${anfrage.value.id}`);
    });
  }
  
  const anfrageAntwort = ref('');
  function antwortAbgeben() {
    if (!anfrageAntwort.value) {
      zeigeErgebnis(router, false, 'Bitte geben Sie eine Antwort ein.', `/anfrage/${anfrage.value.id}`);
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
        zeigeErgebnis(router, true, 'Antwort erfolgreich abgegeben!', '/dashboard');
      } else if (antwort.status === 401) {
        zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/');
      } else {
        zeigeErgebnis(router, false, 'Fehler aufgetreten!', `/anfrage/${anfrage.value.id}`);
      }
    })
    .catch(fehler => {
      console.error('Netzwerkfehler:', fehler);
      zeigeErgebnis(router, false, ' Netzwerk Fehler!', `/anfrage/${anfrage.value.id}`);
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
            <strong class="d-block mb-2">Bilder</strong>
            <div class="row m-0">
              <div class="col-12 p-0">
                <div class="detail-image-wrapper d-flex justify-content-center align-items-center p-2">
                  <img 
                    :src="`${viteBaseUrl}${anfrage.bildUrl.replace(/^\//, '')}`" 
                    alt="Glas Objekt" 
                    class="img-fluid detail-image-contain"
                  >
                </div>
              </div>
            </div>
          </div>
          
        </div>

        

        <div v-if="(benutzerRolle === 'FACHKRAFT') && !anfrage.antwort && anfrage.experte && anfrage.experte.id === benutzerId || benutzerRolle === 'ADMIN' && anfrage.status === 'IN_PRUEFUNG'" class="mb-3">
            <label class="form-label fw-bold">Antwort *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B. Tiefer Kratzer auf der Vorderseite..."
              v-model="anfrageAntwort"
            ></textarea>
          </div>
          <div v-if="benutzerRolle === 'FACHKRAFT' && !anfrage.antwort && anfrage.experte && anfrage.experte.id === benutzerId || benutzerRolle === 'ADMIN' && anfrage.status === 'IN_PRUEFUNG'" class="d-flex justify-content-center mt-3">
            <Button :text="'Antwort Abgeben'" :type="'AnfrageCard'" :onClick="antwortAbgeben" />
          </div>

        <div v-if="(benutzerRolle === 'KUNDE' || benutzerRolle === 'ADMIN') && anfrage.status === 'ERSTELLT'" class="d-flex justify-content-center mt-4">
          <Button :text="'Bearbeiten'" :type="'AnfrageCard'" :onClick="geheZuBearbeiten" />
        </div>
        <div v-if="(benutzerRolle === 'KUNDE' || benutzerRolle === 'ADMIN') && anfrage.status === 'ERSTELLT'" class="d-flex justify-content-center mt-4">
          <Button :text="'Löschen'" :type="'default'" :onClick="bestaetigen"/>
        </div>
        <div v-if="(benutzerRolle === 'FACHKRAFT' || benutzerRolle === 'ADMIN') && anfrage.status === 'ERSTELLT'" class="d-flex justify-content-center mt-4">
          <Button :text="'Prüfen'" :type="'default'" :onClick="anfragePruefen"/>
        </div>
        <div v-if="loeschenBestaetigen" class="delete-confirmation mx-auto mt-3 p-3 text-center">
        <p class="fw-bold mb-3">Anfrage wirklich löschen?</p>
        <div class="d-flex justify-content-center gap-3">
          <Button :text="'Abbrechen'" :type="'default'" :onClick="abbrechenLoeschen" />
          <Button :text="'Endgültig löschen'" :type="'default'" :onClick="loeschenBestaetigenUndAusfuehren" />
        </div>
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
/* Contenedor tipo marco para la imagen de detalles */
.detail-image-wrapper {
  width: 100%;
  height: 220px; /* Altura fija en móviles */
  border: 2px solid #000000;
  border-radius: 12px;
  background-color: #f8f9fa; /* Fondo gris claro neutral */
  overflow: hidden;
}

/* La imagen se adaptará al 100% del marco sin perder su proporción ni cortarse */
.detail-image-contain {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Encaja la imagen completa dentro del recuadro */
  border-radius: 8px;
}

/* Ajuste responsivo para pantallas medianas y de escritorio */
@media (min-width: 768px) {
  .detail-image-wrapper {
    height: 320px; /* Más espacio en pantallas grandes para apreciar el daño del cristal */
  }
}
</style>