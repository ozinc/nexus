import { BuilderConfigInput } from './builder'
import { TypegenMetadataConfig } from './typegenMetadata'
/** Normalizes the builder config into the config we need for typegen */
export declare function resolveTypegenConfig(config: BuilderConfigInput): TypegenMetadataConfig
