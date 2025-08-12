// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 1. We no longer need to import GameGateway here
import { GameModule } from './game/game.module'; 

@Module({
  imports: [GameModule], // This correctly brings in GameGateway and GameService
  controllers: [AppController],
  // 2. Remove GameGateway from this providers array
  providers: [AppService],
})
export class AppModule {}