<template>
  <div class="charity-page">
    <!-- Banner Section -->
    <section class="banner text-white text-center py-5">
      <h1 class="display-5 fw-bold">Explore Trusted Charities</h1>
      <p class="lead">Discover organizations across the globe and support causes that matter.</p>
    </section>

    <!-- Filter Form -->
    <div class="container py-4">
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <label class="form-label">Charity Name</label>
          <input v-model="filters.name" type="text" class="form-control" placeholder="Search by name" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Location</label>
          <input v-model="filters.location" type="text" class="form-control" placeholder="Search by location" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Type</label>
          <select v-model="filters.type" class="form-select">
            <option value="">All</option>
            <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="text-end mb-4">
        <button class="btn btn-primary" @click="applyFilters">
          <i class="bi bi-search"></i> Search
        </button>
      </div>

      <!-- Results Table -->
      <div v-if="searchTriggered">
        <h5 class="mb-3">All Matching Charities</h5>

        <div class="table-responsive mb-4">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Type</th>
                <th>Description</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="charity in paginatedCharities" :key="charity.id">
                <td>{{ charity.name }}</td>
                <td>
                  <a :href="`/mapFirst?location=${encodeURIComponent(charity.location)}`"
                     class="text-primary text-decoration-underline">
                    {{ charity.location }}
                  </a>
                </td>
                <td>{{ charity.type }}</td>
                <td>{{ charity.description }}</td>
                <td>
                  <a :href="charity.website" target="_blank">Visit</a>
                </td>
              </tr>
              <tr v-if="paginatedCharities.length === 0">
                <td colspan="5" class="text-center text-muted">No results found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="prevPage">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
        </div>

        <!-- Clear Button -->
        <div class="text-end mb-4">
          <button class="btn btn-outline-danger" @click="clearFilters">
            <i class="bi bi-x-circle"></i> Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore'

const db = getFirestore()
const statRef = doc(db, 'dashboardStats', 'main')

const charities = ref([
  { id: 1, name: 'Red Cross', location: 'Melbourne, Australia', type: 'Disaster Relief', description: 'Providing emergency assistance, disaster relief and education.', website: 'https://www.redcross.org.au/' },
  { id: 2, name: 'UNICEF', location: 'New York, USA', type: 'Children Welfare', description: 'Works for children’s rights, survival, development and protection.', website: 'https://www.unicef.org/' },
  { id: 3, name: 'Feeding America', location: 'Chicago, USA', type: 'Food Assistance', description: 'Nationwide network of food banks to feed the hungry.', website: 'https://www.feedingamerica.org/' },
  { id: 4, name: 'Beyond Blue', location: 'Sydney, Australia', type: 'Mental Health', description: 'Supporting mental health and wellbeing across Australia.', website: 'https://www.beyondblue.org.au/' },
  { id: 5, name: 'Oxfam International', location: 'Nairobi, Kenya', type: 'Poverty Alleviation', description: 'Global movement to end the injustice of poverty.', website: 'https://www.oxfam.org/' },
  { id: 6, name: 'World Wildlife Fund', location: 'Gland, Switzerland', type: 'Environmental Protection', description: 'Conserving nature and reducing threats to biodiversity.', website: 'https://www.worldwildlife.org/' },
  { id: 7, name: 'Save the Children', location: 'London, UK', type: 'Children Welfare', description: 'Helping children survive, learn and thrive.', website: 'https://www.savethechildren.net/' },
  { id: 8, name: 'Doctors Without Borders', location: 'Paris, France', type: 'Healthcare', description: 'Medical humanitarian organization providing care worldwide.', website: 'https://www.doctorswithoutborders.org/' }
])

const types = ['Disaster Relief', 'Children Welfare', 'Food Assistance', 'Mental Health', 'Poverty Alleviation', 'Environmental Protection', 'Healthcare']
const filters = ref({ name: '', location: '', type: '' })
const activeFilters = ref({ name: '', location: '', type: '' })
const searchTriggered = ref(false)
const currentPage = ref(1)
const rowsPerPage = 3

const applyFilters = async () => {
  activeFilters.value = { ...filters.value }
  searchTriggered.value = true
  currentPage.value = 1
  // 🔄 增加 findPageSearchCount 统计
  try {
    await updateDoc(statRef, { findPageSearchCount: increment(1) })
  } catch (e) {
    console.error('Failed to increment findPageSearchCount:', e)
  }
}

const filteredCharities = computed(() =>
  charities.value.filter(c =>
    c.name.toLowerCase().includes(activeFilters.value.name.toLowerCase()) &&
    c.location.toLowerCase().includes(activeFilters.value.location.toLowerCase()) &&
    (!activeFilters.value.type || c.type === activeFilters.value.type)
  )
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCharities.value.length / rowsPerPage)))
const paginatedCharities = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return filteredCharities.value.slice(start, start + rowsPerPage)
})

const clearFilters = () => {
  filters.value = { name: '', location: '', type: '' }
  activeFilters.value = { name: '', location: '', type: '' }
  searchTriggered.value = false
  currentPage.value = 1
}

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
</script>

<style scoped>
.charity-page {
  background-color: #f5f8fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.banner {
  background: linear-gradient(rgba(0, 102, 153, 0.9), rgba(0, 153, 204, 0.9)),
              url('https://source.unsplash.com/1600x400/?volunteer,charity') center/cover no-repeat;
  color: white;
}

input.form-control,
select.form-select {
  border-radius: 6px;
}

.table th,
.table td {
  vertical-align: middle;
}

a.text-primary {
  cursor: pointer;
}
</style>
