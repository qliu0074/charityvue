<template>
  <div class="login-wrapper">
    <!-- Banner -->
    <div class="banner text-white text-center py-5 mb-4">
      <h1 class="mb-2">Welcome Back</h1>
      <p class="mb-0">Log in to access the charity portal</p>
    </div>

    <!-- Form -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-sm border-0 p-4 rounded">
            <h3 class="text-center mb-4">Sign In</h3>

            <form @submit.prevent="fireSignin">
              <div class="mb-3">
                <label for="username" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="username"
                  placeholder="your@email.com"
                  v-model="formData.username"
                />
                <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="••••••••"
                  v-model="formData.password"
                />
                <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
              </div>

              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>

            <div class="text-center mt-3">
              <p class="mb-1">Don't have an account?</p>
              <button class="btn btn-outline-secondary w-100" @click="goToSignup">
                Register Here
              </button>
            </div>

            <div v-if="successMessage" class="alert alert-success mt-3 text-center">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const formData = ref({ username: '', password: '' })
const errors = ref({ username: null, password: null })
const successMessage = ref('')

const fireSignin = async () => {
  errors.value = { username: null, password: null }
  try {
    const { user } = await signInWithEmailAndPassword(auth, formData.value.username, formData.value.password)

    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const userRole = userData.role

      if (userRole === 'admin') {
        alert('Admin login')
        router.push({ name: 'AdminDashboard' })
      } else {
        successMessage.value = 'Login successful!'
        setTimeout(() => router.push({ name: 'HomePage' }), 1000)
      }
    } else {
      alert('No role found for user')
    }
  } catch (error) {
    console.error('Sign in failed', error)
    errors.value.username = 'Invalid credentials'
    errors.value.password = 'Please try again'
  }
}

const goToSignup = () => {
  router.push('/FirebaseRegisterView')
}
</script>

<style scoped>
.login-wrapper {
  background-color: #f5f8fa;
  min-height: 100vh;
  padding-bottom: 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.banner {
  background: linear-gradient(to right, #004e92, #000428);
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
}

.btn-primary {
  background-color: #004e92;
  border-color: #004e92;
}

.btn-primary:hover {
  background-color: #00376b;
  border-color: #00376b;
}

.btn-outline-secondary:hover {
  background-color: #eaeaea;
}

.form-control:focus {
  border-color: #004e92;
  box-shadow: 0 0 0 0.2rem rgba(0, 78, 146, 0.25);
}
</style>
