import mongoose from 'mongoose'

import { MONGO_URI } from './Environment.config.js'

/**
 * Connects to the database (MongoDB)
 */
const ConnectToDatabase                     = async () => {
  try {
    await mongoose.connect(MONGO_URI)

    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

export {
  ConnectToDatabase as default,
}
