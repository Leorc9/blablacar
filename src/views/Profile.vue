<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1>Mon profil</h1>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="userStore.error" class="error-message">
        {{ userStore.error }}
      </div>

      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="profile-header">
          <div class="avatar">
            {{ formData.name.charAt(0).toUpperCase() }}
          </div>
          <div class="user-info">
            <p class="user-email">{{ userStore.currentUser?.email }}</p>
            <p class="member-since">Membre depuis {{ memberSince }}</p>
          </div>
        </div>

        <div class="form-group">
          <label for="name">Nom complet</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required
            placeholder="Votre nom complet"
          />
        </div>

        <div class="form-group">
          <label for="phone">Téléphone</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone"
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div class="form-group">
          <label for="bio">Biographie</label>
          <textarea 
            id="bio" 
            v-model="formData.bio"
            rows="4"
            placeholder="Parlez-nous de vous..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="userStore.loading">
            {{ userStore.loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </form>

      <div class="danger-zone">
        <h3>Zone dangereuse</h3>
        <p>Actions irréversibles sur votre compte</p>
        <button @click="handleLogout" class="btn-danger">
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const successMessage = ref('')

const formData = ref({
  name: '',
  phone: '',
  bio: ''
})

const memberSince = computed(() => {
  if (!userStore.currentUser?.createdAt) return ''
  const date = new Date(userStore.currentUser.createdAt)
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const handleSubmit = async () => {
  try {
    await userStore.updateProfile(formData.value)
    successMessage.value = 'Profil mis à jour avec succès !'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Update error:', err)
    alert('Erreur lors de la mise à jour du profil')
  }
}

const handleLogout = async () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    try {
      await userStore.logout()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }
}

onMounted(() => {
  if (userStore.currentUser) {
    formData.value = {
      name: userStore.currentUser.name || '',
      phone: userStore.currentUser.phone || '',
      bio: userStore.currentUser.bio || ''
    }
  }
})
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #00aff5;
  margin-bottom: 30px;
  text-align: center;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
  text-align: center;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
  text-align: center;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  border-radius: 12px;
  margin-bottom: 30px;
  color: white;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  color: #00aff5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.user-info {
  flex: 1;
}

.user-email {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.member-since {
  opacity: 0.9;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #333;
}

input,
textarea {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #00aff5;
}

.form-actions {
  margin-top: 10px;
}

.btn-primary {
  width: 100%;
  background-color: #00aff5;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0099dd;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.danger-zone {
  margin-top: 40px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #dc3545;
}

.danger-zone h3 {
  color: #dc3545;
  margin-bottom: 10px;
}

.danger-zone p {
  color: #666;
  margin-bottom: 20px;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
