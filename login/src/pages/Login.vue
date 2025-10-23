<template>
  <div>
    <h1>Login</h1>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="doLogin">Login</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

async function doLogin() {
  try {
    await login(email.value, password.value);
    message.value = 'Login exitoso!';
    router.push('/profile');
  } catch (err) {
    message.value = 'Error de login: ' + err.response?.data?.detail;
  }
}
</script>
