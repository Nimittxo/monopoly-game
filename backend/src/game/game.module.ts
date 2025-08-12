// backend/src/game/game.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  // FIX: Make sure both GameGateway and GameService are in this array
  providers: [GameGateway, GameService],
})
export class GameModule {}