import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { formatUserInfo } from './core/core';
import { MESSAGE_TYPE, TMessage, TUser } from './type';

@WebSocketGateway(8080, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer() server: Server;
  userList: Set<TUser> = new Set();

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log('接收identity的数据', data);
    return 1;
  }
  PublicMessage(message: string): void {
    setInterval(() => {
      this.server.emit('exception', `我是服务端发来的消息${message}`);
    }, 1000);
  }

  @SubscribeMessage('login')
  login(client: Socket) {
    const user = formatUserInfo(client.id, Array.from(this.userList));
    if (!this.userList.has(user)) {
      this.userList.add(user);
      // 广播一下 有新用户登录了
      this.server.emit('message', {
        type: MESSAGE_TYPE.登录消息,
        text: `${user.name}进入了小黑屋`,
        memberCount: this.userList.size,
        memberInfo: user,
        userList: Array.from(this.userList),
      });
    }
    client.on('disconnect', () => {
      const deleteUser = Array.from(this.userList).find(
        (user) => user.socketId === client.id,
      );
      if (deleteUser && this.userList.has(deleteUser)) {
        this.userList.delete(deleteUser);
        // 广播一下 有用户退出登录了
        this.server.emit('message', {
          type: MESSAGE_TYPE.登出消息,
          text: `${deleteUser.name}退出了小黑屋`,
          memberCount: this.userList.size,
          memberInfo: deleteUser,
          userList: Array.from(this.userList),
        });
      }
    });
  }

  @SubscribeMessage('logout')
  logout(client: Socket) {}

  @SubscribeMessage('sendMessage')
  sendMessage(_: Socket, payload: TMessage) {
    this.server.emit('message', {
      ...payload,
      userList: Array.from(this.userList),
    });
  }

  @SubscribeMessage('addCart')
  addCart(client: any, payload: any) {
    console.log({
      client,
      payload,
    });

    // client.broadcast.emit('back', { ...payload, key: 'back' });
    this.server.emit('back', { ...payload, key: 'back' });

    // var roomid = url.parse(client.request.url, true).query
    //   .roomid; /*获取房间号 获取桌号*/
    // client.join(roomid);
    // // this.server.to(roomid).emit('addCart','Server AddCart Ok');    //广播所有人包含自己

    // client.broadcast.to(roomid).emit('addCart', 'Server AddCart Ok'); //不包括自己
  }
}
