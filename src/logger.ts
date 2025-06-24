import { context, trace } from '@opentelemetry/api'
import {pino} from 'pino'

export const logger = pino().child({}, {
  formatters: {
    log(object) {
      const span = trace.getActiveSpan()
      if (span) {
        const spanContext = span.spanContext()
        return {
          ...object,
          trace_id: spanContext.traceId,
          span_id: spanContext.spanId,
        }
      }
      return object
    },
  },
})
