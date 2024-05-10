import { Module } from '@nestjs/common';
import { TaskModule } from './modules/task/task.module';
import { TaskTypeModule } from './modules/taskType/taskType.module';
import { BaseModule } from './modules/base/base.module';

@Module({
  imports: [TaskTypeModule, TaskModule, BaseModule],
  providers: [],
  controllers: [],
})
export class TodoListModule {}
