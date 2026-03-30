<template>
  <div class="login-page gradient-bg">
    <div class="login-container">
      <div class="card">
        <div class="card-header text-center">
          <div class="login-icon" aria-hidden="true">B</div>
          <h1>Connexion</h1>
          <p class="text-secondary">Bienvenue ! Connectez-vous à votre compte</p>
        </div>

        <div v-if="userStore.error" class="alert alert-danger">
          {{ userStore.error }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              placeholder="votre@email.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              placeholder="••••••••"
              class="form-input"
            />
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-full"
            :disabled="userStore.loading"
          >
            {{ userStore.loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="text-secondary">
            Pas encore de compte ? 
            <router-link to="/register" class="link-primary">
              Inscrivez-vous
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await userStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.login-container {
  width: 100%;
  max-width: 480px;
}

.login-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-md);
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: var(--spacing-md);
}

.card-header h1 {
  color: var(--primary);
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-sm);
}

.login-form {
  margin-top: var(--spacing-xl);
}

.btn-full {
  width: 100%;
  padding: var(--spacing-lg);
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-md);
}

.login-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.link-primary {
  color: var(--primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-base);
}

.link-primary:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}
</style>
