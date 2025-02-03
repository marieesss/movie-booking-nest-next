import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto{
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string;
  
    @IsNotEmpty({ message: 'name is required' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'surname is required' })
    @IsString()
    surname: string;

    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    password: string;
}
