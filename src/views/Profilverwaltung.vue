<script setup>
import Header from '@/components/Header.vue';  
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import Button from '@/components/Button.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { zeigeErgebnis } from '@/router/ergebnisNavigation'; 
import { updateProfileStore } from '@/store/profileStore'
const router = useRouter();

const baseurl = 'http://localhost:8081';
const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
const profildata = ref(null);
const bearerToken = ref('');
const error = ref('');

const profileStore = updateProfileStore;

function loadProfileData(){
    if(profildata.value){
        profileStore.name = profildata.value.name || '';
        profileStore.adresse = profildata.value.adresse || '';
        profileStore.telefonNr = profildata.value.telefonnummer || '';
    } else{
        console.warn("Bearbeiten nicht möglich: Profildaten sind noch nicht geladen.");
    }
}

async function updateProfileData(){
    if(isAuthenticated.value){
        try{
            const dataPayload = {
                name: profileStore.name,
                adresse: profileStore.adresse,
                telefonnummer: profileStore.telefonNr
            };

            const response = await fetch(`${baseurl}/api/benutzer/${profildata.value.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${bearerToken.value}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPayload)
            })

            if (response.ok) {
        zeigeErgebnis(router, true, 'Profil erfolgreich aktualisiert!', '/dashboard'); 
        return; // GEÄNDERT: nach Weiterleitung abbrechen
      } else {
        if (response.status === 401) {
          zeigeErgebnis(router, false, 'Fehler: Sie müssen angemeldet sein, um fortzufahren.', '/login'); 
        } else {
          zeigeErgebnis(router, false, 'Ein Fehler ist aufgetreten. Status Code: ' + response.status, '/profilverwaltung'); 
        }

        return; 
      }
    } catch (e) {
      error.value = `Fehler beim Aktualisieren des Profils: ${e.message}`;
      console.warn('Could not get token:', e);
    }
  }
}

onMounted(async () => {
    if(isAuthenticated.value){
        try{
            const token = await getAccessTokenSilently()
            bearerToken.value = token

            const response = await fetch(`${baseurl}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.ok){
                profildata.value = await response.json()
                loadProfileData();
            } else{
                error.value = `Fehler beim Laden des Profils: ${response.status} ${response.statusText}`
            }
        } catch (e){
            error.value = `Fehler beim Laden des Profils: ${e.message}`
            console.warn('Could not get token:', e)
        }
    }
})

</script>
<template>
  <div class="container-fluid bg-white min-vh-100 p-0 anfragen-filter-view">
    <Header text="Dashboard" />
    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle
      title="Profilverwaltung"
      subtitle="Finde passende Anfragen"/>
    </div>
    

    <div v-if="profildata" class="row m-0 justify-content-center mt-3 pb-5">
      <div class="col-11 col-sm-8 col-md-5 col-lg-4">
        <div class="filter-card p-3">
          <div class="mb-3">
            <label class="form-label fw-bold">Name: *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B Max Mustermann"
              v-model="profileStore.name"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Email: </label>
            <p>{{ profildata.email }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Rolle: </label>
            <p>{{ profildata.rolle }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Adresse: *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B Musterstrasße 1"
              v-model="profileStore.adresse"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">TelefonNr: *</label>
            <textarea 
              class="form-control custom-input" 
              rows="3"
              placeholder="z.B +49 1234567890"
              v-model="profileStore.telefonNr"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Registrierungsdatum: </label>
            <p>{{ profildata.registrierungsdatum.substring(0,10) }}</p>
          </div>
          

          <div class="d-flex justify-content-center mt-4">
            <Button :text="'Speichern'" :type="'default'" :onClick="updateProfileData" />
          </div>

        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted">Lade Profildaten...</p>
    </div>
  </div>
</template>
