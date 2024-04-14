import { Song } from 'src/songs/song.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // // Each playlist will have multiple songs
  // @OneToMany(() => Song, (song) => song.PlayList)
  // song: Song[];

  // // Many playlist can belong to a single user
  // @ManyToOne(() => User, (user) => user.PlayList)
  // user: User;
}
