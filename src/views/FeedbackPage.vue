<template>
  <div class="container mt-5">
    <Toast />
    <h1 class="text-center">Feedback Page</h1>
    <p class="text-center">Please rate your experience:</p>

    <form @submit.prevent="submitFeedback">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="mb-4" v-for="(question, index) in questions" :key="index">
            <label class="form-label">{{ question }}</label>
            <Rating v-model="ratings[index]" :cancel="false" :stars="5" />
          </div>

          <div class="mb-4">
            <label for="feedbackText" class="form-label">Additional Feedback</label>
            <textarea
              class="form-control"
              id="feedbackText"
              v-model="feedbackText"
              rows="4"
              placeholder="Enter your feedback here"
            ></textarea>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary">Submit Feedback</button>
          </div>
        </div>
      </div>
    </form>

    <div class="text-center mt-5">
      <button class="btn btn-secondary" @click="calculateAverageRatings">
        View Aggregated Rating
      </button>
    </div>

    <div v-if="showAggregatedRating" class="mt-5">
      <h4 class="text-center mb-4">Aggregated Ratings</h4>
      <AppChart
        type="bar"
        :data="{
          labels: questions,
          datasets: [
            {
              label: 'Average Score',
              data: averageRatings,
              backgroundColor: '#42A5F5'
            }
          ]
        }"
        :options="{
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 5
            }
          }
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Rating from 'primevue/rating'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import AppChart from 'primevue/chart'

import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore'

const db = getFirestore()
const statRef = doc(db, 'analytics', 'dashboardStats') // 确保路径正确

const toast = useToast()

const questions = ref([
  'Q1: Rate your overall user experience',
  'Q2: Rate the ease of navigation',
  'Q3: Rate the visual design',
  'Q4: Rate the loading speed of the website',
  'Q5: Rate the quality of the content'
])

const ratings = ref(Array(questions.value.length).fill(0))
const feedbackText = ref('')
const feedbackHistory = ref([])
const averageRatings = ref(Array(questions.value.length).fill(0))
const showAggregatedRating = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('feedbackHistory')
  if (stored) {
    feedbackHistory.value = JSON.parse(stored)
  }
})

const isValid = () => ratings.value.every((r) => r >= 1)

const submitFeedback = async () => {
  if (!isValid()) {
    toast.add({
      severity: 'warn',
      summary: 'Incomplete',
      detail: 'Please rate all questions',
      life: 3000
    })
    return
  }

  const newFeedback = {
    ratings: [...ratings.value],
    feedbackText: feedbackText.value,
    timestamp: new Date().toISOString()
  }

  feedbackHistory.value.push(newFeedback)
  localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory.value))

  // Firestore: 更新 feedbackCount
  try {
    await updateDoc(statRef, {
      feedbackCount: increment(1)
    })
  } catch (error) {
    console.error('Failed to update Firestore feedbackCount:', error)
  }

  toast.add({
    severity: 'success',
    summary: 'Thank you!',
    detail: 'Your feedback has been submitted',
    life: 3000
  })

  ratings.value = Array(questions.value.length).fill(0)
  feedbackText.value = ''
}

const calculateAverageRatings = () => {
  const totalRatings = Array(questions.value.length).fill(0)
  const counts = Array(questions.value.length).fill(0)

  feedbackHistory.value.forEach((entry) => {
    entry.ratings.forEach((rating, index) => {
      totalRatings[index] += rating
      counts[index]++
    })
  })

  averageRatings.value = totalRatings.map((total, index) =>
    counts[index] > 0 ? total / counts[index] : 0
  )

  showAggregatedRating.value = true
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 30px;
}

.form-label {
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

textarea {
  resize: none;
}

button {
  font-size: 1rem;
}
</style>
