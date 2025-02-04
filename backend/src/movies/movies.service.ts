import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MoviesService {    
    constructor(
        private configService: ConfigService
      ) {}

    async getMovies(page : string, search? : string, sort ? : string){
        let endpoint = `/movie/now_playing?language=en-US&page=${page}`

        if(search) {
            endpoint = `/search/movie?query=${search}&page=${page}`
        }

        const response = await this.ApiRequest(endpoint)

        return response
    }

    async ApiRequest (prefix : string){

        const baseUrl = 'https://api.themoviedb.org/3'
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${this.configService.get<string>('API_KEY')}`
            }
          };

          const finalUrl = baseUrl+prefix

         const res =  fetch(finalUrl, options)
          .then(res => res.json())
          .then(json => {
            console.log(json)
            return json
        })
          .catch(err => console.error(err));

        return res
                 
    }

}
