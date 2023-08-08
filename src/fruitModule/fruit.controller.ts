import { Get, Logger, Query, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from 'src/typeORMInterceptors/transaction.interceptor';
import { FruitIdDto } from './fruit.dto';
import { FruitService } from './fruit.service';

export class FruitController {
  private readonly logger = new Logger(FruitController.name);
  constructor(private readonly fruitService: FruitService) {}

  @UseInterceptors(TransactionInterceptor)
  @Get('fruit')
  async getFruit(@Query() { id }: FruitIdDto) {
    return this.fruitService.getSuccessfullyReachedService();
  }
}
