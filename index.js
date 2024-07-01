import express from 'express'
import cors from 'cors'
import users from './routes/users.js'
import readings from './routes/readings.js'
import students from './routes/students.js'

import { PORT } from './config.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', users)
app.use('/readings', readings)
app.use('/students', students)
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`)
})
