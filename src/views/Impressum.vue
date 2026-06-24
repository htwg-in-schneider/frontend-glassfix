<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="container-xxl">
    <Header text="Startseite" />

    <main class="row bg-light my-5">
      <div class="col-12 p-4 p-md-5">
        <h1 class="mb-4">Impressum</h1>

        <section class="mb-4">
          <h2 class="h5 fw-bold">Angaben gemäß § 5 TMG</h2>
          <p class="mb-0">
            GlassFix <br>
            Beispielstraße 1<br>
            78464 Konstanz<br>
            Deutschland
          </p>
        </section>

        <section class="mb-4">
          <h2 class="h5 fw-bold">Kontakt</h2>
          <p class="mb-0">
            Telefon: +49 1234 567890<br>
            E-Mail: kontakt@glassfix.de
          </p>
        </section>

        <section>
          <h2 class="h5 fw-bold">Vertreten durch</h2>
          <p class="mb-0">Roman Müller und Juan Cerda</p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>