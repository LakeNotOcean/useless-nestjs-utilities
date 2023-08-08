import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FruitService {
  private readonly logger = new Logger(FruitService.name);
  constructor() {}
  getSuccessfullyReachedService() {
    this.logger.log({ message: 'service was successfully reached' });
    return true;
  }
}
