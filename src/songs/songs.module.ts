import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';

// const mockSongService = {
//   findAll() {
//     return [{ id: 1, title: 'loving bird' }];
//   },
// };

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongsController],
  providers: [
    SongsService, // this allows us to inject the service into the controller because the controller is defining the module and the service is a provider in the module which allows the service to be injected

    // this example below would force nest to use the mockSongService value for testing rather than using the real provider provided in the provide value
    // {
    //   provide: SongsService,
    //   useValue: mockSongService,
    // },

    // this is just how to inject an object as a provider and use it as a dependency
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class SongsModule {}
