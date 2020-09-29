import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  exports: [],
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'MY_MICRO_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3300,
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
