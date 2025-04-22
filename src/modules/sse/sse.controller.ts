import { Controller, Sse, MessageEvent, Injectable } from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('events')
  events(): Observable<MessageEvent> {
    return this.sseService.events.pipe(
      map((data) => ({
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
