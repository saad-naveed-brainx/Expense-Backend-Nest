import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from 'src/users/dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersServvice: UsersService, private jwtService: JwtService) { }
    async createUserService(dto: CreateUserDto) {
        console.log("This is the dto recieved in service function of auth service:", dto);
        const user = await this.usersServvice.createUser(dto);
    }

    async signInService(dto: SignInDto): Promise<{ access_Token: string }> {
        console.log("This is the dto recieved in service function of sign in:", dto);
        const user = await this.usersServvice.findByEmail(dto.email);
        if (user?.password !== dto.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user._id, email: user.email };
        return {
            access_Token: await this.jwtService.signAsync(payload)
        }
    }
}
