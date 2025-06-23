import pino from 'pino'

// const mapSeverity = (level) => {
//     const severityMap = {
//         fatal: 21, // FATAL
//         error: 17, // ERROR
//         warn: 13, // WARN
//         info: 9, // INFO
//         debug: 5, // DEBUG
//         trace: 1, // TRACE
//     };
//     return severityMap[level] || 9; // Default to INFO
// };


// const file = join(tmpdir(), `pino-${process.pid}-example`)

const transport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',
            options: {
                destination: 1,
            }
        },
        {
            target: 'pino-opentelemetry-transport',
            options: {
                logRecordProcessorOptions: [
                    {
                        recordProcessorType: 'batch',
                        exporterOptions: {
                            protocol: 'grpc',
                            grpcExporterOptions: {
                                headers: { foo: 'some custom header' }
                            }
                        }
                    },
                ],
                loggerName: 'test-logger',
                serviceVersion: '1.0.0'

            }
        }
    ]
})

export const logger = pino(transport)
