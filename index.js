import express from 'express'

const app = express()

app.get('/upload', (req, res) => {
  console.log("test")
})

app.listen(3000)