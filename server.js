import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

// 创建 Express 实例
const app = express()

app.use(cors())

const arrayOfValidOrigins = ['http://localhost:5173', 'http://your-production-url.com']

// CORS 中间件
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (arrayOfValidOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, HEAD, PUT, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.json())

app.post('/api/send-email', (req, res) => {
  const { fromEmail, toEmail, subject, textPart } = req.body

  if (fromEmail && toEmail && subject && textPart) {
    res.status(200).json({
      message: 'Email sent successfully',
      result: {
        from: fromEmail,
        to: toEmail,
        subject: subject
      }
    })
  } else {
    // 如果缺少必要信息，返回 500 错误
    res.status(500).json({
      message: 'Failed to send email, missing required fields'
    })
  }
})

// 设置服务器监听的端口
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
