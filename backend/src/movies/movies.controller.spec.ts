import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn(),
            getMovieById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('essai (GET /movies)', () => {
    it('should return movies list', async () => {
      const mockResponse = { results: ['movie1', 'movie2'] };
      jest.spyOn(moviesService, 'getMovies').mockResolvedValue(mockResponse);

      const result = await controller.essai('1');

      expect(result).toEqual(mockResponse);
      expect(moviesService.getMovies).toHaveBeenCalledWith('1', undefined, undefined);
    });

    it('should return searched movies', async () => {
      const mockResponse = { results: ['searchedMovie1', 'searchedMovie2'] };
      jest.spyOn(moviesService, 'getMovies').mockResolvedValue(mockResponse);

      const result = await controller.essai('1', 'batman');

      expect(result).toEqual(mockResponse);
      expect(moviesService.getMovies).toHaveBeenCalledWith('1', 'batman', undefined);
    });
  });

  describe('getMovieById (GET /movies/details)', () => {
    it('should return movie details', async () => {
      const mockResponse = { id: '123', title: 'Test Movie' };
      jest.spyOn(moviesService, 'getMovieById').mockResolvedValue(mockResponse);

      const result = await controller.getMovieById('123');

      expect(result).toEqual(mockResponse);
      expect(moviesService.getMovieById).toHaveBeenCalledWith('123');
    });
  });
});
