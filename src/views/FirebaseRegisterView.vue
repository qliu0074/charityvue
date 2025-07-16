<template>
  <div class="signup-wrapper">
    <!-- Banner -->
    <div class="banner text-white text-center py-5 mb-4">
      <h1 class="mb-2">Create Your Account</h1>
      <p class="mb-0">Join our community and support charities you care about</p>
    </div>

    <!-- Form -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="card shadow-sm border-0 p-4 rounded">
            <h3 class="text-center mb-4">Sign Up</h3>

            <form @submit.prevent="submitForm">
              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="formData.username"
                  @blur="validateName(true)"
                  @input="validateName(false)"
                />
                <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="formData.email"
                  @blur="validateEmail(true)"
                  @input="validateEmail(false)"
                />
                <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="formData.password"
                  @blur="validatePassword(true)"
                  @input="validatePassword(false)"
                />
                <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
              </div>

              <!-- Confirm Password -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  @blur="validateConfirmPassword(true)"
                  @input="validateConfirmPassword(false)"
                />
                <small v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</small>
              </div>

              <!-- Residency -->
              <div class="mb-3">
                <label for="australianResident" class="form-label">Are you an Australian resident?</label>
                <select v-model="formData.isAustralianResident" class="form-select" id="australianResident">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <!-- Submit -->
              <button type="submit" class="btn btn-primary w-100 mb-2">Create Account</button>
            </form>

            <!-- Success -->
            <div v-if="successMessage" class="alert alert-success text-center mt-3">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Prompt Modal -->
    <div v-if="showAdminPrompt" class="modal-backdrop">
      <div class="modal-box">
        <h5 class="mb-3">Register as Admin?</h5>
        <p>Would you like to register as an Admin?</p>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-primary" @click="setRole('admin')">Yes</button>
          <button class="btn btn-outline-secondary" @click="setRole('user')">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAustralianResident: 'no'
})

const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null
})

const successMessage = ref('')
const showAdminPrompt = ref(false)
const userId = ref(null)

const validateName = (blur) => {
  errors.value.username = formData.value.username.length < 3 && blur ? 'Name must be at least 3 characters' : null
}

const validateEmail = (blur) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.value.email = !pattern.test(formData.value.email) && blur ? 'Invalid email format' : null
}

const validatePassword = (blur) => {
  errors.value.password = formData.value.password.length < 8 && blur ? 'Password must be at least 8 characters' : null
}

const validateConfirmPassword = (blur) => {
  errors.value.confirmPassword =
    formData.value.password !== formData.value.confirmPassword && blur
      ? 'Passwords do not match'
      : null
}

const submitForm = async () => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (Object.values(errors.value).some(e => e)) return

  try {
    // ✅ 检查邮箱是否已经存在
    const methods = await fetchSignInMethodsForEmail(auth, formData.value.email)
    if (methods.length > 0) {
      errors.value.email = 'This email is already in use.'
      return
    }

    const userCredential = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
    userId.value = userCredential.user.uid

    await setDoc(doc(db, 'users', userId.value), {
      username: formData.value.username,
      email: formData.value.email,
      role: 'user',
      isAustralianResident: formData.value.isAustralianResident
    })

    successMessage.value = 'Sign up successful!'
    formData.value = { username: '', email: '', password: '', confirmPassword: '', isAustralianResident: 'no' }

    showAdminPrompt.value = true
  } catch (error) {
    console.error('Registration failed:', error)
    if (error.code === 'auth/invalid-email') {
      errors.value.email = 'Invalid email address.'
    } else {
      errors.value.email = 'Something went wrong. Please try again.'
    }
  }
}

const setRole = async (role) => {
  if (!userId.value) return
  try {
    await setDoc(doc(db, 'users', userId.value), { role }, { merge: true })
    successMessage.value = `You are now registered as a ${role}!`
    showAdminPrompt.value = false
    setTimeout(() => router.push('/FirebaseSigninView'), 2000)
  } catch (error) {
    console.error('Error updating role:', error)
  }
}
</script>

<style scoped>
.signup-wrapper {
  background-color: #f5f8fa;
  min-height: 100vh;
  padding-bottom: 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.banner {
  background: linear-gradient(to right, #004e92, #000428);
  color: white;
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

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: white;
  border-radius: 10px;
  padding: 20px 30px;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}
</style>
