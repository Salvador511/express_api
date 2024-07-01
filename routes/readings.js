import express from 'express'

import { ObjectId } from 'mongodb'

import db from '../db/config.js'

const router = express.Router()
const collection = await db.collection('readings')

router.get('/', async (req, res) => {
  res.send('API REST request succeed').status(200)
})

router.get('/all', async (req, res) => {
  const result = await collection.find({}).toArray()
  const response = result.reverse()
  res.send(response).status(200)
})

router.post('/', async (req, res) => {
  const data = req.body
  const response = await collection.insertOne(data)
  res.send(String(response.insertedId)).status(200)
})

router.delete('/:id', async (req, res) => {
  const readingId = { _id: new ObjectId(req.params.id) }
  const test = await collection.findOne(readingId)
  if (!test) {
    res.send({ Error: 'Not found' }).status(404)
  } else {
    const result = await collection.deleteOne(readingId)
    res.send({ id: req.params.id, deletedCount: result.deletedCount }).status(200)
  }
})

export default router
