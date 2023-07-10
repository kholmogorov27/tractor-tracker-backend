import express from 'express'

const app = express()

app.get('/upload', (req, res) => {
  console.log('data ' + req.query.data)
})

app.listen(3000)