import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {}

  findArtist(userId: number): Promise<Artist> {
    return this.artistRepo.findOneBy({ user: { id: userId } });
  }

  async updateUserToArtist(userId: number): Promise<Artist> {
    try {
      const user = await this.usersRepo.findOneBy({ id: userId });
      console.log('user here', user);

      if (!user) {
        throw new Error('User not found');
      }

      user.role = 'artist';

      // const artist = new Artist();
      // artist.user = user;

      await this.usersRepo.save(user);

      // Check if the user already has an associated artist entity
      let artist = await this.artistRepo.findOne({ where: { user } });

      // If the user doesn't have an associated artist entity, create one
      if (!artist) {
        artist = new Artist();
        artist.user = user;
        artist = await this.artistRepo.save(artist);
      }

      // Save the new Artist entity to the Artist table
      // return await this.artistRepo.save(artist);
      return artist;
    } catch (error) {
      throw new Error(`Failed to update user to artist: ${error.message}`);
    }
  }
}
