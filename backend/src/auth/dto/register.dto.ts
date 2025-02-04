import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto{
    @ApiProperty({
        description: 'user email',
        required : true
        })
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'user name',
        required : true
        })
    @IsNotEmpty({ message: 'name is required' })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'user surname',
        required : true
        })
    @IsNotEmpty({ message: 'surname is required' })
    @IsString()
    surname: string;
    
    @ApiProperty({
        description: 'user password',
        required : true
        })
    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    password: string;
}
