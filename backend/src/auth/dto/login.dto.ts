import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto{
        @ApiProperty({
                description: 'user email',
                required : true
              })
        @IsNotEmpty({ message: 'email is required' })
        @IsString()
        email: string;
    
        @ApiProperty({
                description: 'user password',
                required : true
              })
        @IsNotEmpty({ message: 'password is required' })
        @IsString()
        password: string;
}
