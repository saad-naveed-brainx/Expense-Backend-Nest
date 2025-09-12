import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.schema';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { };
    async createUser(user: CreateUserDto) {
        const session = await this.userModel.db.startSession();
        session.startTransaction();
        try {
            const response = await this.findByEmail(user.email);
            if (response) {
                throw new BadRequestException('User already exists');
            }
            const newUser = await this.userModel.create([user], { session });
            await session.commitTransaction();
            console.log('this is the new user we created in the users service class:', newUser);
            return newUser;
        } catch (err) {
            await session.abortTransaction();
            console.log('this is the error we got in the users service class:', err);
            throw err;
        }
        finally {
            session.endSession();
        }
    }
    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email }).select('+password');
        console.log('this is the user we got in from the database in the users service class:', user);
        return user;
    }
}
