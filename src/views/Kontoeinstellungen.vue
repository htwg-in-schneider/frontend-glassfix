<script setup>
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';

import { useAuth0 } from '@auth0/auth0-vue'
import { ref, onMounted, computed, watch } from 'vue';
import { routeLocationKey, useRouter } from 'vue-router';

const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
const bearerToken = ref('');
const error = ref('');
const router = useRouter();

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}

</script>

<template>
    <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
        <Header text="Dashboard"/>
        <div class="row m-0 text-center justify-content-center pt-4">
            <LogoAndTitle :title="`Kontoeinstellungen`" :subtitle="``" />
        </div>

        <div class="px-4 mt-4">
      <div class="menu-list-container d-flex flex-column gap-3">
        
        <router-link to="/Profilverwaltung" class="menu-list-item-link">
          <div class="menu-list-item d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-circle-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </div>
              <span class="fw-bold item-text">Profilverwaltung</span>
            </div>
            <span class="arrow-icon">&gt;</span>
          </div>
        </router-link>

        <router-link to="/passwort-aendern" class="menu-list-item-link">
          <div class="menu-list-item d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-circle-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                  <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.54.54A4 4 0 0 1 0 8m4-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6"/>
                </svg>
              </div>
              <span class="fw-bold item-text">Passwort ändern</span>
            </div>
            <span class="arrow-icon">&gt;</span>
          </div>
        </router-link>

        <div @click="handleLogout" class="menu-list-item d-flex justify-content-between align-items-center p-3">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-circle-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5 Extensión del path alternativo...5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
            </div>
            <span class="fw-bold item-text">Abmelden</span>
          </div>
          <span class="arrow-icon">&gt;</span>
        </div>

        <router-link to="/konto-loeschen" class="menu-list-item-link">
          <div class="menu-list-item delete-account-item d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-circle-box trash-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </div>
              <span class="fw-bold item-text text-danger">Konto löschen</span>
            </div>
            <span class="arrow-icon text-danger">&gt;</span>
          </div>
        </router-link>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* Contenedor principal de la lista */
.menu-list-container {
  max-width: 400px;
  margin: 0 auto;
}

/* Limpieza de etiquetas <a> de Vue Router */
.menu-list-item-link {
  text-decoration: none;
  color: inherit;
}

/* Tarjetas de menú con diseño de borde grueso idéntico al tuyos */
.menu-list-item {
  background-color: white;
  border: 1.5px solid #000000;
  border-radius: 14px;
  box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 0px;
  transition: transform 0.1s, box-shadow 0.1s;
  cursor: pointer;
}

/* Animación táctil de pulsación hacia abajo */
.menu-list-item:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* El círculo del icono de la izquierda */
.icon-circle-box {
  width: 42px;
  height: 42px;
  border: 1.5px solid #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #000000;
}

/* Textos generales de los enlaces */
.item-text {
  font-size: 1.05rem;
  color: #000000;
}

/* Símbolo '>' del extremo derecho */
.arrow-icon {
  font-size: 1.1rem;
  font-weight: bold;
  color: #000000;
}

/* Estilo de alerta destructiva para la última opción (Konto löschen) */
.delete-account-item {
  border-color: #dc3545; /* Borde rojo sutil */
}

.trash-box {
  border-color: #dc3545;
  color: #dc3545;
}
</style>