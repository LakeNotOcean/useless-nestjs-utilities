import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { IExceptionsFormatter } from './baseFormatter.exception';

export interface ExceptionsModuleOptions {
  formatters: IExceptionsFormatter[];
}

export type ExceptionsModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ExceptionsModuleOptions>, 'useFactory' | 'inject'>;
