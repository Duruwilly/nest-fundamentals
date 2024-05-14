import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // use this for validation

  /** uncomment the below to enable seeding */
  // const seedService = app.get(SeedService);
  // await seedService.seed();
  await app.listen(3000);
}
bootstrap();
