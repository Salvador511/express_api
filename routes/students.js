import express from 'express'

import { ObjectId } from 'mongodb'
import db from '../db/config.js'

const router = express.Router()

const collection = await db.collection('students')

router.get('/', async(req, res) => {
  const result = await collection.find({}).toArray()
  const response = result.reverse()
  res.send(response).status(200)
})

router.post('/', async (req, res) => {
  const data = req.body
  const response = await collection.insertOne(data)
  const student = await collection.findOne(response.insertedId)
  res.send(student).status(200)
})

export default router
