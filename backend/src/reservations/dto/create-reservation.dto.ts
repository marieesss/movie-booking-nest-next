import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReservationDto {
            @ApiProperty({
                    description: 'Movie id',
                    required : true
                  })
            @IsNotEmpty({ message: 'the movie is required' })
            @IsNumber()
            movieId: number;
        
            @ApiProperty({
                    description: 'Time slot',
                    required : true,
                    format : 'date-time'
                  })
            @IsNotEmpty({ message: 'password is required' })
            @IsString()
            dateTime: string;
}
