import { GraphQLAbstractType, GraphQLResolveInfo } from 'graphql'
import { NexusInterfaceTypeDef } from './definitions/interfaceType'
import { NexusObjectTypeDef } from './definitions/objectType'
declare global {
  interface NexusGen {}
  interface NexusGenCustomInputMethods<TypeName extends string> {}
  interface NexusGenCustomOutputMethods<TypeName extends string> {}
  interface NexusGenCustomOutputProperties<TypeName extends string> {}
  interface NexusGenPluginSchemaConfig {}
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginArgConfig {}
}
export declare type AllInputTypes = GetGen<'allInputTypes', string>
export declare type AllOutputTypes = GetGen<'allOutputTypes', string>
/** This type captures all output types defined in the app as well as core GraphQL spec objects. */
export declare type AllOutputTypesPossible = AllOutputTypes | 'Query' | 'Mutation' | 'Subscription'
export declare type FieldType<TypeName extends string, FieldName extends string> = GetGen3<
  'fieldTypes',
  TypeName,
  FieldName
>
export declare type MaybePromise<T> = PromiseLike<T> | T
/**
 * Because the GraphQL field execution algorithm automatically resolves promises at any level of the tree, we
 * use this to help signify that.
 */
export declare type MaybePromiseDeep<T> = Date extends T
  ? MaybePromise<T>
  : null extends T
  ? MaybePromise<T>
  : boolean extends T
  ? MaybePromise<T>
  : number extends T
  ? MaybePromise<T>
  : string extends T
  ? MaybePromise<T>
  : T extends Array<infer U>
  ? MaybePromise<Array<MaybePromiseDeep<U>>>
  : T extends ReadonlyArray<infer Y>
  ? MaybePromise<ReadonlyArray<MaybePromiseDeep<Y>>>
  : T extends object
  ? MaybePromise<
      | T
      | {
          [P in keyof T]: MaybePromiseDeep<T[P]>
        }
    >
  : MaybePromise<T>
/**
 * The NexusAbstractTypeResolver type can be used if you want to preserve type-safety and autocomplete on an
 * abstract type resolver (interface or union) outside of the Nexus configuration
 *
 * @example
 *   const mediaType: AbstractTypeResolver<'MediaType'> = (root, ctx, info) => {
 *     if (ctx.user.isLoggedIn()) {
 *       return ctx.user.getItems()
 *     }
 *     return null
 *   }
 */
export interface AbstractTypeResolver<TypeName extends string> {
  (
    source: SourceValue<TypeName>,
    context: GetGen<'context'>,
    info: GraphQLResolveInfo,
    abstractType: GraphQLAbstractType
  ): MaybePromise<AbstractResolveReturn<TypeName> | null>
}
/**
 * The FieldResolver type can be used when you want to preserve type-safety and autocomplete on a resolver
 * outside of the Nexus definition block
 *
 * @example
 *   const userItems: FieldResolver<'User', 'items'> = (root, args, ctx, info) => {
 *     if (ctx.user.isLoggedIn()) {
 *       return ctx.user.getItems()
 *     }
 *     return null
 *   }
 */
export declare type FieldResolver<TypeName extends string, FieldName extends string> = (
  /**
   * The [source data](https://nxs.li/guides/source-types) for the GraphQL object that this field belongs to,
   * unless this is a root field (any field on a [root operation
   * type](https://spec.graphql.org/June2018/#sec-Root-Operation-Types): Query, Mutation, Subscription), in
   * which case there is no source data and this will be undefined.
   */
  source: SourceValue<TypeName>,
  /**
   * If you have defined arguments on this field then this parameter will contain any arguments passed by the
   * client. If you specified default values for any arguments and the client did not explicitly pass _any_
   * value (including null) for those arguments then you will see the defaults here.
   *
   * Note that thanks to [Nexus' reflection system](https://nxs.li/guides/reflection) this parameter's type
   *     will always be type safe.
   */
  args: ArgsValue<TypeName, FieldName>,
  /**
   * The context data for this request.
   *
   * The context data is typically a singleton scoped to the lifecycle of the request. This means created at
   *     the beginning of a request and then passed to all the resolvers that execute while resolving the request.
   *     It is often used to store information like the current user making the request. Nexus is not responsible
   *     for this however. That is typically something you'll do with e.g. [Mercurius](https://mercurius.dev) or
   * [Apollo Server](https://apollographql.com/docs/apollo-server/api/apollo-server).
   *
   * Note that the type here will be whatever you have specified for "contextType" in your makeSchema configuration.
   */
  context: GetGen<'context'>,
  /**
   * The GraphQL resolve info.
   *
   * This is an advanced parameter seldom used. It includes things like the AST of the [GraphQL
   * document](https://spec.graphql.org/June2018/#sec-Language.Document) sent by the client.
   */
  info: GraphQLResolveInfo
) => MaybePromise<ResultValue<TypeName, FieldName>> | MaybePromiseDeep<ResultValue<TypeName, FieldName>>
export declare type FieldTypeName<TypeName extends string, FieldName extends string> = GetGen3<
  'fieldTypeNames',
  TypeName,
  FieldName
>
export declare type SubFieldResolver<
  TypeName extends string,
  FieldName extends string,
  SubFieldName extends string
> = (
  root: SourceValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  context: GetGen<'context'>,
  info: GraphQLResolveInfo
) =>
  | MaybePromise<ResultValue<TypeName, FieldName>[SubFieldName]>
  | MaybePromiseDeep<ResultValue<TypeName, FieldName>[SubFieldName]>
export declare type AbstractResolveReturn<TypeName extends string> = GetGen2<
  'abstractTypeMembers',
  TypeName,
  any
>
/** Generated type helpers: */
export declare type GenTypesShapeKeys =
  | 'context'
  | 'inputTypes'
  | 'rootTypes'
  | 'inputTypeShapes'
  | 'argTypes'
  | 'fieldTypes'
  | 'fieldTypeNames'
  | 'allTypes'
  | 'typeInterfaces'
  | 'objectNames'
  | 'inputNames'
  | 'enumNames'
  | 'interfaceNames'
  | 'scalarNames'
  | 'unionNames'
  | 'allInputTypes'
  | 'allOutputTypes'
  | 'allNamedTypes'
  | 'abstractTypes'
  | 'abstractTypeMembers'
  | 'objectsUsingAbstractStrategyIsTypeOf'
  | 'abstractsUsingStrategyResolveType'
  | 'features'
/** Helpers for handling the generated schema */
export declare type GenTypesShape = Record<GenTypesShapeKeys, any>
export declare type GetGen<K extends GenTypesShapeKeys, Fallback = any> = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? GenTypes[K]
    : Fallback
  : Fallback
export declare type GetGen2<
  K extends GenTypesShapeKeys,
  K2 extends Extract<keyof GenTypesShape[K], string>,
  Fallback = any
> = K2 extends keyof GetGen<K, never> ? GetGen<K>[K2] : Fallback
export declare type GetGen3<
  K extends GenTypesShapeKeys,
  K2 extends Extract<keyof GenTypesShape[K], string>,
  K3 extends Extract<keyof GenTypesShape[K][K2], string>,
  Fallback = any
> = K2 extends keyof GetGen<K, never>
  ? K3 extends keyof GetGen<K>[K2]
    ? GetGen<K>[K2][K3]
    : Fallback
  : Fallback
export declare type HasGen<K extends GenTypesShapeKeys> = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? K extends keyof GenTypes
      ? true
      : false
    : false
  : false
export declare type HasGen2<
  K extends GenTypesShapeKeys,
  K2 extends Extract<keyof GenTypesShape[K], string>
> = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? K extends keyof GenTypes
      ? K2 extends keyof GenTypes[K]
        ? true
        : false
      : false
    : false
  : false
export declare type HasGen3<
  K extends GenTypesShapeKeys,
  K2 extends Extract<keyof GenTypesShape[K], string>,
  K3 extends Extract<keyof GenTypesShape[K][K2], string>
> = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? K extends keyof GenTypes
      ? K2 extends keyof GenTypes[K]
        ? K3 extends keyof GenTypes[K][K2]
          ? true
          : false
        : false
      : false
    : false
  : false
export declare type SourceValue<TypeName extends string> = GetGen2<'rootTypes', TypeName>
export declare type RootValueField<TypeName extends string, FieldName extends string> = GetGen3<
  'rootTypes',
  TypeName,
  FieldName
>
export declare type ArgsValue<TypeName extends string, FieldName extends string> = HasGen3<
  'fieldTypes',
  TypeName,
  FieldName
> extends true
  ? GetGen3<'argTypes', TypeName, FieldName, {}>
  : any
export declare type ResultValue<TypeName extends string, FieldName extends string> = GetGen3<
  'fieldTypes',
  TypeName,
  FieldName
>
export declare type NeedsResolver<TypeName extends string, FieldName extends string> = HasGen3<
  'fieldTypes',
  TypeName,
  FieldName
> extends true
  ? null extends GetGen3<'fieldTypes', TypeName, FieldName>
    ? false
    : HasGen3<'rootTypes', TypeName, FieldName> extends true
    ? null extends GetGen3<'rootTypes', TypeName, FieldName>
      ? true
      : false
    : true
  : HasGen3<'rootTypes', TypeName, FieldName> extends true
  ? null extends GetGen3<'rootTypes', TypeName, FieldName>
    ? true
    : false
  : false
export declare type IsFeatureEnabled2<PathPart1 extends string, PathPart2 extends string> = GetGen3<
  'features',
  PathPart1,
  PathPart2,
  false
> extends true
  ? true
  : false
export declare type Discriminate<
  TypeName extends string,
  Required extends 'required' | 'optional',
  Type = SourceValue<TypeName>
> = Type extends {
  __typename: TypeName
}
  ? Type
  : Type extends {
      __typename?: TypeName
    }
  ? Type
  : Required extends 'required'
  ? Type & {
      __typename: TypeName
    }
  : Type & {
      __typename?: TypeName
    }
export declare type InterfaceFieldsFor<TypeName extends string> = {
  [K in GetGen2<'typeInterfaces', TypeName, never>]: keyof GetGen2<'fieldTypeNames', K>
}[GetGen2<'typeInterfaces', TypeName, never>]
export declare type ModificationType<TypeName, FieldName> = TypeName extends string
  ? FieldName extends string
    ? GetGen2<
        'abstractTypeMembers',
        GetGen3<'fieldTypeNames', GetGen2<'typeInterfaces', TypeName, never>, FieldName>,
        never
      > extends infer U
      ? U extends string
        ? U | ConcreteModificationType<U>
        : never
      : never
    : any
  : any
export declare type ConcreteModificationType<U extends string> = GetGen2<
  'objectNames',
  U,
  never
> extends string
  ? NexusObjectTypeDef<U>
  : NexusInterfaceTypeDef<U>
