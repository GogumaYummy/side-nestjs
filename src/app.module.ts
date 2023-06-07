import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config-validation';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot({ validate })],
  //TODO: 이후 배포 환경에서의 환경 변수는 따로 지정하게 할 것
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
