'use client'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface ILogger {
  debug(message: string, meta?: any): void
  info(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  error(message: string, meta?: any): void
}

class ClientLogger implements ILogger {
  private context: string
  private isDev: boolean

  constructor(context: string) {
    this.context = context
    this.isDev = process.env.NODE_ENV === 'development'
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`
  }

  debug(message: string, meta?: any): void {
    if (this.isDev) {
      console.debug(this.formatMessage('debug', message), meta || '')
    }
  }

  info(message: string, meta?: any): void {
    console.info(this.formatMessage('info', message), meta || '')
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message), meta || '')
  }

  error(message: string, meta?: any): void {
    console.error(this.formatMessage('error', message), meta || '')
  }
}

export const createLogger = (context: string): ILogger => {
  return new ClientLogger(context)
}
