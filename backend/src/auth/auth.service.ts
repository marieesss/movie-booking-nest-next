import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import { getDataSourceName, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  private readonly salt = 10;
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private jwtService: JwtService
  ) {}
  async create(createAuthDto: RegisterDto) : Promise<{message : String, token : String}>  {
    try {

      // Verify email is not taken 
      const email = await this.authRepository.findOneBy({email : createAuthDto.email})

      // Email already taken
      if(email){
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Email already taken',
        }, HttpStatus.BAD_REQUEST)
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createAuthDto.password, this.salt);

      // Create user
      const user = await this.authRepository.create({...createAuthDto, password : hashedPassword});
      await this.authRepository.save(user);

      // Create token
      const payload = { sub: user.email };
      return {
        message : "user created",
        token : await this.jwtService.signAsync(payload),
      }
      
    } catch (error) {
      // Return personnalized error message
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

  async login(loginAuthDto: LoginAuthDto) : Promise<{message : String, data : {name : string, surname : string, token : string, email : string}}>{
    try {
    // Find user by email 
    const user = await this.authRepository.findOneBy({email : loginAuthDto.email})

    // User not found
    if(!user){
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Couldnt find user',
      }, HttpStatus.NOT_FOUND)
    }

    // Match password 
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);

    if(!isMatch){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Wrong password',
      }, HttpStatus.UNAUTHORIZED)
    }


    // Create token
    const payload = { sub: user.email };
    return {
      message : "Login successful",
      data : {
        token : await this.jwtService.signAsync(payload), 
        name : user.name,
        surname : user.surname,
        email : user.email
      }
    }

      
    } catch (error) {
    // Return personnalized error message
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }


  async essai(req):Promise<string>{
    return `Successfully logged + ${req.user}`
  }

}
