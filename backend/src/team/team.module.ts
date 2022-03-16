import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema } from './schemas/team.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: TeamSchema }])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
