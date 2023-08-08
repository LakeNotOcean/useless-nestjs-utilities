import { Module } from '@nestjs/common';
import { FruitController } from './fruit.controller';
import { FruitService } from './fruit.service';

@Module({ controllers: [FruitController], providers: [FruitService] })
export class FruitModule {}
