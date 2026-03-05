import { config } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
  }

  info(message: string, meta?: any): void {
    if (config.isTest) return;
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: any): void {
    if (config.isTest) return;
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, meta?: any): void {
    if (config.isTest) return;
    console.error(this.formatMessage('error', message, meta));
  }

  debug(message: string, meta?: any): void {
    if (config.isDevelopment) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

export const logger = new Logger();