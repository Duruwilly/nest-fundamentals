import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  // HttpException,
  HttpStatus,
  // Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
// import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/auth/artists-jwt-guard';

@Controller('songs')
export class SongsController {
  constructor(
    // this is just how to inject an object as a provider and use it as a dependency
    private songService: SongsService,
    // @Inject('CONNECTION')
    // private connection: Connection,
  ) {}

  @Post()
  @UseGuards(ArtistJwtGuard)
  // The @Body() decorator indicates that the data for creating a new song will be provided in the request body while The createSongDTO parameter is of type CreateSongDTO, which is a DTO (Data Transfer Object) used for validating and transferring data when creating a new song
  create(
    @Body() createSongDTO: CreateSongDTO,
    @Req()
    request,
  ): Promise<Song> {
    console.log('request user:', request.user);

    return this.songService.create(createSongDTO);
  }

  @Get()
  // findAll(): Promise<Song[]> {
  //   try {
  //     return this.songService.findAll();
  //   } catch (error) {
  //     throw new HttpException(
  //       'server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       {
  //         cause: error,
  //       },
  //     );
  //   }
  // }
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songService.paginate({ page, limit });
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    // the id here would be a type of string but can be converted to an integer using ParseIntPipe
    // and to customize the error message resulting in the use of string when expecting a number id, use this: new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE or whatever sha})
  ): Promise<Song> {
    // return `fetch song based on id ${typeof id}`;
    return this.songService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songService.updateSong(id, updateSongDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songService.deleteOne(id);
  }
}
