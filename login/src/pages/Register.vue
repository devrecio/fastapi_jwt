<template>
  <div>
    <h1>Register</h1>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="doRegister">Register</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '../auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

async function doRegister() {
  try {
    await register(email.value, password.value);
    message.value = 'Usuario registrado!';
    router.push('/login');
  } catch (err) {
    message.value = 'Error: ' + err.response?.data?.detail;
  }
}
</script>
