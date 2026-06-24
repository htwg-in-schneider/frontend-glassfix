<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="container-xxl">
    <Header text="Startseite" />

    <main class="row bg-light my-5">
      <div class="col-12 p-4 p-md-5">
        <h1 class="mb-4">Datenschutzerklärung</h1>

        <section class="mb-4">
          <h2 class="h5 fw-bold">1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist GlassFix,
            Beispielstraße 1,
            78464 Konstanz,
            E-Mail: kontakt@glassfix.de.
          </p>
        </section>

        <section class="mb-4">
          <h2 class="h5 fw-bold">2. Kontaktformular</h2>
          <p>
            Wenn du das Kontaktformular verwendest, werden die eingegebenen Daten über dein eigenes
            E-Mail-Programm an GlassFix übermittelt. Die Daten werden nur zur Bearbeitung deiner Nachricht verwendet.
          </p>
        </section>

        <section class="mb-4">
          <h2 class="h5 fw-bold">3. Zweck der Verarbeitung</h2>
          <p>
            Die Verarbeitung erfolgt zur Kommunikation mit Nutzerinnen und Nutzern sowie zur Bearbeitung
            von Anfragen zu Glasreparaturen und Glaspflege.
          </p>
        </section>

        <section>
          <h2 class="h5 fw-bold">4. Hinweis</h2>
          <p class="mb-0">
            Diese Datenschutzerklärung wurde von ITlern aufgesetzt.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>