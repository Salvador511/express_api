import express from 'express'

import { ObjectId } from 'mongodb'
import { omit, has } from 'ramda'

import db from '../db/config.js'

const router = express.Router()
const collection = await db.collection('users')

router.get('/', async (req, res) => {
  const result = await collection.find().toArray()
  const response = result.reverse().reduce((acc, u) => {
    const user = omit(['password', '_id'], u)
    return {
      ...acc,
      [u?._id]: {
        id: u?._id,
        ...user,
      }
    }
  }, {})
  res.send(response).status(200)
})

router.get('/:id', async (req, res) => {
  const result = await collection.findOne({ _id: new ObjectId(req.params.id) })
  if (!result) {
    res.send({ Error: 'Not found' }).status(404)
  } else {
    const cleanResult = omit(['password', '_id'], result)
    const response = {
      [result._id]: {
        id: result?._id,
        ...cleanResult
      }
    }
    res.send(response).status(200)
  }
})

router.post('/', async (req, res) => {
  const data = req.body
  const result = await collection.insertOne(data)
  const response = omit([
    '_id',
    'password',
    'insertedId',
    'acknowledged'
  ], { ...data, ...result, id: result.insertedId })
  res.send({
    [response?.id]: {...response}
  }).status(204)
})

router.put('/:id', async (req, res) => {
  const userId = { _id: new ObjectId(req.params.id) }
  const hasName = has('name', req.body)
  const hasEmail = has('email', req.body)
  const hasPassword = has('password', req.body)

  if (!(hasName && hasEmail && hasPassword)) {
    res.send({ Error: 'missing some values' }).status(404)
    return null
  }

  await collection.updateOne(userId, { $set: { ...req.body } })
  const updatedUser = await collection.findOne(userId)
  const response = omit(['password','_id'], updatedUser)
  res.send({
    [req.params.id]: {
      id: req.params.id,
      ...response
    }
  }).status(200)
})

router.patch('/:id', async (req, res) => {
  const userId = { _id: new ObjectId(req.params.id) }

  await collection.updateOne(userId, { $set: { ...req.body } })
  const updatedUser = await collection.findOne(userId)
  const response = omit(['password', '_id'], updatedUser)
  res.send({
    [req.params.id]: {
      id: req.params.id,
      ...response
    }
  }).status(200)
})

router.delete('/:id', async (req, res) => {
  const userId = { _id: new ObjectId(req.params.id) }

  const test = await collection.findOne({ _id: new ObjectId(req.params.id) })
  if (!test) {
    res.send({ Error: 'Not found' }).status(404)
  } else {
    const result = await collection.deleteOne(userId)
    res.send({ id: req.params.id, deleted: 'succeed' }).status(200)
  }
})

export default router
