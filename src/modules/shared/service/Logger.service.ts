import { Injectable, Logger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService extends Logger {
  /**
   * 前端级别  系统错误 Logger 实例
   */
  private readonly clientErrorInstance = createLogger({
    level: 'error',
    format: format.combine(
      format.timestamp(),
      format.label({ label: 'clientError' }),
      format.errors({ stack: true }),
      format.json(),
      format.printf((info) => {
        const message =
          typeof info.message === 'string'
            ? info.message
            : JSON.stringify(info.message);
        const data = JSON.stringify(info, null, 2);
        return `${info.timestamp} ${info.level}: ${message}\n${data}\n`;
      }),
    ),
    transports: [
      new transports.Console({
        format: format.simple(),
      }),
      new transports.File({ filename: 'logs/client/error-log.log' }),
    ],
  });

  /**
   * 用于上报 前端级别 系统错误的 方法
   * @param message Error
   */
  clientError(message: Error) {
    this.clientErrorInstance.error(message);
  }

  /**
   * 前端级别  系统警告 Logger 实例
   */
  private readonly clientInfoInstance = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.label({ label: 'clientInfo' }),
      format.errors({ stack: true }),
      format.json(),
      format.printf((info) => {
        const message =
          typeof info.message === 'string'
            ? info.message
            : JSON.stringify(info.message);
        const data = JSON.stringify(info, null, 2);
        return `${info.timestamp} ${info.level}: ${message}\n${data}\n`;
      }),
    ),
    transports: [
      new transports.Console({
        format: format.simple(),
      }),
      new transports.File({ filename: 'logs/client/info-log.log' }),
    ],
  });

  /**
   * 用于上报 前端级别 系统警告 的方法
   * @param message
   */
  clientInfo(message: Error) {
    this.clientInfoInstance.info(message);
  }

  /**
   * 后端级别  系统错误 Logger 实例
   */
  private readonly systemErrorInstance = createLogger({
    level: 'error',
    format: format.combine(
      format.timestamp(),
      format.label({ label: 'systemError' }),
      format.errors({ stack: true }),
      format.json(),
      format.printf((info) => {
        console.log('info', info);
        const message =
          typeof info.message === 'string'
            ? info.message
            : JSON.stringify(info.message);
        const data = JSON.stringify(info.message, null, 2);
        return `${info.timestamp} ${info.level}: ${message}\n${data}\n`;
      }),
    ),
    transports: [
      new transports.Console({
        format: format.simple(),
      }),
      new transports.File({ filename: 'logs/server/error-log.log' }),
    ],
  });

  /**
   * 用于上报 后端级别 系统错误的 方法
   * @param message
   */
  systemError(message: Error) {
    this.systemErrorInstance.error(message);
  }

  /**
   * 后端级别  系统警告 Logger 实例
   */
  private readonly systemInfoInstance = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.label({ label: 'systemInfo' }),
      format.errors({ stack: true }),
      format.json(),
      format.printf((info) => {
        const message =
          typeof info.message === 'string'
            ? info.message
            : JSON.stringify(info.message);
        const data = JSON.stringify(info, null, 2);
        return `${info.timestamp} ${info.level}: ${message}\n${data}\n`;
      }),
    ),
    transports: [
      new transports.Console({
        format: format.simple(),
      }),
      new transports.File({ filename: 'logs/server/info-log.log' }),
    ],
  });

  /**
   * 用于上报 后端级别 系统警告的 方法
   * @param message
   */
  systemInfo(message: Error) {
    this.systemInfoInstance.info(message);
  }
}
