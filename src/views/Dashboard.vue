<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';

const router = useRouter();

// --- REAKTIVE VARIABLEN (DEUTSCH) ---
const benutzername = ref('Benutzer');
const benutzerRolle = ref('KUNDE'); // Mögliche Werte: KUNDE, FACHKRAFT, GESCHAEFTSFUEHRER
const anfragenListe = ref([]);
const istAmLaden = ref(true);

// --- BACKEND-DATEN LADEN ---
const ladeDashboardDaten = async () => {
  istAmLaden.value = true;
  try {
    // 1. Aktuellen Benutzer und seine Rolle vom neuen /me Endpunkt abrufen
    const benutzerAntwort = await fetch('http://localhost:8081/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Erforderlich für die HttpSession (JSESSIONID)
    });

    if (benutzerAntwort.ok) {
      const benutzerDaten = await benutzerAntwort.json();
      benutzername.value = benutzerDaten.benutzername;
      benutzerRolle.value = benutzerDaten.rolle; // Setzt die Rolle dynamisch basierend auf der DB
    } else {
      // Wenn der Benutzer nicht eingeloggt ist (401), direkt zum Login weiterleiten
      router.push('/login');
      return;
    }

    // 2. Die dazugehörigen Anfragen für die Liste laden
    const anfragenAntwort = await fetch('http://localhost:8081/api/anfrage', {
      method: 'GET',
      credentials: 'include',
    });

    if (anfragenAntwort.ok) {
      const anfragenDaten = await anfragenAntwort.json();
      // Die neuesten 3 Anfragen für die Vorschau-Box herausschneiden
      anfragenListe.value = anfragenDaten.slice(0, 3);
    }
  } catch (fehler) {
    console.error('Fehler beim Laden der Dashboard-Daten:', fehler);
  } finally {
    istAmLaden.value = false;
  }
};

onMounted(() => {
  ladeDashboardDaten();
});

// --- DYNAMISCHE COMPUTED-PROPERTIES (DEUTSCH) ---

// Dynamischer Begrüßungstext basierend auf der Rolle
const willkommenText = computed(() => {
  if (benutzerRolle.value === 'FACHKRAFT') return 'Hallo Fachkraft';
  if (benutzerRolle.value === 'GESCHAEFTSFUEHRER') return 'Hallo Geschäftsführer';
  return `Hallo ${benutzername.value}`;
});

// Dynamischer Titel für die zentrale Anfragen-Box
const sektionTitel = computed(() => {
  if (benutzerRolle.value === 'KUNDE') return 'Anfragen-Historie';
  return 'Neusten-Anfragen';
});

// Dynamisches Kachel-Menü basierend auf der Benutzerrolle (laut Mockups)
const menueKacheln = computed(() => {
  // Gemeinsame Kacheln für die untere Reihe (immer gleich)
  const einstellungenKachel = { link: '/einstellungen', text: 'Einstellungen', icon: 'gear' };
  const profilKachel = { link: '/profil', text: 'Profil', icon: 'person' };

  if (benutzerRolle.value === 'FACHKRAFT') {
    return [
      { link: '/anfragen-suchen', text: 'Anfragen suchen', icon: 'search' },
      { link: '/eigene-anfragen', text: 'Eigene Anfragen', icon: 'check-circle' },
      einstellungenKachel,
      profilKachel
    ];
  }
  
  if (benutzerRolle.value === 'GESCHAEFTSFUEHRER') {
    return [
      { link: '/anfragen-suchen', text: 'Anfragen suchen', icon: 'search' },
      { link: '/von-fachkraft-bearbeitet', text: 'Von Fachkraft bearbeitet', icon: 'file-earmark-text' },
      einstellungenKachel,
      profilKachel
    ];
  }

  // Standard-Kacheln für Kunden (KUNDE) -> Ahora apunta a tu nuevo paso 1 multinivel
  return [
    { link: '/create-anfrage/schritt-1', text: 'Neue Anfrage', icon: 'plus-circle' },
    { link: '/anfragen', text: 'Auskünfte', icon: 'envelope', badge: 1 },
    einstellungenKachel,
    profilKachel
  ];
});

// --- HILFSFUNKTIONEN FÜR DIE ANZEIGE ---
const getStatusKlasse = (status) => {
  switch (status) {
    case 'IN_ARBEIT': return 'status-arbeit';
    case 'VOLLENDET': return 'status-vollendet';
    case 'OFFEN': return 'status-offen';
    case 'FREIGEGEBEN': return 'status-freigegeben';
    default: return 'status-erstellt';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'IN_ARBEIT': return 'In Arbeit';
    case 'VOLLENDET': return 'Vollendet';
    case 'OFFEN': return 'Offen';
    case 'FREIGEGEBEN': return 'Freigegeben';
    default: return 'Erstellt';
  }
};

const formatiereDatum = (datumString) => {
  if (!datumString) return 'Unbekannt';
  const d = new Date(datumString);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    
    <Header text="Startseite" />
    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
      :title="`Hallo ${benutzername}!`"
      :subtitle="`Schön, dass Sie wieder da sind!`"/>
    </div>

    <div class="px-4 mt-4">
      <div class="historie-box p-3">
        <h5 class="fw-bold mb-3 text-start">{{ sektionTitel }}</h5>

        <div v-if="istAmLaden" class="text-center py-3">
          <div class="spinner-border text-warning spinner-border-sm" role="status"></div>
        </div>

        <div v-else-if="anfragenListe.length === 0" class="text-center py-2 text-muted small">
          Keine Anfragen gefunden.
        </div>

        <div v-else class="d-flex flex-column gap-2">
          <div 
            v-for="anfrage in anfragenListe" 
            :key="anfrage.id" 
            class="historie-item border p-2 d-flex justify-content-between align-items-center"
          >
            <div class="text-start">
              <div class="fw-bold item-title">{{ anfrage.kategorie }} #{{ anfrage.id }}</div>
              <div class="text-muted item-date">Erstellt am {{ formatiereDatum(anfrage.erstellungsdatum) }}</div>
            </div>
            <span class="badge status-badge" :class="getStatusKlasse(anfrage.status)">
              {{ getStatusLabel(anfrage.status) }}
            </span>
          </div>
        </div>

      </div>
    </div>

    <div class="px-4 mt-4">
      <div class="row g-3">
        <div v-for="(kachel, index) in menueKacheln" :key="index" class="col-6">
          <router-link :to="kachel.link" class="text-decoration-none">
            <div class="menu-tile text-center p-3 d-flex flex-column align-items-center justify-content-center">
              <div class="icon-circle mb-2 position-relative">
                
                <svg v-if="kachel.icon === 'search'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>

                <svg v-else-if="kachel.icon === 'check-circle'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                  <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                </svg>

                <svg v-else-if="kachel.icon === 'file-earmark-text'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                  <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                </svg>

                <svg v-if="kachel.icon === 'plus-circle'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>

                <svg v-else-if="kachel.icon === 'envelope'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383z"/>
                </svg>

                <svg v-else-if="kachel.icon === 'gear'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0m4.042-3.176q.444.07.876.217l.291-.16a1.873 1.873 0 0 1 2.693 1.115l.094.319q.246.835 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.292c.415.764-.42 1.6-1.185 1.185l-.292-.16a1.873 1.873 0 0 0-2.693 1.115l-.094.319c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.693-1.115l-.292.16c-.764.415-1.6-.42-1.185-1.185l.16-.292a1.873 1.873 0 0 0-1.115-2.692l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094a1.873 1.873 0 0 0 1.115-2.693l-.16-.292c-.415-.764.42-1.6 1.185-1.185l.292.16a1.873 1.873 0 0 0 2.693-1.115z"/>
                </svg>

                <svg v-else-if="kachel.icon === 'person'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>

                <span v-if="kachel.badge" class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark badge-notification">
                  {{ kachel.badge }}
                </span>
              </div>
              <span class="fw-bold tile-text text-dark">{{ kachel.text }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 430px; 
  border: 1px solid #dee2e6;
}

.dashboard-header {
  background-color: #f0a530;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.logo-img {
  max-height: 110px;
  object-fit: contain;
}

.historie-box {
  border: 1.5px solid #000000;
  border-radius: 18px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
}

.historie-item {
  border: 1.5px solid #000000 !important;
  border-radius: 14px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 2px 2px 0px;
}

.item-title {
  font-size: 0.95rem;
}

.item-date {
  font-size: 0.75rem;
}

.status-badge {
  font-size: 0.8rem;
  padding: 8px 14px;
  border-radius: 12px;
  font-weight: bold;
}
.status-arbeit, .status-offen {
  background-color: #e67e22 !important;
  color: white;
}
.status-vollendet, .status-freigegeben {
  background-color: #616161 !important;
  color: white;
}

.menu-tile {
  background-color: white;
  border: 1.5px solid #000000;
  border-radius: 18px;
  min-height: 125px;
  box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 0px;
  transition: transform 0.1s, box-shadow 0.1s;
  cursor: pointer;
}

.menu-tile:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.tile-text {
  font-size: 0.9rem;
}

.badge-notification {
  font-size: 0.65rem;
  padding: 4px 6px;
  border: 1px solid white;
}
</style>
