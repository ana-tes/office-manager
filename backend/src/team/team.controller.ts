/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { ValidateObjectId } from './shared/validate-object-id.pipes';
import { PaginationParams } from '../common/paginationParams';

@Controller('team')
export class TeamController {
  constructor(private blogService: TeamService) {}
  // Submit a team
  @Post()
  async addPost(@Res() res, @Body() CreateTeamDto: CreateTeamDto) {
    const newTeam = await this.blogService.addTeam(CreateTeamDto);
    return res.status(HttpStatus.OK).json({
      message: 'Team has been submitted successfully!',
      team: newTeam,
    });
  }

  // Fetch a particular team using ID
  @Get('/:teamID')
  async getTeam(@Res() res, @Param('teamID', new ValidateObjectId()) teamID) {
    const team = await this.blogService.getTeam(teamID);
    if (!team) {
      throw new NotFoundException('Team does not exist!');
    }
    return res.status(HttpStatus.OK).json(team);
  }

  // Fetch all team
  @Get()
  async getTeams(@Query() { skip, limit }: PaginationParams, @Res() res) {
    const teams = await this.blogService.getTeams(skip, limit);
    return res.status(HttpStatus.OK).json(teams);
  }

  // Edit a particular team using ID
  @Put('/:teamID')
  async editTeam(
    @Res() res,
    @Param('teamID', new ValidateObjectId()) teamID,
    @Body() CreateTeamDto: CreateTeamDto,
  ) {
    const editedTeam = await this.blogService.editTeam(teamID, CreateTeamDto);
    if (!editedTeam) {
      throw new NotFoundException('Team does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Team has been successfully updated',
      post: editedTeam,
    });
  }
  // Delete a post using ID
  @Delete('/:teamID')
  async deletePost(
    @Res() res,
    @Param('teamID', new ValidateObjectId()) teamID,
  ) {
    const deletedTeam = await this.blogService.deleteTeam(teamID);
    if (!deletedTeam) {
      throw new NotFoundException('Team does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Team has been deleted!',
      post: deletedTeam,
    });
  }
}
