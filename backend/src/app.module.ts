import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    envFilePath: ['.env']   
  }), 
  DatabaseModule, AuthModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
