import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthEntity } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.gard';


@Module({
  imports :[ ConfigModule.forRoot(), TypeOrmModule.forFeature([AuthEntity]), JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  }),], 
  controllers: [AuthController],
  providers: [AuthService, AuthEntity, AuthGuard],
  exports:[AuthService, JwtModule, ConfigModule]
})
export class AuthModule {}
