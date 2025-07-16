<script setup>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

const user = ref(null)
const isAdmin = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser

    if (currentUser) {
      const userDoc = doc(db, 'users', currentUser.uid)
      const userSnapshot = await getDoc(userDoc)

      if (userSnapshot.exists()) {
        const data = userSnapshot.data()
        isAdmin.value = data.role === 'admin'
      }
    } else {
      isAdmin.value = false
    }
  })
})

const firebaseLogout = () => {
  signOut(auth)
    .then(() => {
      alert('Sign out success')
      user.value = null
      isAdmin.value = false
      router.push('/FirebaseSigninView')
    })
    .catch((error) => {
      console.error('Logout error', error)
      alert('Sign out failed')
    })
}
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <div class="nav-item me-3">
        <router-link to="/HomePage" class="navbar-brand" exact-active-class="active-link">
          <i class="bi bi-house fs-3"></i> HomePage
        </router-link>
      </div>

      <ul class="nav">
        <li class="nav-item me-3">
          <router-link to="/FindPage" class="nav-link" exact-active-class="active-link">
            <i class="bi bi-search"></i> Find a charity
          </router-link>
        </li>
        <li class="nav-item me-3">
          <router-link to="/FeedbackPage" class="nav-link" exact-active-class="active-link">
            <i class="bi bi-chat-dots"></i> Feedback
          </router-link>
        </li>
        <li class="nav-item me-3">
          <router-link to="/mapFirst" class="nav-link" exact-active-class="active-link">
            <i class="bi bi-geo-alt"></i> Map
          </router-link>
        </li>

        <li class="nav-item dropdown">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle"></i>
            <span v-if="user">{{ user.email }}</span>
            <span v-else>Account</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-if="!user">
              <router-link to="/FirebaseSigninView" class="dropdown-item">
                <i class="bi bi-box-arrow-in-right"></i> Sign In
              </router-link>
            </li>
            <li v-if="!user">
              <router-link to="/FirebaseRegisterView" class="dropdown-item">
                <i class="bi bi-person-plus"></i> Sign Up
              </router-link>
            </li>
            <li v-if="user && isAdmin">
              <router-link to="/AdminDashboard" class="dropdown-item">
                <i class="bi bi-speedometer2"></i> Admin Dashboard
              </router-link>
            </li>
            <li v-if="user">
              <button class="dropdown-item" @click="firebaseLogout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.bi {
  font-size: 1.2rem;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.active-link {
  color: #0d6efd !important;
  font-weight: bold;
  border-bottom: 2px solid #0d6efd;
}
</style>
