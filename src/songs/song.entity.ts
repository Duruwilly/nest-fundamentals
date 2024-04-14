import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// The entity defines a (model or collection in mongodb) that would be in our database table
@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('varchar', { array: true })
  artists: string[];

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;
}
