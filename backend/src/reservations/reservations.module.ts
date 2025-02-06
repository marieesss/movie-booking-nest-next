import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationEntity } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { AuthGuard } from 'src/auth/auth.gard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports :[TypeOrmModule.forFeature([ReservationEntity, AuthEntity]), AuthModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationEntity, AuthGuard],
})
export class ReservationsModule {}
