import {
  MiddlewareConsumer,
  Module,
  NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
// import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// import { Song } from './songs/song.entity';
// import { Users } from './users/user.entity';
// import { Artist } from './artists/artist.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions } from '../db/data-source';

// const devConfig = { port: 3000 };
// const proConfig = { port: 4000 };

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: DevConfigService,
    //   useClass: DevConfigService,
    // },
    // this example below is used if you want to use a provider value based on conditions
    // {
    //   provide: 'CONFIG',
    //   useFactory() {
    //     return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
    //   },
    // },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    // console.log('DBNAME', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // Configures the LoggerMiddleware to be applied to routes that match the 'songs' path which is option 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); // Configures the LoggerMiddleware to be applied to routes that match the 'songs' path but for only a post request which is option 2
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // Configures the LoggerMiddleware to be applied to only just the SongsController which is option 3
  }
}
