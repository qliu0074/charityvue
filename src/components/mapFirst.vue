<template>
  <div class="map-wrapper">
    <button class="back-button" @click="goHome">Back to Find Page</button>
    <button class="exit-button" @click="exitMap">Exit</button>
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import db from '@/firebase/init' // ✅ 你自己的 Firebase 初始化文件
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()

    const recordMapSearch = async () => {
      const statsRef = doc(db, 'analytics', 'dashboardStats')
      const snapshot = await getDoc(statsRef)

      if (!snapshot.exists()) {
        await setDoc(statsRef, { mapSearchCount: 1 })
      } else {
        await updateDoc(statsRef, { mapSearchCount: increment(1) })
      }
    }

    onMounted(() => {
      // ✅ 确保此元素在页面中
      const mapContainer = document.getElementById('map')
      if (!mapContainer) {
        console.error('Map container not found!')
        return
      }

      mapboxgl.accessToken = 'pk.eyJ1IjoicWlueWlsaXUiLCJhIjoiY20yYWJ0NjRrMGVvajJrcHlrOTNqZ3FiZCJ9.7f6Qjb8Mk5lGWrf6BKPUXA'

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [151.2093, -33.8688],
        zoom: 8
      })

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Search for places'
      })

      map.addControl(geocoder)

      geocoder.on('result', (e) => {
        const coords = e.result.geometry.coordinates
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat(coords)
          .addTo(map)
        map.flyTo({ center: coords, zoom: 12 })

        // ✅ 每次搜索记录一次
        recordMapSearch()
      })

      const passedLocation = route.query.location
      if (passedLocation) {
        setTimeout(() => {
          geocoder.query(passedLocation)
        }, 1000)
      }
    })

    const goHome = () => {
      router.push('/FindPage')
    }

    const exitMap = () => {
      router.push('/HomePage')
    }

    return {
      goHome,
      exitMap
    }
  }
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
}

.map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.back-button,
.exit-button {
  position: absolute;
  z-index: 2;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-button {
  top: 10px;
  left: 10px;
}

.exit-button {
  top: 10px;
  right: 10px;
  background-color: #555;
}

.back-button:hover {
  background-color: #d32f2f;
}

.exit-button:hover {
  background-color: #333;
}
</style>
