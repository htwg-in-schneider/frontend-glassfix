import { reactive } from 'vue';

export const updateAngebotStore = reactive({
  reparaturEmpfehlung: '',
  zeitEinschaetzung: '',
  arbeitsschritte: [],
  preis: '',


  // Funktion zum Laden bestehender Daten (für Bearbeiten)
  load(angebot) {
    this.reparaturEmpfehlung = angebot.reparaturEmpfehlung;
    this.zeitEinschaetzung = angebot.zeitEinschaetzung;
    this.arbeitsschritte = angebot.arbeitsschritte;
    this.preis = angebot.preis;
  },

  reset() {
    this.reparaturEmpfehlung = '';
    this.zeitEinschaetzung = '';
    this.arbeitsschritte = [];
    this.preis = '';
  }
});