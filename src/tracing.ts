
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'
import * as opentelemetry from '@opentelemetry/sdk-node'
import { registerInstrumentations } from '@opentelemetry/instrumentation'


const instrumentations = [new HttpInstrumentation(), new PinoInstrumentation()]




const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // ...,
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      }
    }),
  ],
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
