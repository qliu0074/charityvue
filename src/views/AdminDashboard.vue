<template>
  <div class="dashboard-container">
    <h1 class="title">Website Analytics Dashboard</h1>

    <div class="stats-row">
      <div class="stat-card bg-primary text-white">
        <h4>Total Visits</h4>
        <p class="stat-value">{{ totalVisits }}</p>
      </div>
      <div class="stat-card bg-success text-white">
        <h4>Unique Visitors</h4>
        <p class="stat-value">{{ uniqueVisitors }}</p>
      </div>
      <div class="stat-card bg-info text-white">
        <h4>Feedback Count</h4>
        <p class="stat-value">{{ feedbackCount }}</p>
      </div>
      <div class="stat-card bg-dark text-white">
        <h4>FindPage Searches</h4>
        <p class="stat-value">{{ findPageSearchCount }}</p>
      </div>
      <div class="stat-card bg-secondary text-white">
        <h4>Map Searches</h4>
        <p class="stat-value">{{ mapSearchCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const db = getFirestore()

const totalVisits = ref(0)
const uniqueVisitors = ref(0)
const feedbackCount = ref(0)
const findPageSearchCount = ref(0)
const mapSearchCount = ref(0)

onMounted(async () => {
  const docRef = doc(db, 'analytics', 'dashboardStats')
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    const data = snapshot.data()
    totalVisits.value = data.totalVisits || 0
    uniqueVisitors.value = data.uniqueVisitors || 0
    feedbackCount.value = data.feedbackCount || 0
    findPageSearchCount.value = data.findPageSearchCount || 0
    mapSearchCount.value = data.mapSearchCount || 0
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 30px;
  max-width: 1200px;
  margin: auto;
}

.title {
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.stats-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.stat-card {
  flex: 1;
  min-width: 250px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 2rem;
  margin-top: 10px;
}
</style>
