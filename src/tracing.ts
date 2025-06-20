import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { pino } from 'pino'
import path from 'path'
import { fileURLToPath } from 'url'

import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'
import * as opentelemetry from '@opentelemetry/sdk-node'

// Enable internal debug logging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transport = pino.transport({
  target: path.join(__dirname, 'lib', 'pino-otel-transport'),
})


const instrumentations = [new HttpInstrumentation(), new PinoInstrumentation()]
const traceExporter = new ConsoleSpanExporter()

const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations,
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'hono-app',
  }),
})

async function initTracing() {
  try {
    await sdk.start()
    console.log('✅ OpenTelemetry SDK started')
  } catch (err) {
    console.error('❌ Error starting OpenTelemetry SDK', err)
  }
  
  process.on('SIGTERM', async () => {
    try {
      await sdk.shutdown()
      console.log('🛑 OpenTelemetry SDK shut down')
    } catch (err) {
      console.error('❌ Error shutting down OpenTelemetry SDK', err)
    }
  })
}

initTracing()

const logger = pino(transport)
export default logger
