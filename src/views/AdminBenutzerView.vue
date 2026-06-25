<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';

const { getAccessTokenSilently } = useAuth0();

const benutzerListe = ref([]);
const suche = ref('');
const fehlerMeldung = ref('');
const erfolgsMeldung = ref('');
const istAmLaden = ref(true);

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const gefilterteBenutzer = computed(() => {
  const suchwert = suche.value.toLowerCase().trim();

  if (!suchwert) {
    return benutzerListe.value;
  }

  return benutzerListe.value.filter((benutzer) => {
    return (
      benutzer.name?.toLowerCase().includes(suchwert) ||
      benutzer.email?.toLowerCase().includes(suchwert) ||
      benutzer.rolle?.toLowerCase().includes(suchwert) ||
      benutzer.adresse?.toLowerCase().includes(suchwert) ||
      benutzer.telefonnummer?.toLowerCase().includes(suchwert)
    );
  });
});

async function ladeBenutzer() {
  istAmLaden.value = true;
  fehlerMeldung.value = '';
  erfolgsMeldung.value = '';

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${baseUrl}/api/benutzer`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      fehlerMeldung.value = `Benutzer konnten nicht geladen werden. Status: ${response.status}`;
      return;
    }

    benutzerListe.value = await response.json();
  } catch (error) {
    fehlerMeldung.value = 'Netzwerkfehler beim Laden der Benutzer.';
  } finally {
    istAmLaden.value = false;
  }
}

async function speichereBenutzer(benutzer) {
  fehlerMeldung.value = '';
  erfolgsMeldung.value = '';

  if (!benutzer.name || !benutzer.name.trim()) {
    fehlerMeldung.value = 'Der Name darf nicht leer sein.';
    return;
  }

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${baseUrl}/api/benutzer/${benutzer.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: benutzer.name,
        adresse: benutzer.adresse,
        telefonnummer: benutzer.telefonnummer,
        rolle: benutzer.rolle
      })
    });

    if (!response.ok) {
      fehlerMeldung.value = `Benutzer konnte nicht gespeichert werden. Status: ${response.status}`;
      return;
    }

    erfolgsMeldung.value = 'Benutzer wurde gespeichert.';
    await ladeBenutzer();
  } catch (error) {
    fehlerMeldung.value = 'Netzwerkfehler beim Speichern des Benutzers.';
  }
}

onMounted(ladeBenutzer);
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
        title="Nutzerverwaltung"
        subtitle="Benutzer anzeigen, suchen und bearbeiten"
      />
    </div>

    <div class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-md-8 col-lg-6">
        <div class="filter-card p-3 mb-4">
          <label class="form-label fw-bold">Suche</label>
          <input
            v-model="suche"
            class="form-control custom-input"
            placeholder="Nach Name, E-Mail, Rolle, Adresse oder Telefonnummer suchen..."
          />
        </div>

        <div v-if="istAmLaden" class="text-center py-3">
          <div class="spinner-border text-warning spinner-border-sm" role="status"></div>
          <p class="mt-2 text-muted">Benutzer werden geladen...</p>
        </div>

        <div v-if="fehlerMeldung" class="alert alert-danger">
          {{ fehlerMeldung }}
        </div>

        <div v-if="erfolgsMeldung" class="alert alert-success">
          {{ erfolgsMeldung }}
        </div>

        <div
          v-for="benutzer in gefilterteBenutzer"
          :key="benutzer.id"
          class="filter-card p-3 mb-3"
        >
          <p class="fw-bold mb-1">Benutzer #{{ benutzer.id }}</p>
          <p class="text-muted small mb-3">{{ benutzer.email }}</p>

          <div class="mb-3">
            <label class="form-label fw-bold">Name</label>
            <input v-model="benutzer.name" class="form-control custom-input" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Adresse</label>
            <input v-model="benutzer.adresse" class="form-control custom-input" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Telefonnummer</label>
            <input v-model="benutzer.telefonnummer" class="form-control custom-input" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Rolle</label>
            <select v-model="benutzer.rolle" class="form-select custom-input">
              <option value="KUNDE">KUNDE</option>
              <option value="FACHKRAFT">FACHKRAFT</option>
              <option value="GESCHAEFTSFUEHRER">GESCHAEFTSFUEHRER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div class="d-flex justify-content-center">
            <Button
              text="Speichern"
              type="default"
              :onClick="() => speichereBenutzer(benutzer)"
            />
          </div>
        </div>

        <div
          v-if="!istAmLaden && gefilterteBenutzer.length === 0"
          class="text-center text-muted mt-4"
        >
          Keine Benutzer gefunden.
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
