import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthEntity } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';


@Module({
  imports :[ConfigModule, TypeOrmModule.forFeature([AuthEntity]), JwtModule.register({
    global: true,
    secret : jwtConstants.secret,
    signOptions :  { expiresIn: '1d' }
  })], 
  controllers: [AuthController],
  providers: [AuthService, AuthEntity],
  exports:[AuthService]
})
export class AuthModule {}
