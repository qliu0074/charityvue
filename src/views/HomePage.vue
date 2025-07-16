<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero text-center text-white d-flex align-items-center justify-content-center flex-column">
      <h1 class="display-4 fw-bold">Welcome to Charity Explorer</h1>
      <p class="lead">Discover, connect with, and support charities that matter to you.</p>
      <router-link to="/FindPage" class="btn btn-light btn-lg mt-3">
        Explore Charities
      </router-link>
    </section>

    <!-- Features Section -->
    <section class="features py-5 container text-center">
      <h2 class="mb-4">Why Use Our Platform?</h2>
      <div class="row">
        <div class="col-md-4 mb-4">
          <i class="bi bi-search fs-1 text-primary"></i>
          <h4 class="mt-3">Smart Search</h4>
          <p>Find charities by name, type, or location with our intuitive filters.</p>
        </div>
        <div class="col-md-4 mb-4">
          <i class="bi bi-map fs-1 text-success"></i>
          <h4 class="mt-3">Interactive Map</h4>
          <p>Visualize the reach of charities around the world.</p>
        </div>
        <div class="col-md-4 mb-4">
          <i class="bi bi-chat-square-heart fs-1 text-danger"></i>
          <h4 class="mt-3">Community Feedback</h4>
          <p>Share and read reviews to make informed giving decisions.</p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta text-center text-white py-5">
      <h2>Join us in making a difference</h2>
      <p class="mb-4">Sign up now to start exploring and supporting the causes you care about.</p>
      <router-link to="/FirebaseRegisterView" class="btn btn-outline-light btn-lg">Get Started</router-link>
    </section>
  </div>
</template>

<script setup>
// No script needed for static layout
</script>

<style scoped>
.homepage {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hero Banner */
.hero {
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('https://source.unsplash.com/1600x600/?charity,volunteer') center/cover no-repeat;
  height: 60vh;
  padding: 60px 20px;
}

/* Features */
.features .bi {
  font-size: 3rem;
}

/* CTA Section */
.cta {
  background-color: #343a40;
  padding: 50px 20px;
}
</style>
