import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { SignInDto } from 'src/users/dto/signIn.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { };

    @Post('/create-user')
    @HttpCode(HttpStatus.CREATED)
    createUser(@Body() dto: CreateUserDto) {
        console.log("This is the dto recieved in controller function of create new user:", dto);
        return this.authService.createUserService(dto);
    }

    @Post('sign-in')
    SignInDto(@Body() SignInDto: SignInDto) {
        return this.authService.signInService(SignInDto);
    }
}
