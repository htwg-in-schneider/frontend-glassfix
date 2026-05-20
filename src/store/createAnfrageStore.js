import { reactive } from 'vue';

export const createAnfrageStore = reactive({
  id: null, // Wenn ID vorhanden ist, sind wir im "Edit-Modus"
  kategorie: '',
  beschreibung: '',
  fragen: '',
  bildUrl: '',

  // Funktion zum Laden bestehender Daten (für Bearbeiten)
  load(anfrage) {
    this.id = anfrage.id;
    this.kategorie = anfrage.kategorie;
    this.beschreibung = anfrage.beschreibung;
    this.fragen = anfrage.fragen;
    this.bildUrl = anfrage.bildUrl;
  },

  reset() {
    this.id = null;
    this.kategorie = '';
    this.beschreibung = '';
    this.fragen = '';
    this.bildUrl = '';
  }
});