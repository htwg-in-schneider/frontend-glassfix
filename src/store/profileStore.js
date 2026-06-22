import { reactive } from 'vue';

export const updateProfileStore = reactive({
  name: '',
  adresse: '',
  telefonNr: '',

  // Funktion zum Laden bestehender Daten (für Bearbeiten)
  load(profil) {
    this.name = profil.name;
    this.adresse = profil.adresse;
    this.telefonNr = profil.telefonNr;
  },

  reset() {
    this.name = '';
    this.adresse = '';
    this.telefonNr = '';
  }
});