import { Module } from '@nestjs/common';
import { appController } from './app.controller';
import { FileService } from './app.service';

@Module({
  imports: [],
  controllers: [appController],
  providers: [FileService],
})
export class AppModule {}
