import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}] ${level}: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`
    })
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),
  ],
})

// 开发环境下的额外配置
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}

// 定义日志级别接口
export interface ILogger {
  debug(message: string, meta?: any): void
  info(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  error(message: string, meta?: any): void
}

// 创建日志工具类
class Logger implements ILogger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  debug(message: string, meta: any = {}) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`[${this.context}] ${message}`, meta)
    }
  }

  info(message: string, meta: any = {}) {
    logger.info(`[${this.context}] ${message}`, meta)
  }

  warn(message: string, meta: any = {}) {
    logger.warn(`[${this.context}] ${message}`, meta)
  }

  error(message: string, meta: any = {}) {
    logger.error(`[${this.context}] ${message}`, meta)
  }
}

export const createLogger = (context: string): ILogger => {
  return new Logger(context)
}
