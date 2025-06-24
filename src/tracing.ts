import * as opentelemetry from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// const instrumentations = [new HttpInstrumentation(), new PinoInstrumentation()]
const sdk = new opentelemetry.NodeSDK({
  logRecordProcessors: [new opentelemetry.logs.BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318') + '/v1/logs',
    })
  )
  ],
  // new opentelemetry.logging.ConsoleLogRecordProcessor(),
  spanProcessors: [new opentelemetry.tracing.SimpleSpanProcessor(new OTLPTraceExporter({
    url: (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318') + '/v1/traces',
  }))],
  instrumentations: [
    new PinoInstrumentation({
      disableLogCorrelation: false,
      disableLogSending: false,
    }),
  ],
  // instrumentations: [new HttpInstrumentation(), new PinoInstrumentation()],
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


import { trace, context, SpanStatusCode } from '@opentelemetry/api'
import type { Context, Next } from 'hono'


export function withSpan(handler: (c: Context, next: Next) => Promise<Response> | Response) {
  return async (c: Context, next: Next): Promise<Response> => {
    const tracer = trace.getTracer('hono-handler')
    const spanName = handler.name || 'anonymous-handler'

    return tracer.startActiveSpan(spanName, async (span) => {
      try {
        const result = await handler(c, next)
        span.setStatus({ code: SpanStatusCode.OK }) // 1 = OK
        return result
      } catch (err) {
        span.recordException(err as Error)
        span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) })
        throw err
      } finally {
        span.end()
      }
    })
  }
} 