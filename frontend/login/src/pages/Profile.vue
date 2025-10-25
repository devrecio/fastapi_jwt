<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const { user, fetchUser, logout, isAuthenticated } = useAuth();
const loading = ref(true);
const error = ref('');
const router = useRouter();

onMounted(async () => {
  try {
    await fetchUser();
    if (!isAuthenticated.value) {
      router.push('/login'); // redirige si no está autenticado
    }
  } catch (err) {
    console.error('Error al cargar usuario:', err);
    error.value = 'No se pudo cargar el perfil. Intenta iniciar sesión nuevamente.';
  } finally {
    loading.value = false;
  }
});

function handleLogout() {
  logout();
  router.push('/login');
}
</script>

<template>
  <div class="profile-container">
    <h1>Perfil</h1>

    <p v-if="loading">Cargando usuario...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button class="logout-btn" @click="handleLogout">Cerrar sesión</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  background: #f7f9fc;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;
}
.error {
  color: #c0392b;
}
.logout-btn {
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.2s;
}
.logout-btn:hover {
  background: #c0392b;
}
</style>



