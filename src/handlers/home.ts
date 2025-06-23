import type { Context } from 'hono'
import {logger} from '../logger.js'

const homeHandler = (c: Context) => {
logger.info('🏠 Home handler executed')
  return c.text('Welcome to the Hono + TypeScript Home Page!')
}

export default homeHandler
