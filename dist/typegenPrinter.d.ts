import {
  GraphQLAbstractType,
  GraphQLArgument,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLUnionType,
} from 'graphql'
import { TypegenInfo } from './builder'
import { NexusGraphQLSchema } from './definitions/_types'
import { StringLike } from './plugin'
import { GroupedTypes, PrintedGenTypingImport } from './utils'
declare type TypeFieldMapping = Record<string, Record<string, [string, string]>>
declare type TypeMapping = Record<string, string>
declare type RootTypeMapping = Record<string, string | Record<string, [string, string]>>
interface TypegenInfoWithFile extends TypegenInfo {
  typegenPath: string
}
/**
 * We track and output a few main things:
 *
 * 1. "root" types, or the values that fill the first
 *     argument for a given object type
 *
 * 2. "arg" types, the values that are arguments to output fields.
 *
 * 3. "return" types, the values returned from the resolvers... usually
 *     just list/nullable variations on the "root" types for other types
 *
 * 4. The names of all types, grouped by type.
 *
 * - Non-scalar types will get a dedicated "Root" type associated with it
 */
export declare class TypegenPrinter {
  protected schema: NexusGraphQLSchema
  protected typegenInfo: TypegenInfoWithFile
  groupedTypes: GroupedTypes
  printImports: Record<string, Record<string, boolean | string>>
  hasDiscriminatedTypes: boolean
  constructor(schema: NexusGraphQLSchema, typegenInfo: TypegenInfoWithFile)
  print(): string
  printHeaders(): string
  printGenTypeMap(): string
  printDynamicImport(): string
  printDynamicInputFieldDefinitions(): string | never[]
  printDynamicOutputFieldDefinitions(): string | never[]
  prependDoc(typeDef: string, typeDescription?: string | null): string
  printDynamicOutputPropertyDefinitions(): string | never[]
  printInheritedFieldMap(): string
  printContext(): string
  buildResolveSourceTypeMap(): Record<string, string>
  printAbstractTypeMembers(): string
  buildAbstractTypeMembers(): Record<string, string>
  printTypeNames(name: keyof GroupedTypes, exportName: string, source: string): string
  printIsTypeOfObjectTypeNames(exportName: string): string
  printResolveTypeAbstractTypes(exportName: string): string
  printFeaturesConfig(exportName: string): string
  buildEnumTypeMap(): Record<string, string>
  buildInputTypeMap(): Record<string, Record<string, [string, string]>>
  buildScalarTypeMap(): Record<string, string>
  printInputTypeMap(): string
  printEnumTypeMap(): string
  printScalarTypeMap(): string
  shouldDiscriminateType(
    abstractType: GraphQLAbstractType,
    objectType: GraphQLObjectType
  ): 'required' | 'optional' | false
  maybeDiscriminate(abstractType: GraphQLAbstractType, objectType: GraphQLObjectType): string
  buildRootTypeMap(
    hasFields: Array<GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType>
  ): Record<string, string | Record<string, [string, string]>>
  resolveSourceType(typeName: string): string | undefined
  hasResolver(field: GraphQLField<any, any>, _type: GraphQLObjectType): any
  printObjectTypeMap(): string
  printInterfaceTypeMap(): string
  printUnionTypeMap(): string
  printRootTypeDef(): string
  printAllTypesMap(): string
  buildArgTypeMap(): Record<string, Record<string, Record<string, [string, string]>>>
  printArgTypeMap(): string
  buildReturnTypeMap(): Record<string, Record<string, [string, string]>>
  buildReturnTypeNamesMap(): Record<string, Record<string, [string, string]>>
  printOutputType(type: GraphQLOutputType): string
  typeToArr(type: GraphQLOutputType): any[]
  printFieldTypesMap(): string
  printFieldTypeNamesMap(): string
  normalizeArg(arg: GraphQLInputField | GraphQLArgument): [string, string]
  argSeparator(type: GraphQLInputType, hasDefaultValue: boolean): ':' | '?:'
  argTypeRepresentation(arg: GraphQLInputType): string
  argTypeArr(arg: GraphQLInputType): any[]
  printTypeInterface(interfaceName: string, typeMapping: TypeMapping): string
  printRootTypeFieldInterface(interfaceName: string, typeMapping: RootTypeMapping): string
  printTypeFieldInterface(interfaceName: string, typeMapping: TypeFieldMapping, source: string): string
  printArgTypeFieldInterface(typeMapping: Record<string, TypeFieldMapping>): string
  printObj: (space: string, source: string) => (val: Record<string, [string, string]>, key: string) => string
  printScalar(type: GraphQLScalarType): string
  printPlugins(): string
  printType(strLike: StringLike | StringLike[]): string
  addImport(i: PrintedGenTypingImport): void
}
export {}
