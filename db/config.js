import { MongoClient } from 'mongodb'
import { ATLAS_URI } from '../config.js'

const connectionString = ATLAS_URI ?? ''

const client = new MongoClient(connectionString)

let connection
try {
  connection = await client.connect()
} catch (error) {
  // This is not a good practice to handle errors, this should have a better error handle
  console.error(error)
}

export default connection.db('your_own_database_name')
