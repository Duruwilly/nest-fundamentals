import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, IsNumber, validateSync } from 'class-validator';

enum Environment {
  Development = 'developmet',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  USERNAME: string;

  @IsString()
  PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  console.log('config', config);
  const validatedConfig = plainToInstance(EvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  console.log(validatedConfig);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
