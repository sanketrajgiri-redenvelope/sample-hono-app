import pino from 'pino'

const logger = pino({
  level: 'info',
  base: {
    service: 'hono-app',
  },
  formatters: {
    level(label) {
      return { severity: label.toUpperCase() }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

export default logger