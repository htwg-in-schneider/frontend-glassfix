export function zeigeErgebnis(router, erfolgreich, hinweis = '', zurueck = '/dashboard') {
    router.push({
      name: 'Ergebnis',
      query: {
        status: erfolgreich ? 'erfolgreich' : 'nicht-erfolgreich',
        hinweis,
        zurueck
      }
    });
  }