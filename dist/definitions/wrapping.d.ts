import { GraphQLInputType, GraphQLList, GraphQLNamedType, GraphQLNonNull, GraphQLType } from 'graphql'
import { DynamicInputMethodDef, DynamicOutputMethodDef } from '../dynamicMethod'
import { DynamicOutputPropertyDef } from '../dynamicProperty'
import { NexusPlugin } from '../plugin'
import { AllInputTypes, GetGen } from '../typegenTypeHelpers'
import { PrintedGenTyping, PrintedGenTypingImport } from '../utils'
import { NexusArgDef } from './args'
import { NexusEnumTypeDef } from './enumType'
import { NexusExtendInputTypeDef } from './extendInputType'
import { NexusExtendTypeDef } from './extendType'
import { NexusInputObjectTypeDef } from './inputObjectType'
import { NexusInterfaceTypeDef } from './interfaceType'
import { NexusListDef } from './list'
import { NexusNonNullDef } from './nonNull'
import { NexusNullDef } from './nullable'
import { NexusObjectTypeDef } from './objectType'
import { NexusScalarTypeDef } from './scalarType'
import { NexusUnionTypeDef } from './unionType'
import { NexusTypes, NexusWrappedSymbol } from './_types'
export declare type AllNexusNamedInputTypeDefs<T extends string = any> =
  | NexusInputObjectTypeDef<T>
  | NexusEnumTypeDef<T>
  | NexusScalarTypeDef<T>
  | Exclude<GraphQLInputType, GraphQLList<any> | GraphQLNonNull<any>>
export declare type AllNexusInputTypeDefs<T extends string = any> =
  | AllNexusNamedInputTypeDefs<T>
  | NexusListDef<any>
  | NexusNonNullDef<any>
  | NexusNullDef<any>
  | GraphQLList<any>
  | GraphQLNonNull<any>
export declare type AllNexusNamedOutputTypeDefs =
  | NexusObjectTypeDef<any>
  | NexusInterfaceTypeDef<any>
  | NexusUnionTypeDef<any>
  | NexusEnumTypeDef<any>
  | NexusScalarTypeDef<any>
export declare type AllNexusOutputTypeDefs =
  | AllNexusNamedOutputTypeDefs
  | NexusListDef<any>
  | NexusNonNullDef<any>
  | NexusNullDef<any>
export declare type AllNexusNamedTypeDefs = AllNexusNamedInputTypeDefs | AllNexusNamedOutputTypeDefs
export declare type AllNexusTypeDefs = AllNexusOutputTypeDefs | AllNexusInputTypeDefs
export declare type NexusListableTypes =
  | AllNamedTypeDefs
  | NexusArgDef<any>
  | NexusListDef<NexusListableTypes>
  | NexusNonNullDef<NexusNonNullableTypes>
  | NexusNullDef<NexusNullableTypes>
  | GraphQLType
export declare type NexusNonNullableTypes =
  | AllNamedTypeDefs
  | NexusListDef<NexusListableTypes>
  | NexusArgDef<any>
export declare type NexusNullableTypes =
  | AllNamedTypeDefs
  | NexusListDef<NexusListableTypes>
  | NexusArgDef<any>
export declare type AllNamedTypeDefs = GetGen<'allNamedTypes', string> | AllNexusNamedTypeDefs
export declare type AllNexusNamedArgsDefs<T extends AllInputTypes = AllInputTypes> =
  | T
  | NexusArgDef<T>
  | AllNexusNamedInputTypeDefs<T>
  | GraphQLInputType
export declare type AllNexusArgsDefs =
  | AllNexusNamedArgsDefs
  | NexusListDef<any>
  | NexusNonNullDef<any>
  | NexusNullDef<any>
  | GraphQLInputType
export declare const isNexusTypeDef: (
  obj: any
) => obj is {
  [NexusWrappedSymbol]: NexusTypes
}
export declare function isNexusStruct(
  obj: any
): obj is {
  [NexusWrappedSymbol]: NexusTypes
}
export declare function isNexusNamedTypeDef(obj: any): obj is AllNexusNamedTypeDefs
export declare function isNexusListTypeDef(obj: any): obj is NexusListDef<any>
export declare function isNexusNonNullTypeDef(obj: any): obj is NexusNonNullDef<any>
export declare function isNexusNullTypeDef(obj: any): obj is NexusNullDef<any>
export declare function isNexusWrappingType(
  obj: any
): obj is NexusListDef<any> | NexusNullDef<any> | NexusNonNullDef<any>
export declare function isNexusExtendInputTypeDef(obj: any): obj is NexusExtendInputTypeDef<string>
export declare function isNexusExtendTypeDef(obj: any): obj is NexusExtendTypeDef<string>
export declare function isNexusEnumTypeDef(obj: any): obj is NexusEnumTypeDef<string>
export declare function isNexusInputObjectTypeDef(obj: any): obj is NexusInputObjectTypeDef<string>
export declare function isNexusObjectTypeDef(obj: any): obj is NexusObjectTypeDef<string>
export declare function isNexusScalarTypeDef(obj: any): obj is NexusScalarTypeDef<string>
export declare function isNexusUnionTypeDef(obj: any): obj is NexusUnionTypeDef<string>
export declare function isNexusInterfaceTypeDef(obj: any): obj is NexusInterfaceTypeDef<string>
export declare function isNexusArgDef(obj: any): obj is NexusArgDef<AllInputTypes>
export declare function isNexusDynamicOutputProperty<T extends string>(
  obj: any
): obj is DynamicOutputPropertyDef<T>
export declare function isNexusDynamicOutputMethod<T extends string>(
  obj: any
): obj is DynamicOutputMethodDef<T>
export declare function isNexusDynamicInputMethod<T extends string>(obj: any): obj is DynamicInputMethodDef<T>
export declare function isNexusPrintedGenTyping(obj: any): obj is PrintedGenTyping
export declare function isNexusPrintedGenTypingImport(obj: any): obj is PrintedGenTypingImport
export declare function isNexusPlugin(obj: any): obj is NexusPlugin
export declare type NexusWrapKind = 'NonNull' | 'Null' | 'List'
export declare type NexusFinalWrapKind = 'NonNull' | 'List'
export declare function unwrapGraphQLDef(
  typeDef: GraphQLType
): {
  namedType: GraphQLNamedType
  wrapping: NexusFinalWrapKind[]
}
/** Unwraps any wrapped Nexus or GraphQL types, turning into a list of wrapping */
export declare function unwrapNexusDef(
  typeDef: AllNexusTypeDefs | AllNexusArgsDefs | GraphQLType | string
): {
  namedType: AllNexusNamedTypeDefs | AllNexusArgsDefs | GraphQLNamedType | string
  wrapping: NexusWrapKind[]
}
/** Takes the named type, and applies any of the NexusFinalWrapKind to create a properly wrapped GraphQL type. */
export declare function rewrapAsGraphQLType(
  baseType: GraphQLNamedType,
  wrapping: NexusFinalWrapKind[]
): GraphQLType
/**
 * Apply the wrapping consistently to the arg `type`
 *
 * NonNull(list(stringArg())) -> arg({ type: nonNull(list('String')) })
 */
export declare function normalizeArgWrapping(argVal: AllNexusArgsDefs): NexusArgDef<AllInputTypes>
/**
 * Applies the ['List', 'NonNull', 'Nullable']
 *
 * @param toWrap
 * @param wrapping
 */
export declare function applyNexusWrapping(toWrap: any, wrapping: NexusWrapKind[]): any
/**
 * Takes the "nonNullDefault" value, the chained wrapping, and the field wrapping, to determine the proper
 * list of wrapping to apply to the field
 */
export declare function finalizeWrapping(
  nonNullDefault: boolean,
  typeWrapping: NexusWrapKind[] | ReadonlyArray<NexusWrapKind>,
  chainWrapping?: NexusWrapKind[]
): NexusFinalWrapKind[]
