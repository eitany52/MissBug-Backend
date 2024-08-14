import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { msgRoutes } from './api/msg/msg.routes.js'

const app = express()
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174'
    ],
    credentials: true
}

// App Configuration
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'));

// Routes
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/msg', msgRoutes)

app.get('/', (req, res) => {
    res.send('hello there')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030;

app.listen(3030, () => console.log(`server ready at port ${port}`))