import { createLogger, format, transports } from 'winston';
const customColors = {
    error: 'bold red',
    warn: 'bold yellow',
    info: 'bold green',
    debug: 'bold blue',
};
import winston from 'winston';
winston.addColors(customColors);

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug', // Only log errors in production
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Errors logged to file
        new transports.File({ filename: 'logs/combined.log' }) // All logs in a combined file
    ]
});

// In production, you may only want errors logged to the console
if (process.env.NODE_ENV === 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

export default logger;
