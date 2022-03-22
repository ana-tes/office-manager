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
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import * as logger from 'winston';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Submit a user
  @Post()
  async addUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
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
  async getUsers(@Res() res) {
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  // Edit a particular user using ID
  @Put(':userID')
  async editUser(
    @Res() res,
    @Param('userID', new ValidateObjectId()) userID,
    @Body() createUserDTO: CreateUserDTO,
  ) {
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
}
