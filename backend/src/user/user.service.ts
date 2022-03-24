import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async addUser(createUserDTO: CreateUserDTO): Promise<IUser> {
    const newUser = new this.userModel(createUserDTO);
    return newUser.save();
  }

  async getUser(userID): Promise<User> {
    const user = await this.userModel.findById(userID).populate('team').exec();
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().populate('team').exec();
    return users;
  }

  async editUser(userID, createUserDTO: CreateUserDTO): Promise<IUser> {
    const editedUser = await this.userModel.findByIdAndUpdate(
      userID,
      createUserDTO,
      { new: true },
    );
    return editedUser;
  }
  async deleteUser(userID): Promise<any> {
    const deletedPost = await this.userModel.findByIdAndRemove(userID);
    return deletedPost;
  }
}
