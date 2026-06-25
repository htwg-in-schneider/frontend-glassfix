<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // GEÄNDERT: Router ergänzt, damit wir zur ErgebnisView weiterleiten können
import { useAuth0 } from '@auth0/auth0-vue';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { zeigeErgebnis } from '@/router/ergebnisNavigation'; // GEÄNDERT: zentrale ErgebnisView statt alert/confirm

const router = useRouter(); // GEÄNDERT: Router-Instanz für zeigeErgebnis
const { getAccessTokenSilently } = useAuth0();

const kategorien = ref([]);
const suche = ref('');
const neueKategorie = ref({
  name: '',
  beschreibung: ''
});

const fehlerMeldung = ref('');
const istAmLaden = ref(true);

// GEÄNDERT: Diese beiden refs ersetzen das frühere confirm()-Popup
const loeschenBestaetigen = ref(false);
const kategorieZumLoeschen = ref(null);

const baseUrl = 'http://localhost:8081';

async function ladeKategorien() {
  istAmLaden.value = true;
  fehlerMeldung.value = '';

  try {
    const suchParameter = suche.value.trim()
      ? `?suche=${encodeURIComponent(suche.value.trim())}`
      : '';

    const response = await fetch(`${baseUrl}/api/kategorien${suchParameter}`);

    if (!response.ok) {
      fehlerMeldung.value = `Kategorien konnten nicht geladen werden. Status: ${response.status}`;
      return;
    }

    kategorien.value = await response.json();
  } catch (error) {
    fehlerMeldung.value = 'Netzwerkfehler beim Laden der Kategorien.';
  } finally {
    istAmLaden.value = false;
  }
}

async function erstelleKategorie() {
  fehlerMeldung.value = '';

  if (!neueKategorie.value.name.trim()) {
    // GEÄNDERT: Fehlermeldung läuft über ErgebnisView statt über lokalen Text/Popup
    zeigeErgebnis(
      router,
      false,
      'Der Kategoriename darf nicht leer sein.',
      '/admin/kategorien'
    );
    return;
  }

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${baseUrl}/api/kategorien`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(neueKategorie.value)
    });

    if (response.ok) {
      neueKategorie.value = {
        name: '',
        beschreibung: ''
      };

      // GEÄNDERT: Erfolgsmeldung über ErgebnisView
      zeigeErgebnis(
        router,
        true,
        'Kategorie wurde erfolgreich erstellt.',
        '/admin/kategorien'
      );
      return;
    }

    // GEÄNDERT: Fehlermeldung über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      `Kategorie konnte nicht erstellt werden. Status: ${response.status}`,
      '/admin/kategorien'
    );
  } catch (error) {
    // GEÄNDERT: Netzwerkfehler über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      'Netzwerkfehler beim Erstellen der Kategorie.',
      '/admin/kategorien'
    );
  }
}

async function speichereKategorie(kategorie) {
  fehlerMeldung.value = '';

  if (!kategorie.name || !kategorie.name.trim()) {
    // GEÄNDERT: Fehlermeldung über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      'Der Kategoriename darf nicht leer sein.',
      '/admin/kategorien'
    );
    return;
  }

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${baseUrl}/api/kategorien/${kategorie.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: kategorie.name,
        beschreibung: kategorie.beschreibung
      })
    });

    if (response.ok) {
      // GEÄNDERT: Erfolgsmeldung über ErgebnisView
      zeigeErgebnis(
        router,
        true,
        'Kategorie wurde erfolgreich gespeichert.',
        '/admin/kategorien'
      );
      return;
    }

    // GEÄNDERT: Fehlermeldung über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      `Kategorie konnte nicht gespeichert werden. Status: ${response.status}`,
      '/admin/kategorien'
    );
  } catch (error) {
    // GEÄNDERT: Netzwerkfehler über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      'Netzwerkfehler beim Speichern der Kategorie.',
      '/admin/kategorien'
    );
  }
}

// GEÄNDERT: ersetzt confirm(). Es wird nur die Löschbestätigung auf der Seite geöffnet.
function loeschenAnfordern(kategorie) {
  kategorieZumLoeschen.value = kategorie;
  loeschenBestaetigen.value = true;
}

// GEÄNDERT: Nutzer kann die Löschbestätigung ohne Popup abbrechen.
function loeschenAbbrechen() {
  kategorieZumLoeschen.value = null;
  loeschenBestaetigen.value = false;
}

// GEÄNDERT: Diese Funktion löscht erst nach Bestätigung auf der Seite.
async function loescheKategorie() {
  if (!kategorieZumLoeschen.value) {
    return;
  }

  fehlerMeldung.value = '';

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${baseUrl}/api/kategorien/${kategorieZumLoeschen.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      kategorieZumLoeschen.value = null;
      loeschenBestaetigen.value = false;

      // GEÄNDERT: Erfolgsmeldung über ErgebnisView
      zeigeErgebnis(
        router,
        true,
        'Kategorie wurde erfolgreich gelöscht.',
        '/admin/kategorien'
      );
      return;
    }

    // GEÄNDERT: Fehlermeldung über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      `Kategorie konnte nicht gelöscht werden. Status: ${response.status}`,
      '/admin/kategorien'
    );
  } catch (error) {
    // GEÄNDERT: Netzwerkfehler über ErgebnisView
    zeigeErgebnis(
      router,
      false,
      'Netzwerkfehler beim Löschen der Kategorie.',
      '/admin/kategorien'
    );
  }
}

onMounted(ladeKategorien);
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
        title="Kategorienverwaltung"
        subtitle="Stammdaten sehen, suchen, erfassen, bearbeiten und löschen"
      />
    </div>

    <div class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-md-8 col-lg-6">
        <div class="filter-card p-3 mb-4">
          <label class="form-label fw-bold">Suche</label>
          <div class="d-flex gap-2">
            <input
              v-model="suche"
              class="form-control custom-input"
              placeholder="Kategorie suchen..."
            />
            <Button text="Suchen" type="default" :onClick="ladeKategorien" />
          </div>
        </div>

        <div class="filter-card p-3 mb-4">
          <h5 class="fw-bold">Neue Kategorie</h5>

          <div class="mb-3">
            <label class="form-label fw-bold">Name *</label>
            <input
              v-model="neueKategorie.name"
              class="form-control custom-input"
              placeholder="z.B. Autoglas"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Beschreibung</label>
            <textarea
              v-model="neueKategorie.beschreibung"
              class="form-control custom-input"
              rows="2"
              placeholder="Kurze Beschreibung..."
            ></textarea>
          </div>

          <div class="d-flex justify-content-center">
            <Button text="Kategorie erstellen" type="default" :onClick="erstelleKategorie" />
          </div>
        </div>

        <!-- GEÄNDERT: eigene Bestätigungsbox statt Browser-confirm() -->
        

        <div v-if="istAmLaden" class="text-center py-3">
          <div class="spinner-border text-warning spinner-border-sm" role="status"></div>
          <p class="mt-2 text-muted">Kategorien werden geladen...</p>
        </div>

        <div v-if="fehlerMeldung" class="alert alert-danger">
          {{ fehlerMeldung }}
        </div>

        <div
          v-for="kategorie in kategorien"
          :key="kategorie.id"
          class="filter-card p-3 mb-3"
        >
          <p class="fw-bold mb-3">Kategorie #{{ kategorie.id }}</p>

          <div class="mb-3">
            <label class="form-label fw-bold">Name</label>
            <input v-model="kategorie.name" class="form-control custom-input" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Beschreibung</label>
            <textarea
              v-model="kategorie.beschreibung"
              class="form-control custom-input"
              rows="2"
            ></textarea>
          </div>

          <div class="d-flex justify-content-center gap-2">
            <Button
              text="Speichern"
              type="default"
              :onClick="() => speichereKategorie(kategorie)"
            />

            <!-- GEÄNDERT: Klick löst kein confirm() mehr aus, sondern öffnet die Bestätigungsbox -->
            <Button
              text="Löschen"
              type="default"
              :onClick="() => loeschenAnfordern(kategorie)"
            />
          </div>
        </div>
        <div
          v-if="loeschenBestaetigen && kategorieZumLoeschen"
          class="filter-card p-3 mb-4"
        >
          <h5 class="fw-bold text-danger">Kategorie löschen?</h5>

          <p class="mb-3">
            Möchten Sie die Kategorie
            <strong>{{ kategorieZumLoeschen.name }}</strong>
            wirklich löschen?
          </p>

          <div class="d-flex justify-content-center gap-2">
            <Button
              text="Ja, löschen"
              type="default"
              :onClick="loescheKategorie"
            />

            <Button
              text="Abbrechen"
              type="default"
              :onClick="loeschenAbbrechen"
            />
          </div>
        </div>

        <div
          v-if="!istAmLaden && kategorien.length === 0"
          class="text-center text-muted mt-4"
        >
          Keine Kategorien gefunden.
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

.custom-input {
  border: 2px solid #000000 !important;
  border-radius: 10px !important;
  padding: 10px;
  font-weight: 500;
}
</style>