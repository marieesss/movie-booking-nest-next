import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto{
        @IsNotEmpty({ message: 'email is required' })
        @IsString()
        email: string;
    
        @IsNotEmpty({ message: 'password is required' })
        @IsString()
        password: string;
}
