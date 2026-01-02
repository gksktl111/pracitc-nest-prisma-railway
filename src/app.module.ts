import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [PrismaModule, UsersModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
