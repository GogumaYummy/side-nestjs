import { plainToInstance, Transform } from 'class-transformer';
import { IsDefined, IsNumber, validateSync } from 'class-validator';

class AppConfig {
  @IsNumber()
  @IsDefined()
  @Transform(({ value }) => parseInt(value, 10))
  PORT!: number;
}

export function validate(config: Record<string, unknown>) {
  const appConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appConfig);

  if (errors.length) throw new Error(errors.toString());

  return appConfig;
}
