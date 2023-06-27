import { plainToInstance, Transform } from 'class-transformer';
import { IsIn, IsInt, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV: 'development' | 'test' | 'production';

  @IsInt()
  @Min(0)
  @Max(65535)
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const appConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(appConfig);

  if (errors.length) throw new Error(errors.toString());

  return appConfig;
}
