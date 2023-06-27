import { plainToInstance, Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV: 'development' | 'test' | 'production';

  @IsInt()
  @Min(0)
  @Max(65535)
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;

  @IsUrl({ require_tld: false })
  DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @Transform(({ value }) => parseInt(value, 10))
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;
}

export function validate(config: Record<string, unknown>) {
  const appConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appConfig);

  if (errors.length) throw new Error(errors.toString());

  return appConfig;
}
