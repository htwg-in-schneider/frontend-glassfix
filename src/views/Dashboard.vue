<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';

const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const bearerToken = ref('');

const router = useRouter();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const benutzername = ref('Benutzer');
const benutzerRolle = ref('KUNDE'); 
const anfragenListe = ref([]);
const istAmLaden = ref(true);

const ladeDashboardDaten = async () => {
  istAmLaden.value = true;
  
  try { 
    const token = await getAccessTokenSilently();
    bearerToken.value = token;

    const benutzerAntwort = await fetch(`${baseUrl}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      }
    });

    if (benutzerAntwort.ok) {
      const benutzerDaten = await benutzerAntwort.json();
      benutzername.value = benutzerDaten.name?.trim() || 'Benutzer';
      benutzerRolle.value = benutzerDaten.rolle; 
    } else {
      console.warn('Das Backend hat den Token abgelehnt (401). Leite weiter auf /');
      router.push('/');
      return;
    }

    // 3. Cargar la lista de consultas (Anfragen)
    const anfragenAntwort = await fetch(`${baseUrl}/api/anfrage`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken.value}`,
        'Content-Type': 'application/json'
      }
    });

    if (anfragenAntwort.ok) {
      const anfragenDaten = await anfragenAntwort.json();
      anfragenListe.value = anfragenDaten.slice(0, 3);
    }
  } catch (fehler) {
    console.error('Fehler beim Laden der Dashboard-Daten:', fehler);
    router.push('/');
  } finally {
    istAmLaden.value = false;
  }
};

watch([isLoading, isAuthenticated], ([newLoading, newAuth]) => {
  if (newLoading) return;

  if (!newAuth) {
    console.warn("Benutzer ist nicht eingeloggt. Leite weiter auf '/'");
    router.push('/');
  } else {
    ladeDashboardDaten();
  }
}, { immediate: true });

// Dynamischer Begrüßungstext basierend auf der Rolle
const willkommenText = computed(() => {
  return `Hallo ${benutzername.value || 'Benutzer'}`;
});

// Dynamischer Titel für die zentrale Anfragen-Box
const sektionTitel = computed(() => {
  if (benutzerRolle.value === 'KUNDE' || benutzerRolle === 'ADMIN') return 'Anfragen-Historie';
  return 'Neusten-Anfragen';
});

// Dynamisches Kachel-Menü basierend auf der Benutzerrolle
const menueKacheln = computed(() => {
  const einstellungenKachel = { link: '/kontoeinstellungen', text: 'Einstellungen', icon: '⚙️' };

  if (benutzerRolle.value === 'FACHKRAFT') {
    return [
      { link: '/filter', text: 'Anfragen suchen', icon: '🔎' },
      { link: '/angebot-filter', text: 'Angebote', icon: '✉️' },
      einstellungenKachel
    ];
  }

  if (benutzerRolle.value === 'GESCHAEFTSFUEHRER') {
    return [
      { link: '/filter', text: 'Anfragen suchen', icon: '🔎' },
      { link: '/angebot-filter', text: 'Angebote verwalten', icon: '✉️' },
      einstellungenKachel
    ];
  }

  if (benutzerRolle.value === 'ADMIN') {
    return [
      { link: '/create-anfrage/schritt-1', text: 'Neue Anfrage', icon: '➕' },
      { link: '/filter', text: 'Anfragen verwalten', icon: '🔎' },
      { link: '/angebot-filter', text: 'Angebote verwalten', icon: '✉️' },
      { link: '/admin/benutzer', text: 'Nutzer verwalten', icon: '👤' },
      { link: '/admin/kategorien', text: 'Kategorien verwalten', icon: '📄' },
      einstellungenKachel
    ];
  }

  return [
    { link: '/create-anfrage/schritt-1', text: 'Neue Anfrage', icon: '➕' },
    { link: '/filter', text: 'Anfragen suchen', icon: '🔎' },
    { link: '/angebot-filter', text: 'Angebote', icon: '✉️' },
    einstellungenKachel
  ];
});


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
      :title="willkommenText"
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
            <router-link :to="`/anfrage/${anfrage.id}`" class="nav-link btn costum-pill-cta p-2">
              {{ anfrage.status }}
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <div class="px-4 mt-4 pb-5">
      <div class="row g-3">
        <div v-for="(kachel, index) in menueKacheln" :key="index" class="col-6">
          <router-link :to="kachel.link" class="text-decoration-none">
            <div class="menu-tile text-center p-3 d-flex flex-column align-items-center justify-content-center">
              <div class="icon-circle mb-2 tile-icon">
                {{ kachel.icon }}
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
