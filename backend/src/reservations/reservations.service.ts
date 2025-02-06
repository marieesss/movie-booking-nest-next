import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Injectable()
export class ReservationsService {
    constructor(
      @InjectRepository(ReservationEntity)
      private readonly reservationRepository: Repository<ReservationEntity>,

      @InjectRepository(AuthEntity)
      private readonly authRepository: Repository<AuthEntity>,
    ) {}
    
  async create(req, createReservationDto: CreateReservationDto) {
    try {
      
    // Parse string into dateTime

    const time =  new Date(createReservationDto.dateTime)

    // -2 heures
    const twoHoursBefore = new Date(time.getTime() - 2 * 60 * 60 * 1000); 
    // +2 heures
    const twoHoursAfter = new Date(time.getTime() + 2 * 60 * 60 * 1000);  

    const user = await this.authRepository.findOneBy({email : req.user})

    if(!user){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'user not found',
      }, HttpStatus.BAD_REQUEST)
    }


    // Get all reservations

    const userReservations = await this.reservationRepository.findBy({userid : user.id})


    // Filter to find reservations between 2 dates

    const match = userReservations.filter((res) => {
      const bookingDate = new Date(res.bookingSlot);
      return bookingDate > twoHoursBefore && bookingDate < twoHoursAfter;
    });

    
    // If found : throw an error
    if(match.length > 0){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Slot already taken',
      }, HttpStatus.BAD_REQUEST)
    }


    // If not found create a reservation

    const object = await this.reservationRepository.create({movieid : createReservationDto.movieId, bookingSlot:  createReservationDto.dateTime, userid : user.id})


    await this.reservationRepository.save(object)



    return object;

  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  }

  async findAll(req) {
    try{

    const user = await this.authRepository.findOneBy({email : req.user})

    if(!user){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'user not found',
      }, HttpStatus.BAD_REQUEST)
    }

    return await this.reservationRepository.findBy({userid : user.id});
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
