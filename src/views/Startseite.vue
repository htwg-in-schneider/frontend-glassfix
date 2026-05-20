<script setup>
    import router from '@/router';
import { computed } from 'vue';

</script>

<template>
  <div class="container-xxl">
 
    <div class="row" id="Header">
      <div class="col-6 col-md-4 d-flex justify-content-center justify-content-md-start align-items-center">
        <img
          src="/ProjektBilder/GlassFix_Logo.png"
          alt="GlassFix Logo"
          class="img-fluid p-3"
          style="width: 100%; max-width: 500px; height: auto;"
        >
      </div>
 
      <div class="col-6 col-md-8" id="Navbar">
        <nav class="navbar navbar-expand-md navbar-inverse sticky-top">
          <div class="container-fluid">
            <div class="navbar-header">
              <button
                @click=""
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
            </div>
 
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="nav navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="#Service">Service</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#WarumGlassFix">Warum GlassFix</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#Ablauf">Ablauf</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#Rezensionen">Rezensionen</a>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link btn costum-pill-cta" to="/login">Anmelden</router-link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
 
    <div class="row mt-5" id="CTA">
      <h1 class="text-center mb-3 text-light">
        Bringe deine Glasstücke auf neuen Glanz - mit GlassFix, deinem Experten für Glasreparatur und -pflege!
      </h1>
 
      <div class="col-auto">
        <a href="anmeldung.html" class="btn btn-lg costum-pill-cta p-3">Jetzt loslegen →</a>
      </div>
    </div>
 
    <div class="row bg-light pt-5" id="Service">
      <div class="col-12 p-3">
        <h3 class="text-center">Unsere Glasservice - Leistungen</h3>
      </div>
    </div>
 
    <div class="row pb-5 bg-light g-4">
      <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div class="d-flex flex-column bg-light rounded border align-items-center p-2 service-card">
          <img src="/ProjektBilder/Leistung1.png" alt="Säge" class="img-fluid m-2 card-img-fix service-img">
          <span class="mb-2 text-center text-muted">Säge <br>Zusägen der Glasobjekte</span>
        </div>
      </div>
 
      <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div class="d-flex flex-column bg-light rounded border align-items-center p-2 service-card">
          <img src="/ProjektBilder/Leistung2.png" alt="Schleifen" class="img-fluid m-2 card-img-fix service-img">
          <span class="mb-2 text-center text-muted">Schleifen <br>Randbearbeitung; Ausbrüche entfernen</span>
        </div>
      </div>
 
      <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div class="d-flex flex-column bg-light rounded border align-items-center p-2 service-card">
          <img src="/ProjektBilder/Leistung3.png" alt="Polieren" class="img-fluid m-2 card-img-fix service-img">
          <span class="mb-2 text-center text-muted">
            Polieren <br> Kratzer, matte Stellen wieder <br>glänzend machen
          </span>
        </div>
      </div>
    </div>
 
    <div class="row bg-light pb-5" id="WarumGlassFix">
      <div class="col-12">
        <h3 class="text-center">
          Warum GlassFix die richtige Wahl ist
        </h3>
      </div>
    </div>
 
    <div class="row pb-5 bg-light d-flex justify-content-center p-1 align-items-center">
 
      <div class="col-6 col-lg-2 d-flex justify-content-center align-items-center m-lg-2 mb-3 mb-lg-0">
        <img
          src="/ProjektBilder/BeforAfterLinks.png"
          alt="Vorher Nachher links"
          class="img-fluid side-img side-img-left"
        >
      </div>
 
      <div class="col-lg-4 m-2 mx-5 order-last order-lg-0 d-flex flex-column justify-content-center align-items-center">
        <div class="row align-items-center mb-4 w-100 justify-content-center">
          <div class="col-auto">
            <img src="/ProjektBilder/Warum1.png" alt="Erfahrene Fachkräfte" class="rounded icon-size">
          </div>
          <div class="col">
            <p class="m-0 fw-bold">Erfahrene Fachkräfte</p>
            <p class="m-0 text-muted">Mit Spezialisierung auf Glasbearbeitung.</p>
          </div>
        </div>
 
        <div class="row align-items-center mb-4 w-100 justify-content-center">
          <div class="col-auto">
            <img src="/ProjektBilder/Warum2.png" alt="Schnelle Einschätzung" class="rounded icon-size">
          </div>
          <div class="col">
            <p class="m-0 fw-bold">Schnelle & transparente Einschätzung</p>
            <p class="m-0 text-muted">Rasche Analyse und Angebote.</p>
          </div>
        </div>
 
        <div class="row align-items-center mb-4 w-100 justify-content-center">
          <div class="col-auto">
            <img src="/ProjektBilder/Warum3.png" alt="Individuelle Lösungen" class="rounded icon-size">
          </div>
          <div class="col">
            <p class="m-0 fw-bold">Individuelle Lösungen</p>
            <p class="m-0 text-muted">Angepasst an genau ihr Schadensbild.</p>
          </div>
        </div>
      </div>
 
      <div class="col-6 col-lg-2 d-flex justify-content-center align-items-center m-lg-2 mb-3 mb-lg-0">
        <img
          src="/ProjektBilder/BeforeAfterRechts.png"
          alt="Vorher Nachher rechts"
          class="img-fluid side-img side-img-right"
        >
      </div>
 
    </div>
 
    <div class="row bg-light" id="Ablauf">
      <div class="col-12 p-3">
        <h3 class="text-center">So funktioniert es:</h3>
      </div>
    </div>
 
    <div class="row bg-light pb-5 justify-content-center g-4">
      <div class="col-12 col-md-4 d-flex flex-column align-items-center">
        <img src="/ProjektBilder/AblaufBild1.png" alt="Registrieren" class="img-fluid m-1 ablauf-img">
        <h6 class="text-muted text-center">Anmelden/Registrieren</h6>
      </div>
 
      <div class="col-12 col-md-4 d-flex flex-column align-items-center m-2">
        <img src="/ProjektBilder/ablaufBild2.png" alt="Hochladen" class="img-fluid m-1 ablauf-img">
        <h6 class="text-muted text-center">Bild/Text hochladen</h6>
      </div>
 
      <div class="col-12 col-md-4 d-flex flex-column align-items-center m-2">
        <img src="/ProjektBilder/ablaufBild3.png" alt="Angebot erhalten" class="img-fluid m-1 ablauf-img">
        <h6 class="text-muted text-center">Rückmeldung/Angebot erhalten</h6>
      </div>
    </div>
 
    <div class="row bg-light" id="Rezensionen">
      <div class="col-12 p-3">
        <h3 class="text-center">Kunden Rezensionen</h3>
      </div>
    </div>
 
    <div class="row pb-5 bg-light g-4 justify-content-center">
      <div class="col-12 col-md-6 d-flex justify-content-center">
        <div class="card h-100 review-card">
          <img src="/ProjektBilder/Persona1.png" class="card-img-top review-img" alt="">
          <div class="card-body">
            <h5 class="card-title">Maike Maier</h5>
            <p class="card-text text-muted">
              Ich bin durch meine Arbeit auf die Website gestoßen und nutze sie seitdem regelmäßig
            </p>
          </div>
        </div>
      </div>
 
      <div class="col-12 col-md-6 d-flex justify-content-center">
        <div class="card h-100 review-card">
          <img src="/ProjektBilder/Persona2.png" class="card-img-top review-img" alt="">
          <div class="card-body">
            <h5 class="card-title">Max Mustermann</h5>
            <p class="card-text text-muted">
              Mein Flohmarkt-Fund sieht wieder aus wie neu – und wie sich herausgestellt hat, ist er auch einiges wert!
            </p>
          </div>
        </div>
      </div>
    </div>
 
  </div>
</template>

