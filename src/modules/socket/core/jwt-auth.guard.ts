import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@src/modules/admin/system/auth/constats';
import { Socket } from 'socket.io';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromSocket(client);

    try {
      const user = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      // @ts-ignore
      client.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }

  private extractTokenFromSocket(client: Socket): string {
    // console.log('token', client);
    // 从 client.handshake.headers 或 client.data 中提取 token
    return client.handshake.auth.token;
  }
}
