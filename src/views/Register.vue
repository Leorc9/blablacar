<template>
  <div class="register-page">
    <div class="register-container">
      <h1>Inscription</h1>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nom complet</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required 
            placeholder="Jean Dupont"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="votre@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn-primary">
          S'inscrire
        </button>
      </form>

      <p class="login-link">
        Déjà un compte ? 
        <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  console.log('Register attempt:', email.value)
  // La logique Firebase sera ajoutée plus tard
  alert('Fonctionnalité en développement')
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #00aff5;
  margin-bottom: 30px;
  text-align: center;
}

.register-form {
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
  font-weight: 500;
  color: #333;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #00aff5;
}

.btn-primary {
  background-color: #00aff5;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0099dd;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #00aff5;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
