import express, { response } from 'express'
import { insertLand, getNearest } from './db-code.js'

const app = express()
app.use(express.json())

// inserts "land" document into database
app.post('/insert', async(req, res) => {
  const result = await insertLand(req.body)
  
  if (result.acknowledged) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

// gets nearest n lands 
app.get('/nearest', async(req, res) => {
  const result = await getNearest(req.body)
  res.send(result)
  // for getNearest to work need to createIndex
})

app.listen(3000)