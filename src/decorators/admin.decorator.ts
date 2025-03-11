import { SetMetadata } from '@nestjs/common';
import { Role } from '@src/modules/admin/system/user/entities/user.entity';

export const ADMIN_KEY = 'admin_role';
export const Admin = (requiredRole: Role = Role.管理员) =>
  SetMetadata(ADMIN_KEY, requiredRole);
