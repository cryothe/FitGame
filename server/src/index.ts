import cors from 'cors'
import express from 'express'
import { login, me, register, requireAuth } from './auth'

const app = express()
const PORT = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'fitgame-api' })
})

app.post('/auth/register', register)
app.post('/auth/login', login)
app.get('/auth/me', requireAuth, me)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FitGame API listening on http://0.0.0.0:${PORT}`)
})
