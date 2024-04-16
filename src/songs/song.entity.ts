import { Artist } from 'src/artists/artist.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// The entity defines a (model or collection in mongodb) that would be in our database table
@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // @Column('varchar', { array: true })
  // artists: string[];

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true }) // if an Artist entity is persisted, updated, or removed, the associated Song entities will also be affected by the same operation by setting cascading to true.
  @JoinTable({ name: 'artists_song' }) // an intermediate table that stores the associations between Artist entities and Song entities.
  artists: Artist[];
}
