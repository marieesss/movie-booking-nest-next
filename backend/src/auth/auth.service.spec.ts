import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: Repository<AuthEntity>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthEntity),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<AuthEntity>>(getRepositoryToken(AuthEntity));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should register a new user successfully', async () => {
      const createAuthDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
      };

      jest.spyOn(authRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(authRepository, 'create').mockReturnValue({ ...createAuthDto, password: 'hashedPassword' } as AuthEntity);
      jest.spyOn(authRepository, 'save').mockResolvedValue({ ...createAuthDto, password: 'hashedPassword' } as AuthEntity);

      const result = await service.create(createAuthDto);

      expect(result).toEqual({
        message: 'user created',
        token: 'mocked-jwt-token',
      });

      expect(authRepository.findOneBy).toHaveBeenCalledWith({ email: createAuthDto.email });
      expect(authRepository.create).toHaveBeenCalled();
      expect(authRepository.save).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: createAuthDto.email });
    });

    it('should throw an error if email is already taken', async () => {
      const createAuthDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
      };

      jest.spyOn(authRepository, 'findOneBy').mockResolvedValue({ id: 1, email: createAuthDto.email } as AuthEntity);

      await expect(service.create(createAuthDto)).rejects.toThrowError(
        new HttpException(
          expect.objectContaining({ error: 'Email already taken' }),
          HttpStatus.BAD_REQUEST
        )
      );
    });
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const loginDto: LoginAuthDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'John',
        surname: 'Doe',
      } as AuthEntity;

      jest.spyOn(authRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        data: {
          token: 'mocked-jwt-token',
          name: 'John',
          surname: 'Doe',
          email: 'test@example.com',
        },
      });

      expect(authRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.email });
    });

    it('should throw an error if user is not found', async () => {
      const loginDto: LoginAuthDto = { email: 'unknown@example.com', password: 'password123' };

      jest.spyOn(authRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrowError(
        new HttpException(
          expect.objectContaining({ error: 'Couldnt find user' }),
          HttpStatus.NOT_FOUND
        )
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const loginDto: LoginAuthDto = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'John',
        surname: 'Doe',
      } as AuthEntity;

      jest.spyOn(authRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrowError(
        new HttpException(
          expect.objectContaining({ error: 'Wrong password' }),
          HttpStatus.UNAUTHORIZED
        )
      );
    });
  });

  describe('essai', () => {
    it('should return successfully logged message', async () => {
      const req = { user: 'test@example.com' };
      const result = await service.essai(req);
      expect(result).toEqual('Successfully logged + test@example.com');
    });
  });
});
