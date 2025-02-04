import { Controller, Get, Query, Req } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @ApiQuery({ name: 'page', type : String, required : false })
    @ApiQuery({ name: 'search', type : String, required : false, description : "search value if needed"})
    @ApiQuery({ name: 'sort', type : String, required : false })
    @Get()
    async essai(@Query('page') page: string = '1', @Query('search') search ?: string, @Query('sort') sort ?: string) {
    return await this.moviesService.getMovies(page, search, sort);
    }
}
