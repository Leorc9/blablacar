<template>
  <div class="register-page gradient-bg">
    <div class="register-container">
      <div class="card">
        <div class="card-header text-center">
          <div class="register-icon" aria-hidden="true">B</div>
          <h1>Inscription</h1>
          <p class="text-secondary">
            Créez votre compte et commencez à voyager
          </p>
        </div>

        <div v-if="userStore.error" class="alert alert-danger">
          {{ userStore.error }}
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="name" class="form-label">Nom complet</label>
            <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="Jean Dupont"
              class="form-input"
            />
          </div>

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
              minlength="6"
              class="form-input"
            />
            <small class="form-help">Minimum 6 caractères</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
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
            {{ userStore.loading ? "Inscription..." : "S'inscrire" }}
          </button>
        </form>

        <div class="register-footer">
          <p class="text-secondary">
            Déjà un compte ?
            <router-link to="/login" class="link-primary">
              Connectez-vous
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  if (password.value.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }

  try {
    await userStore.register(name.value, email.value, password.value);
    alert("Inscription réussie. Bienvenue sur BlaBlaCar.");
    router.push("/");
  } catch (err) {
    console.error("Register error:", err);
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.register-container {
  width: 100%;
  max-width: 520px;
}

.register-icon {
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

.register-form {
  margin-top: var(--spacing-xl);
}

.form-help {
  display: block;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.btn-full {
  width: 100%;
  padding: var(--spacing-lg);
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-lg);
}

.register-footer {
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

@media (max-width: 576px) {
  .register-page {
    padding: var(--spacing-md);
  }

  .card {
    padding: var(--spacing-lg);
  }

  .register-icon {
    font-size: 3rem;
  }

  .card-header h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
