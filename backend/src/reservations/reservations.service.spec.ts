import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Reservation controller', () => {
    it('should call the service and return a new reservation', async () => {
      const req = { user: 'test@example.com' };
      const createDto: CreateReservationDto = { movieId: 1, dateTime: new Date().toISOString() };
      const result = { 
        id: 1, 
        movieid: 1, 
        bookingSlot: new Date(createDto.dateTime),
        userid: 1 
      };
      

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(req, createDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(req, createDto);
    });

    it('should return a list of reservations', async () => {
      const req = { user: 'test@example.com' };
      const reservations = [{ id: 1, bookingSlot: new Date(), userid: 1, movieid: 1 }];

      jest.spyOn(service, 'findAll').mockResolvedValue(reservations);

      expect(await controller.findAll(req)).toEqual(reservations);
      expect(service.findAll).toHaveBeenCalledWith(req);
    });


    it('should delete a reservation', async () => {
      const result = { message: 'Deleted' };
  
      jest.spyOn(service, 'remove').mockResolvedValue(result);
  
      expect(await controller.remove('1')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
  
});
