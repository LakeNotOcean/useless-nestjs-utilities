import { IsNotEmpty } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exceptions';
import { ExistsDbDec } from 'src/propertyValidation/Exists.decorator';
import { FruitEntity } from './fruitEntity';

export class FruitIdDto {
  @IsNotEmpty()
  @ExistsDbDec<FruitEntity>('id', {}, FruitEntity, () => {
    throw new ValidationException([]);
  })
  id: string;
}
