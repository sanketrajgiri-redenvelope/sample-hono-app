// import './tracing.js'
import {logger} from "./logger.js"
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { context, trace } from '@opentelemetry/api'


import homeHandler from './handlers/home.js'
import aboutHandler from './handlers/about.js'

const app = new Hono()


function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Apply middleware
app.use('*',async (c, next) => {
  logger.info(`${c.req.method} ${c.req.url}`)
  await next()
})

// Define routes
app.get('/', homeHandler)
app.get('/about', aboutHandler)

app.get('/debug', async (c) => {
  const tracer = trace.getTracer('debug-tracer')
  const span = tracer.startSpan('manual-span')

  span.addEvent('handling /debug route')
  logger.info('Debug route accessed', { spanId: span.spanContext().spanId, traceId: span.spanContext().traceId })
  span.end()

  return c.text('Debug span sent!')
})

app.get('/rolldice', async(c) => {
  return c.text(getRandomNumber(1, 6).toString());
});

// Start the server
serve({ fetch: app.fetch, port: 3000 })
logger.info('🚀 Hono server running at http://localhost:3000')
