<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="page-header">
        <h1>Mon profil</h1>
        <p class="subtitle">Gérez vos informations personnelles</p>
      </div>

      <div v-if="successMessage" class="success-message">
        ✅ {{ successMessage }}
      </div>

      <div v-if="userStore.error" class="error-message">
        ❌ {{ userStore.error }}
      </div>

      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="avatar-section">
            <div class="avatar-large">
              {{ formData.name.charAt(0).toUpperCase() }}
            </div>
            <h2>{{ formData.name }}</h2>
            <p class="user-email">{{ userStore.currentUser?.email }}</p>
            <div class="member-badge">
              <span class="badge-icon">⭐</span>
              <span>Membre depuis {{ memberSince }}</span>
            </div>
          </div>

          <div class="stats-section">
            <h3>Statistiques</h3>
            <div class="stat-item">
              <span class="stat-icon">🚗</span>
              <div class="stat-info">
                <span class="stat-value">0</span>
                <span class="stat-label">Trajets publiés</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🎫</span>
              <div class="stat-info">
                <span class="stat-value">0</span>
                <span class="stat-label">Réservations</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-main">
          <form @submit.prevent="handleSubmit" class="profile-form">
            <div class="form-section">
              <h3>Informations personnelles</h3>
              
              <div class="form-group">
                <label for="name">
                  <span class="label-icon">👤</span>
                  Nom complet
                </label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  required
                  placeholder="Votre nom complet"
                />
              </div>

              <div class="form-group">
                <label for="phone">
                  <span class="label-icon">📱</span>
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="formData.phone"
                  placeholder="+33 6 12 34 56 78"
                />
                <small>Optionnel - visible uniquement après réservation</small>
              </div>

              <div class="form-group">
                <label for="bio">
                  <span class="label-icon">✏️</span>
                  Biographie
                </label>
                <textarea 
                  id="bio" 
                  v-model="formData.bio"
                  rows="5"
                  placeholder="Parlez-nous de vous, de vos passions, de votre style de conduite..."
                ></textarea>
                <small>{{ formData.bio?.length || 0 }} / 500 caractères</small>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save" :disabled="userStore.loading">
                <span v-if="userStore.loading">⏳ Enregistrement...</span>
                <span v-else>💾 Enregistrer les modifications</span>
              </button>
            </div>
          </form>

          <div class="danger-zone">
            <div class="danger-header">
              <h3>⚠️ Zone dangereuse</h3>
              <p>Actions irréversibles sur votre compte</p>
            </div>
            <button @click="handleLogout" class="btn-danger">
              🚪 Déconnexion
            </button>
          </div>
        </div>
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
  if (formData.value.bio && formData.value.bio.length > 500) {
    alert('⚠️ La biographie ne peut pas dépasser 500 caractères')
    return
  }

  try {
    await userStore.updateProfile(formData.value)
    successMessage.value = 'Profil mis à jour avec succès !'
    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  } catch (err) {
    console.error('Update error:', err)
    alert('❌ Erreur lors de la mise à jour du profil')
  }
}

const handleLogout = async () => {
  if (confirm('🚪 Êtes-vous sûr de vouloir vous déconnecter ?\n\nVous devrez vous reconnecter pour accéder à votre compte.')) {
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
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 20px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: #00aff5;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.success-message {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
  border: 2px solid #28a745;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.error-message {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
  border: 2px solid #dc3545;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
}

.profile-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.avatar-section {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
  box-shadow: 0 8px 25px rgba(0, 175, 245, 0.3);
}

.avatar-section h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.user-email {
  color: #666;
  margin-bottom: 20px;
}

.member-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  color: #856404;
  border: 2px solid #ffc107;
}

.badge-icon {
  font-size: 1.2rem;
}

.stats-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stats-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 15px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #00aff5;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.profile-form {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-section h3 {
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #00aff5;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 1rem;
}

.label-icon {
  font-size: 1.2rem;
}

input,
textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s;
  background: #f8f9fa;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #00aff5;
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 175, 245, 0.1);
}

small {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-top: 6px;
}

.form-actions {
  margin-top: 10px;
}

.btn-save {
  width: 100%;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  color: white;
  padding: 18px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 175, 245, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 175, 245, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.danger-zone {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #dc3545;
}

.danger-header {
  margin-bottom: 25px;
}

.danger-header h3 {
  color: #dc3545;
  margin-bottom: 8px;
  font-size: 1.3rem;
}

.danger-header p {
  color: #666;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(220, 53, 69, 0.4);
}

@media (max-width: 968px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>
