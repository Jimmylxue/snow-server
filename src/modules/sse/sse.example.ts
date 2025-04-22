import { Injectable } from '@nestjs/common';
import { SseService } from './sse.service';

@Injectable()
export class ExampleService {
  constructor(private readonly sseService: SseService) {
    // 启动定时任务，每5秒发送一次数据
    setInterval(() => {
      this.sendRandomData();
    }, 5000);
  }

  // 发送随机数据
  private sendRandomData() {
    const data = {
      value: Math.random(),
      sequence: Date.now(),
      type: 'random_data',
    };
    this.sseService.emit(data);
  }

  // 发送自定义消息
  public sendCustomMessage(message: string) {
    const data = {
      message,
      type: 'custom_message',
      timestamp: new Date().toISOString(),
    };
    this.sseService.emit(data);
  }
}
