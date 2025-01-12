import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { ExceptionsFormatterInterface } from '../base/base-exception-formatter';

export interface ExceptionsModuleOptions {
	formatters: ExceptionsFormatterInterface[];
}

export type ExceptionsModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<ExceptionsModuleOptions>, 'useFactory' | 'inject'>;
