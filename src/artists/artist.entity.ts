import { Song } from 'src/songs/song.entity';
import { Users } from 'src/users/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  // one to one is a relation where A contains only one instance of B, and B contains only one instance of A
  // to make a relation between the user and the artist, i will like to store the user id inside the artist model
  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  // many to many is a relation where A contains multiple instance of B, and B contains multiple instance of A
  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
