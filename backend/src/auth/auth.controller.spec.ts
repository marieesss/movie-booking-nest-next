import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { AuthGuard } from './auth.gard';
import { CanActivate } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
            essai: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) 
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      } as CanActivate)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call the service and return a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
      };

      const mockResponse = { message: 'user created', token: 'mocked-jwt-token' };

      jest.spyOn(authService, 'create').mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockResponse);
      expect(authService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call the service and return a token', async () => {
      const loginDto: LoginAuthDto = { email: 'test@example.com', password: 'password123' };

      const mockResponse = {
        message: 'Login successful',
        data: {
          token: 'mocked-jwt-token',
          name: 'John',
          surname: 'Doe',
          email: 'test@example.com',
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('essai (protected route)', () => {
    it('should return successfully logged message', async () => {
      const req = { user: 'test@example.com' };
      const mockResponse = 'Successfully logged + test@example.com';

      jest.spyOn(authService, 'essai').mockResolvedValue(mockResponse);

      const result = await controller.essai(req);

      expect(result).toEqual(mockResponse);
      expect(authService.essai).toHaveBeenCalledWith(req);
    });
  });
});
