import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ADMIN_KEY } from '../decorators/admin.decorator';
import { Role } from '@src/modules/admin/system/user/entities/user.entity';

@Injectable()
export class AdminInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requiredRole = this.reflector.get<Role>(
      ADMIN_KEY,
      context.getHandler(),
    );

    if (requiredRole) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('未登录用户');
      }

      const userRole = user.role;

      // 检查用户角色权限
      // 1. 如果要求超级管理员权限，用户必须是超级管理员
      // 2. 如果要求管理员权限，用户可以是管理员或超级管理员
      // 3. 如果要求普通用户权限，用户可以是普通用户、管理员或超级管理员
      if (
        userRole < requiredRole || // 用户角色等级低于要求
        (userRole === Role.普通用户 && requiredRole > Role.普通用户) || // 普通用户不能访问更高权限
        (userRole === Role.管理员 && requiredRole === Role.超级管理员) // 管理员不能访问超管权限
      ) {
        const roleNames = {
          [Role.超级管理员]: '超级管理员',
          [Role.管理员]: '管理员',
          [Role.普通用户]: '普通用户',
        };
        throw new ForbiddenException(
          `需要${roleNames[requiredRole]}权限，当前用户权限不足`,
        );
      }
    }

    return next.handle();
  }
}
