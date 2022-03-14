import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
    
@Controller('user')
export class UserController {
    
  constructor(private userService: UserService) { }
    
  // Submit a post
  @Post('/post')
  async addPost(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const newUser = await this.userService.addUser(createUserDTO);
    return res.status(HttpStatus.OK).json({
      message: 'User has been submitted successfully!',
      post: newUser,
    });
  }
    
  // Fetch a particular post using ID
  @Get('post/:postID')
  async getPost(@Res() res, @Param('postID', new ValidateObjectId()) userID) {
    const post = await this.userService.getUser(userID);
    if (!post) {
        throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json(post);
  }
    
  // Fetch all posts
  @Get('posts')
  async getPosts(@Res() res) {
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  // Edit a particular post using ID
  @Put('/edit')
  async editPost(
    @Res() res,
    @Query('userID', new ValidateObjectId()) userID,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    const editedUser = await this.userService.editUser(userID, createUserDTO);
    if (!editedUser) {
        throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'User has been successfully updated',
      post: editedUser,
    });
  }
  // Delete a user using ID
  @Delete('/delete')
  async deletePost(@Res() res, @Query('userID', new ValidateObjectId()) userID) {
    const deletedUser = await this.userService.deleteUser(userID);
    if (!deletedUser) {
        throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'User has been deleted!',
      post: deletedUser,
    });
  }
}