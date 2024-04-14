import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable() // marks the class as a provider, making it eligible for dependency injection.
export class SongsService {
  constructor(
    // this is to inject a TypeORM repository instance into a provider.
    // It also allows you to access the repository methods provided by TypeORM, such as find(), save(), update(), and others
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}
  // private readonly songs = [];

  async create(songDto: CreateSongDTO): Promise<Song> {
    // save the song in the db
    const song = new Song();
    song.title = songDto.title;
    song.artists = songDto.artists;
    song.duration = songDto.duration;
    song.lyrics = songDto.lyrics;
    song.releasedDate = songDto.releasedDate;

    return await this.songsRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    // get all the songs from the db
    // throw new Error('Error in Db while fetching record');
    // return this.songs;
    return await this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    return await this.songsRepository.findOneBy({ id });
  }

  async deleteOne(id: number): Promise<DeleteResult> {
    return await this.songsRepository.delete(id);
  }

  async updateSong(
    id: number,
    recordToUpdate: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songsRepository.update(id, recordToUpdate);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Query builder
    // if you need to add query builder like sorting, filters, joining, etc, you can add it here
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');

    // without query builder
    // return paginate<Song>(this.songsRepository, options);
    // with query builder
    return paginate<Song>(queryBuilder, options);
  }
}
