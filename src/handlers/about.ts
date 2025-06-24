import type { Context } from 'hono'
import { logger } from '../logger.js' 
import { withSpan } from '../tracing.js'

const aboutHandler = (c: Context) => {
  logger.info('About handler executed')
  return c.text('This is the About Page built with Hono and TypeScript.')
}

export default withSpan(aboutHandler)
