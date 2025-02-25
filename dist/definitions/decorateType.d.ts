import { GraphQLNamedType } from 'graphql'
import { SourceTypingDef } from './_types'
export interface TypeExtensionConfig {
  asNexusMethod?: string
  sourceType?: SourceTypingDef
}
export declare type NexusTypeExtensions = {
  nexus: TypeExtensionConfig
}
export declare function decorateType<T extends GraphQLNamedType>(type: T, config: TypeExtensionConfig): T
