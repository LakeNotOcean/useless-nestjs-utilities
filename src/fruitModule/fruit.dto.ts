import { IsNotEmpty } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exceptions';
import { IsExistsDb } from 'src/propertyValidation/Exists.decorator';
import { FruitEntity } from './fruitEntity';

export class FruitIdDto {
  @IsNotEmpty()
  @IsExistsDb<FruitEntity>(FruitEntity, 'id', () => {
    throw new ValidationException([]);
  })
  id: string;
}
