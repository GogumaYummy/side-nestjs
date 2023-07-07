import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    autoLoadEntities: true,
    synchronize: configService.get('NODE_ENV') !== 'production',
  };
}
