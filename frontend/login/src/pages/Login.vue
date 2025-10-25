<template>
  <div class="auth-container">
    <h1>{{ isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión' }}</h1>

    <input
      v-model="email"
      type="email"
      placeholder="Correo electrónico"
      required
    />
    <input
      v-model="password"
      type="password"
      placeholder="Contraseña"
      required
    />

    <button @click="handleSubmit" :disabled="loading">
      {{ isRegisterMode ? 'Registrarse' : 'Entrar' }}
    </button>

    <p class="switch-mode">
      <span>
        {{ isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
      </span>
      <a href="#" @click.prevent="toggleMode">
        {{ isRegisterMode ? 'Inicia sesión' : 'Regístrate aquí' }}
      </a>
    </p>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="message" class="success">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const email = ref('');
const password = ref('');
const message = ref('');
const isRegisterMode = ref(false);

const { login, register, loading, error, isAuthenticated } = useAuth();
const router = useRouter();

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value;
  message.value = '';
}

async function handleSubmit() {
  message.value = '';
  try {
    if (isRegisterMode.value) {
      await register(email.value, password.value);
      message.value = 'Registro exitoso. Ahora puedes iniciar sesión.';
      isRegisterMode.value = false;
    } else {
      await login(email.value, password.value);
      if (isAuthenticated.value) {
        router.push('/profile');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
  background: #f9fafc;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}
button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
button:hover {
  background: #2980b9;
}
.error {
  color: #e74c3c;
  margin-top: 10px;
}
.success {
  color: #27ae60;
  margin-top: 10px;
}
.switch-mode {
  margin-top: 15px;
}
.switch-mode a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}
</style>



