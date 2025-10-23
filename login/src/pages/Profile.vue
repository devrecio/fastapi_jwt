<template>
  <div>
    <h1>Perfil</h1>
    <p v-if="user">Email: {{ user.email }}</p>
    <p v-else>Cargando...</p>
    <button @click="doLogout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProfile, logout } from '../auth';
import { useRouter } from 'vue-router';

const user = ref(null);
const router = useRouter();

async function loadProfile() {
  try {
    user.value = await getProfile();
  } catch {
    router.push('/login');
  }
}

function doLogout() {
  logout();
  router.push('/login');
}

onMounted(loadProfile);
</script>
