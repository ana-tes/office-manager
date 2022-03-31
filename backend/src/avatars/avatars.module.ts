import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [AvatarsController],
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
  ]
})
export class AvatarsModule {}