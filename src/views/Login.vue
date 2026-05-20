<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';


const email = ref('');
const password = ref('');

const errorMensaje = ref('');
const loading = ref(false);

const router = useRouter();


const manejarLogin = async () => {
  errorMensaje.value = '';
  loading.value = true;

  try {
    const response = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value 
      }),
    });

    if (response.ok) {
      const data = await response.text(); 
      console.log('Login erfolgreich:', data);
      
      
      router.push('/filter');
    } else {
      
      const textoError = await response.text();
      errorMensaje.value = textoError || 'Falsche Anmeldedaten';
    }
  } catch (error) {
    console.error('Error de red:', error);
    errorMensaje.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
        <Header :text="'Startseite'"/>
        <div class="row m-0 text-center justify-content-center pt-4">
            <LogoAndTitle :title="'Login'" :subtitle="'Melden Sie sich an'" />
        </div>

        <section id="Form">
            <div class="row m-0">
                <div class="col-sm d-flex flex-column justify-content-center align-items-center">
                    
                    <form @submit.prevent="manejarLogin" class="bg-light border p-5 style-form">
                        
                        <div v-if="errorMensaje" class="alert alert-danger p-2 small text-center" role="alert">
                            {{ errorMensaje }}
                        </div>

                        <div class="mb-3 mt-3">
                            <label for="email" class="form-label">Email:</label>
                            <input 
                                v-model="email" 
                                type="email" 
                                class="form-control" 
                                id="email" 
                                placeholder="Enter email" 
                                required
                            >
                        </div>
                        <div class="mb-3">
                            <label for="pwd" class="form-label">Password:</label>
                            <input 
                                v-model="password" 
                                type="password" 
                                class="form-control" 
                                id="pwd" 
                                placeholder="Enter password" 
                                required
                            >
                        </div>
                        
                        <button 
                            type="submit" 
                            class="btn custom-pill w-100" 
                            :disabled="loading"
                        >
                            {{ loading ? 'Anmelden...' : 'Submit' }}
                        </button>
                    </form>
                    
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.style-form {
    width: 100%;
    max-width: 400px;
    border-radius: 15px;
}
.custom-pill {
    background-color: #f0a530;
    color: white;
    font-weight: bold;
    border-radius: 10px;
}
.custom-pill:hover {
    background-color: #d48416;
}
</style>