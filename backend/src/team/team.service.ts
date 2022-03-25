import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ITeam } from './interfaces/team.interface';
import { Team } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private readonly teamModel: Model<Team>) {}

  async addTeam(CreateTeamDto: CreateTeamDto): Promise<ITeam> {
    const newPost = new this.teamModel(CreateTeamDto);
    return newPost.save();
  }

  async getTeam(teamID): Promise<Team> {
    const post = await this.teamModel.findById(teamID).exec();
    return post;
  }

  async getTeams(documentsToSkip = 0, limitOfDocuments?: number): Promise<Team[]> {
    const teams = this.teamModel.find().skip(documentsToSkip);
    if (limitOfDocuments) {
      teams.limit(limitOfDocuments);
    }
    return await teams.exec();
  }

  async editTeam(teamID, CreateTeamDto: CreateTeamDto): Promise<ITeam> {
    const editedTeam = await this.teamModel.findByIdAndUpdate(
      teamID,
      CreateTeamDto,
      { new: true },
    );
    return editedTeam;
  }

  async deleteTeam(teamID): Promise<any> {
    const deletedTeam = await this.teamModel.findByIdAndRemove(teamID);
    return deletedTeam;
  }
}
