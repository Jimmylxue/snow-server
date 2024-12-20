import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { SystemException } from '.';
import { ErrorCode } from './errorCode';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LoginStatus,
  User,
} from '@src/modules/admin/system/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<Error> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(LoggerService) private readonly logger: LoggerService,
    private jwtService: JwtService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status != HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.systemInfo(exception);
    } else {
      this.logger.systemError(exception);
    }

    if (exception instanceof SystemException) {
      response.status(status).json({
        code: exception.getErrorCode(),
        message: exception.getErrorMessage(),
        data: {
          date:
            new Date().toLocaleDateString() +
            ' ' +
            new Date().toLocaleTimeString(),
          path: request.url,
        },
        result: exception.getOtherMessage(),
      });
    } else if (exception instanceof UnauthorizedException) {
      const token = request.headers['authorization']?.split(' ')?.[1];
      let userId = null;
      if (token) {
        try {
          const decoded = this.jwtService.verify(token, {
            ignoreExpiration: true,
          });
          userId = decoded.userId;
        } catch (error) {}
      }

      if (userId) {
        this.userRepository.update(userId, {
          loginStatus: LoginStatus.下线,
        });
      }
      response.status(status).json({
        code: 401,
        message: exception.message,
        data: {
          date:
            new Date().toLocaleDateString() +
            ' ' +
            new Date().toLocaleTimeString(),
          path: request.url,
        },
      });
    } else {
      // @ts-ignore
      // @ts-ignore
      const errorResponse = exception?.response?.message;
      // @ts-ignore
      const dtoErrorMessage =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse?.join('-');
      // dot拦截时触发的错误 => 参数错误 => 手动赋值一个参数错误
      response.status(status).json({
        code: ErrorCode.REQUEST_PARAMS_ERROR_CODE,
        message: dtoErrorMessage || exception.message,
        data: {
          date:
            new Date().toLocaleDateString() + new Date().toLocaleTimeString(),
          path: request.url,
        },
      });
    }
  }
}
