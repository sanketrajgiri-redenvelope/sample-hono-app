import type { Context } from 'hono'
import {logger} from '../logger.js'

const aboutHandler = (c: Context) => {
  logger.info('ℹ️ About handler executed')
  return c.text('This is the About Page built with Hono and TypeScript.')
}

export default aboutHandler
