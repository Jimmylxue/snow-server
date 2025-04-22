import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  public events = new Subject<any>();

  emit(data: any) {
    console.log('emit', data);
    this.events.next(data);
  }

  subscribe(callback: (data: any) => void) {
    return this.events.subscribe(callback);
  }
}
