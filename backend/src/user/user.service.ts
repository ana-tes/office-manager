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

  async getUsers(documentsToSkip = 0, limitOfDocuments?: number): Promise<User[]> {
    const users = this.userModel.find().skip(documentsToSkip);
    if (limitOfDocuments) {
      users.limit(limitOfDocuments);
    }
    return await users.populate('team').exec();
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
