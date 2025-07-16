<script setup>
import { onMounted } from 'vue'
import { getDoc, updateDoc, doc, increment} from 'firebase/firestore'
import db from '@/firebase/init' // Firebase 初始化文件
import BHeader from './components/BHeader.vue'

// 自动更新访问统计
onMounted(async () => {
  const docRef = doc(db, 'analytics', 'dashboardStats')

  try {
    const snapshot = await getDoc(docRef)
    const todayIndex = new Date().getDay() // 0: Sunday ... 6: Saturday

    // 处理 visitTrend 数组（如果不存在或长度不够）
    let visitTrend = Array(7).fill(0)
    if (snapshot.exists()) {
      const data = snapshot.data()
      if (Array.isArray(data.visitTrend)) {
        visitTrend = [...data.visitTrend]
      }
    }

    visitTrend[todayIndex] = (visitTrend[todayIndex] || 0) + 1

    // 更新 totalVisits 和 visitTrend
    await updateDoc(docRef, {
      totalVisits: increment(1),
      visitTrend: visitTrend
    })

    // 处理 uniqueVisitors（localStorage 限制重复）
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      await updateDoc(docRef, {
        uniqueVisitors: increment(1)
      })
      localStorage.setItem('hasVisited', 'true')
    }
  } catch (error) {
    console.error('📊 Failed to update analytics:', error)
  }
})
</script>

<template>
  <div class="main-container">
    <header>
      <BHeader />
    </header>
    <main class="main-box">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
#layout {
  flex: 1;
  display: flex;
  position: relative;
}
</style>
