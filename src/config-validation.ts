import { IsDefined, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

class AppConfig {
  @IsNumber()
  @IsDefined()
  @Transform(({ value }) => parseInt(value, 10))
  PORT!: number;
}
