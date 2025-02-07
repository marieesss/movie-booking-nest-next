import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';

describe('MoviesService', () => {
  let service: MoviesService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovies', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ results: ['movie1', 'movie2'] }),
      });
    });

    it('should fetch now playing movies', async () => {
      const result = await service.getMovies('1');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer mocked-api-key',
          },
        }
      );
      
      expect(result).toEqual({ results: ['movie1', 'movie2'] });
    });

    it('should fetch movies based on search query', async () => {
      const result = await service.getMovies('1', 'batman');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie?query=batman&page=1',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer mocked-api-key',
          },
        }
      );
      
      expect(result).toEqual({ results: ['movie1', 'movie2'] });
    });
  });

  describe('getMovieById', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ id: '123', title: 'Test Movie' }),
      });
    });

    it('should fetch movie by ID', async () => {
      const result = await service.getMovieById('123');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/123',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer mocked-api-key',
          },
        }
      );
      
      expect(result).toEqual({ id: '123', title: 'Test Movie' });
    });
  });

  describe('ApiRequest', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: true }),
      });
    });

    it('should perform API request correctly', async () => {
      const result = await service.ApiRequest('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/test-endpoint',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer mocked-api-key',
          },
        }
      );

      expect(result).toEqual({ success: true });
    });
  });
});
