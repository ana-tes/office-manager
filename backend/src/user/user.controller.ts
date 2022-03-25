import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
  HttpException,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import * as logger from 'winston';
import { PaginationParams } from '../common/paginationParams';
import { TeamService } from '../team/team.service';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private readonly teamService: TeamService) {}

  // Submit a user
  @Post()
  async addUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    await this.checkTeam(createUserDTO);
    logger.info(createUserDTO.toString());
    const newUser = await this.userService.addUser(createUserDTO);
    logger.info(newUser.toJSON().toString());
    return res.status(HttpStatus.OK).json({
      message: 'User has been submitted successfully!',
      user: newUser,
    });
  }

  // Fetch a particular user using ID
  @Get(':userID')
  async getUser(@Res() res, @Param('userID', new ValidateObjectId()) userID) {
    const user = await this.userService.getUser(userID);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json(user);
  }

  // Fetch all users
  @Get()
  async getUsers(@Query() { skip, limit }: PaginationParams, @Res() res) {
    const users = await this.userService.getUsers(skip, limit);
    return res.status(HttpStatus.OK).json(users);
  }

  // Edit a particular user using ID
  @Put(':userID')
  async editUser(
    @Res() res,
    @Param('userID', new ValidateObjectId()) userID,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    await this.checkTeam(createUserDTO);
    const editedUser = await this.userService.editUser(userID, createUserDTO);
    if (!editedUser) {
      throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'User has been successfully updated',
      user: editedUser,
    });
  }

  // Delete a user using ID
  @Delete(':userID')
  async deletePost(
    @Res() res,
    @Param('userID', new ValidateObjectId()) userID,
  ) {
    const deletedUser = await this.userService.deleteUser(userID);
    if (!deletedUser) {
      throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'User has been deleted!',
      user: deletedUser,
    });
  }

  async checkTeam(createUserDTO: CreateUserDTO) {
    if (createUserDTO.team) {
      let team = await this.teamService.getTeam(createUserDTO.team);
      if (!team){
        throw new HttpException('invalid team', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
