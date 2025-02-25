import {
  GraphQLField,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFieldResolver,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchemaConfig,
  GraphQLType,
  printSchema,
} from 'graphql'
import { ArgsRecord } from './definitions/args'
import {
  InputDefinitionBlock,
  NexusInputFieldDef,
  NexusOutputFieldDef,
  OutputDefinitionBlock,
} from './definitions/definitionBlocks'
import { NexusExtendInputTypeConfig, NexusExtendInputTypeDef } from './definitions/extendInputType'
import { NexusExtendTypeConfig, NexusExtendTypeDef } from './definitions/extendType'
import { NexusInputObjectTypeConfig } from './definitions/inputObjectType'
import {
  FieldModificationDef,
  NexusInterfaceTypeConfig,
  NexusInterfaceTypeDef,
} from './definitions/interfaceType'
import { NexusObjectTypeConfig, NexusObjectTypeDef, ObjectDefinitionBlock } from './definitions/objectType'
import { UnionMembers } from './definitions/unionType'
import {
  AllNexusNamedInputTypeDefs,
  AllNexusNamedOutputTypeDefs,
  AllNexusNamedTypeDefs,
  NexusWrapKind,
} from './definitions/wrapping'
import {
  MissingType,
  NexusFeaturesInput,
  NexusGraphQLInputObjectTypeConfig,
  NexusGraphQLInterfaceTypeConfig,
  NexusGraphQLObjectTypeConfig,
  NexusGraphQLSchema,
  NonNullConfig,
  SourceTypings,
  TypingImport,
} from './definitions/_types'
import { DynamicInputMethodDef, DynamicOutputMethodDef } from './dynamicMethod'
import { DynamicOutputPropertyDef } from './dynamicProperty'
import { NexusSchemaExtension } from './extensions'
import { CreateFieldResolverInfo, NexusPlugin, PluginConfig } from './plugin'
import { SourceTypesConfigOptions } from './typegenAutoConfig'
import { TypegenFormatFn } from './typegenFormatPrettier'
import { GetGen } from './typegenTypeHelpers'
import { RequiredDeeply } from './typeHelpersInternal'
declare type NexusShapedOutput = {
  name: string
  definition: (t: ObjectDefinitionBlock<string>) => void
}
declare type NexusShapedInput = {
  name: string
  definition: (t: InputDefinitionBlock<string>) => void
}
declare type PossibleOutputType =
  | string
  | AllNexusNamedOutputTypeDefs
  | Exclude<GraphQLOutputType, GraphQLNonNull<any> | GraphQLList<any>>
declare type PossibleInputType = string | AllNexusNamedInputTypeDefs | GraphQLType
export interface BuilderConfigInput {
  /**
   * Generated artifact settings. Set to false to disable all. Set to true to enable all and use default
   * paths. Leave undefined for default behaviour of each artifact.
   */
  outputs?:
    | boolean
    | {
        /**
         * TypeScript declaration file generation settings. This file contains types reflected off your source
         * code. It is how Nexus imbues dynamic code with static guarantees.
         *
         * Defaults to being enabled when `process.env.NODE_ENV !== "production"`. Set to true to enable and
         * emit into default path (see below). Set to false to disable. Set to a string to specify absolute path.
         *
         * The default path is node_modules/@types/nexus-typegen/index.d.ts. This is chosen because TypeScript
         * will pick it up without any configuration needed by you. For more details about the @types system
         * refer to https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types
         */
        typegen?: boolean | string
        /**
         * GraphQL SDL file generation toggle and location.
         *
         * Set to a string to enable and output to an absolute path. Set to true to enable at default path
         * (schema.graphql in the current working directory) Set to false to disable
         *
         * Defaults to true in development and false otherwise.
         *
         * This file is not necessary but may be nice for teams wishing to review SDL in pull-requests or just
         * generally transitioning from a schema-first workflow.
         */
        schema?: boolean | string
      }
  /**
   * Whether the schema & types are generated when the server starts. Default is !process.env.NODE_ENV ||
   * process.env.NODE_ENV === "development"
   */
  shouldGenerateArtifacts?: boolean
  /** Register the Source Types */
  sourceTypes?: SourceTypesConfigOptions
  /**
   * Adjust the Prettier options used while running prettier over the generated output.
   *
   * Can be an absolute path to a Prettier config file like .prettierrc or package.json with "prettier"
   * field, or an object of Prettier options.
   *
   * If provided, you must have prettier available as an importable dep in your project.
   */
  prettierConfig?: string | object
  /**
   * Manually apply a formatter to the generated content before saving, see the `prettierConfig` option if
   * you want to use Prettier.
   */
  formatTypegen?: TypegenFormatFn
  /**
   * Configures the default "nonNullDefaults" for the entire schema the type. Read more about how nexus
   * handles nullability
   */
  nonNullDefaults?: NonNullConfig
  /** List of plugins to apply to Nexus, with before/after hooks executed first to last: before -> resolve -> after */
  plugins?: NexusPlugin[]
  /**
   * Provide if you wish to customize the behavior of the schema printing. Otherwise, uses `printSchema`
   * from graphql-js
   */
  customPrintSchemaFn?: typeof printSchema
  /** Customize and toggle on or off various features of Nexus. */
  features?: NexusFeaturesInput
  /**
   * Path to the module where your context type is exported
   *
   * @example
   *   contextType: { module: path.join(__dirname, 'context.ts'), export: 'MyContextType' }
   */
  contextType?: TypingImport
}
export interface BuilderConfig extends Omit<BuilderConfigInput, 'nonNullDefaults' | 'features' | 'plugins'> {
  nonNullDefaults: RequiredDeeply<BuilderConfigInput['nonNullDefaults']>
  features: RequiredDeeply<BuilderConfigInput['features']>
  plugins: RequiredDeeply<BuilderConfigInput['plugins']>
}
export declare type SchemaConfig = BuilderConfigInput & {
  /**
   * All of the GraphQL types. This is an any for simplicity of developer experience, if it's an object we
   * get the values, if it's an array we flatten out the valid types, ignoring invalid ones.
   */
  types: any
  /**
   * Whether we should process.exit after the artifacts are generated. Useful if you wish to explicitly
   * generate the test artifacts at a certain stage in a startup or build process.
   *
   * @default false
   */
  shouldExitAfterGenerateArtifacts?: boolean
  /**
   * Custom extensions, as [supported in
   * graphql-js](https://github.com/graphql/graphql-js/blob/master/src/type/__tests__/extensions-test.js)
   */
  extensions?: GraphQLSchemaConfig['extensions']
} & NexusGenPluginSchemaConfig
export interface TypegenInfo {
  /** Headers attached to the generate type output */
  headers: string[]
  /** All imports for the source types / context */
  imports: string[]
  /** A map of all GraphQL types and what TypeScript types they should be represented by. */
  sourceTypeMap: {
    [K in GetGen<'objectNames'>]?: string
  }
  /** Info about where to import the context from */
  contextTypeImport: TypingImport | undefined
  /**
   * The path to the nexus package for typegen.
   *
   * This setting is only necessary when nexus is being wrapped by another library/framework such that
   * `nexus` is not expected to be a direct dependency at the application level.
   */
  nexusSchemaImportId?: string
}
export declare type TypeToWalk =
  | {
      type: 'named'
      value: GraphQLNamedType
    }
  | {
      type: 'input'
      value: NexusShapedInput
    }
  | {
      type: 'object'
      value: NexusShapedOutput
    }
  | {
      type: 'interface'
      value: NexusInterfaceTypeConfig<any>
    }
export declare type DynamicInputFields = Record<string, DynamicInputMethodDef<string> | string>
export declare type DynamicOutputFields = Record<string, DynamicOutputMethodDef<string> | string>
export declare type DynamicOutputProperties = Record<string, DynamicOutputPropertyDef<string>>
export declare type TypeDef =
  | GraphQLNamedType
  | AllNexusNamedTypeDefs
  | NexusExtendInputTypeDef<string>
  | NexusExtendTypeDef<string>
export declare type DynamicBlockDef =
  | DynamicInputMethodDef<string>
  | DynamicOutputMethodDef<string>
  | DynamicOutputPropertyDef<string>
export declare type NexusAcceptedTypeDef = TypeDef | DynamicBlockDef
export declare type PluginBuilderLens = {
  hasType: SchemaBuilder['hasType']
  addType: SchemaBuilder['addType']
  setConfigOption: SchemaBuilder['setConfigOption']
  hasConfigOption: SchemaBuilder['hasConfigOption']
  getConfigOption: SchemaBuilder['getConfigOption']
}
/**
 * Builds all of the types, properly accounts for any using "mix". Since the enum types are resolved
 * synchronously, these need to guard for circular references at this step, while fields will guard for it
 * during lazy evaluation.
 */
export declare class SchemaBuilder {
  /** Used to check for circular references. */
  protected buildingTypes: Set<unknown>
  /** The "final type" map contains all types as they are built. */
  protected finalTypeMap: Record<string, GraphQLNamedType>
  /**
   * The "defined type" map keeps track of all of the types that were defined directly as `GraphQL*Type`
   * objects, so we don't accidentally overwrite any.
   */
  protected definedTypeMap: Record<string, GraphQLNamedType>
  /**
   * The "pending type" map keeps track of all types that were defined w/ GraphQL Nexus and haven't been
   * processed into concrete types yet.
   */
  protected pendingTypeMap: Record<string, AllNexusNamedTypeDefs>
  /** All "extensions" to types (adding fields on types from many locations) */
  protected typeExtendMap: Record<string, NexusExtendTypeConfig<string>[] | null>
  /** All "extensions" to input types (adding fields on types from many locations) */
  protected inputTypeExtendMap: Record<string, NexusExtendInputTypeConfig<string>[] | null>
  protected dynamicInputFields: DynamicInputFields
  protected dynamicOutputFields: DynamicOutputFields
  protected dynamicOutputProperties: DynamicOutputProperties
  protected plugins: NexusPlugin[]
  /** All types that need to be traversed for children types */
  protected typesToWalk: TypeToWalk[]
  /** Root type mapping information annotated on the type definitions */
  protected rootTypings: SourceTypings
  /** Array of missing types */
  protected missingTypes: Record<string, MissingType>
  /** Methods we are able to access to read/modify builder state from plugins */
  protected builderLens: PluginBuilderLens
  /** Created just before types are walked, this keeps track of all of the resolvers */
  protected onMissingTypeFns: Exclude<PluginConfig['onMissingType'], undefined>[]
  /** Executed just before types are walked */
  protected onBeforeBuildFns: Exclude<PluginConfig['onBeforeBuild'], undefined>[]
  /** Executed as the field resolvers are included on the field */
  protected onCreateResolverFns: Exclude<PluginConfig['onCreateFieldResolver'], undefined>[]
  /** Executed as the field "subscribe" fields are included on the schema */
  protected onCreateSubscribeFns: Exclude<PluginConfig['onCreateFieldSubscribe'], undefined>[]
  /** Executed after the schema is constructed, for any final verification */
  protected onAfterBuildFns: Exclude<PluginConfig['onAfterBuild'], undefined>[]
  /** Executed after the object is defined, allowing us to add additional fields to the object */
  protected onObjectDefinitionFns: Exclude<PluginConfig['onObjectDefinition'], undefined>[]
  /** Executed after the object is defined, allowing us to add additional fields to the object */
  protected onInputObjectDefinitionFns: Exclude<PluginConfig['onInputObjectDefinition'], undefined>[]
  /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
  protected onAddArgFns: Exclude<PluginConfig['onAddArg'], undefined>[]
  /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
  protected onAddOutputFieldFns: Exclude<PluginConfig['onAddOutputField'], undefined>[]
  /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
  protected onAddInputFieldFns: Exclude<PluginConfig['onAddInputField'], undefined>[]
  /** The `schemaExtension` is created just after the types are walked, but before the fields are materialized. */
  protected _schemaExtension?: NexusSchemaExtension
  protected config: BuilderConfig
  get schemaExtension(): NexusSchemaExtension
  constructor(config: BuilderConfigInput)
  setConfigOption: <
    K extends
      | 'features'
      | 'nonNullDefaults'
      | 'outputs'
      | 'shouldGenerateArtifacts'
      | 'sourceTypes'
      | 'prettierConfig'
      | 'formatTypegen'
      | 'plugins'
      | 'customPrintSchemaFn'
      | 'contextType'
  >(
    key: K,
    value: BuilderConfigInput[K]
  ) => void
  hasConfigOption: (key: keyof BuilderConfigInput) => boolean
  getConfigOption: <
    K extends
      | 'features'
      | 'nonNullDefaults'
      | 'outputs'
      | 'shouldGenerateArtifacts'
      | 'sourceTypes'
      | 'prettierConfig'
      | 'formatTypegen'
      | 'plugins'
      | 'customPrintSchemaFn'
      | 'contextType'
  >(
    key: K
  ) => BuilderConfigInput[K]
  hasType: (typeName: string) => boolean
  /**
   * Add type takes a Nexus type, or a GraphQL type and pulls it into an internal "type registry". It also
   * does an initial pass on any types that are referenced on the "types" field and pulls those in too, so
   * you can define types anonymously, without exporting them.
   */
  addType: (typeDef: NexusAcceptedTypeDef) => void
  addTypes(types: any): void
  rebuildNamedOutputFields(
    config: ReturnType<GraphQLObjectType['toConfig'] | GraphQLInterfaceType['toConfig']>
  ): Record<string, any>
  walkTypes(): void
  beforeWalkTypes(): void
  beforeBuildTypes(): void
  checkForInterfaceCircularDependencies(): void
  buildNexusTypes(): void
  createSchemaExtension(): void
  getFinalTypeMap(): BuildTypes<any>
  buildInputObjectType(config: NexusInputObjectTypeConfig<any>): GraphQLInputObjectType
  buildObjectType(config: NexusObjectTypeConfig<string>): GraphQLObjectType<any, any>
  buildInterfaceType(config: NexusInterfaceTypeConfig<any>): GraphQLInterfaceType
  private addOutputField
  private addInputField
  private buildEnumType
  private buildUnionType
  private buildScalarType
  protected finalize<T extends GraphQLNamedType>(type: T): T
  protected missingType(typeName: string, fromObject?: boolean): GraphQLNamedType
  protected buildUnionMembers(
    unionName: string,
    members: UnionMembers | undefined
  ): GraphQLObjectType<any, any>[]
  protected buildInterfaceList(interfaces: (string | NexusInterfaceTypeDef<any>)[]): GraphQLInterfaceType[]
  protected buildInterfaceFields(
    forTypeConfig: NexusGraphQLObjectTypeConfig | NexusGraphQLInterfaceTypeConfig,
    interfaces: (string | NexusInterfaceTypeDef<any>)[],
    modifications: Record<string, FieldModificationDef<any, any>>
  ): GraphQLFieldConfigMap<any, any>
  protected buildOutputFields(
    fields: NexusOutputFieldDef[],
    typeConfig: NexusGraphQLInterfaceTypeConfig | NexusGraphQLObjectTypeConfig,
    intoObject: GraphQLFieldConfigMap<any, any>
  ): GraphQLFieldConfigMap<any, any>
  protected buildInputObjectFields(
    fields: NexusInputFieldDef[],
    typeConfig: NexusGraphQLInputObjectTypeConfig
  ): GraphQLInputFieldConfigMap
  protected getNonNullDefault(
    nonNullDefaultConfig:
      | {
          nonNullDefaults?: NonNullConfig
        }
      | undefined,
    kind: 'input' | 'output'
  ): boolean
  protected buildOutputField(
    fieldConfig: NexusOutputFieldDef,
    typeConfig: NexusGraphQLObjectTypeConfig | NexusGraphQLInterfaceTypeConfig
  ): GraphQLFieldConfig<any, any>
  protected makeFinalResolver(
    info: CreateFieldResolverInfo,
    resolver?: GraphQLFieldResolver<any, any>
  ): GraphQLFieldResolver<
    any,
    any,
    {
      [argName: string]: any
    }
  >
  protected buildInputObjectField(
    fieldConfig: NexusInputFieldDef,
    typeConfig: NexusGraphQLInputObjectTypeConfig
  ): GraphQLInputFieldConfig
  protected buildArgs(
    args: ArgsRecord,
    typeConfig: NexusGraphQLObjectTypeConfig | NexusGraphQLInterfaceTypeConfig,
    fieldName: string
  ): GraphQLFieldConfigArgumentMap
  protected getInterface(name: string | NexusInterfaceTypeDef<any>): GraphQLInterfaceType
  protected getInputType(
    possibleInputType: PossibleInputType
  ): Exclude<GraphQLInputType, GraphQLNonNull<any> | GraphQLList<any>>
  protected getOutputType(
    possibleOutputType: PossibleOutputType
  ): Exclude<GraphQLOutputType, GraphQLNonNull<any> | GraphQLList<any>>
  protected getObjectOrInterfaceType(
    name: string | NexusObjectTypeDef<string>
  ): GraphQLObjectType | GraphQLInterfaceType
  protected getObjectType(name: string | NexusObjectTypeDef<string>): GraphQLObjectType
  protected getOrBuildType(
    type: string | AllNexusNamedTypeDefs | GraphQLNamedType,
    fromObject?: boolean
  ): GraphQLNamedType
  protected walkInputType<T extends NexusShapedInput>(obj: T): T
  addDynamicInputFields(block: InputDefinitionBlock<any>, wrapping?: NexusWrapKind[]): void
  addDynamicOutputMembers(
    block: OutputDefinitionBlock<any>,
    stage: 'walk' | 'build',
    wrapping?: NexusWrapKind[]
  ): void
  addDynamicScalar(
    methodName: string,
    typeName: string,
    block: OutputDefinitionBlock<any> | InputDefinitionBlock<any>
  ): void
  protected walkOutputType<T extends NexusShapedOutput>(obj: T): T
  protected walkInterfaceType(obj: NexusInterfaceTypeConfig<any>): NexusInterfaceTypeConfig<any>
  protected maybeTraverseModification(mod: FieldModificationDef<any, any>): void
  protected maybeTraverseOutputFieldType(type: NexusOutputFieldDef): void
  private traverseArgs
  protected maybeTraverseInputFieldType(type: NexusInputFieldDef): void
  protected walkNamedTypes(namedType: GraphQLNamedType): void
  protected addUnknownTypeInternal(t: GraphQLNamedType): void
  protected addNamedTypeOutputField(obj: GraphQLField<any, any>): void
  protected replaceNamedType(type: GraphQLType): any
}
export declare type DynamicFieldDefs = {
  dynamicInputFields: DynamicInputFields
  dynamicOutputFields: DynamicOutputFields
  dynamicOutputProperties: DynamicOutputProperties
}
export interface BuildTypes<TypeMapDefs extends Record<string, GraphQLNamedType>> {
  finalConfig: BuilderConfig
  typeMap: TypeMapDefs
  missingTypes: Record<string, MissingType>
  schemaExtension: NexusSchemaExtension
  onAfterBuildFns: SchemaBuilder['onAfterBuildFns']
}
/** Builds the schema, we may return more than just the schema from this one day. */
export declare function makeSchemaInternal(
  config: SchemaConfig
): {
  schema: NexusGraphQLSchema
  missingTypes: Record<string, MissingType>
  finalConfig: BuilderConfig
}
export declare function setConfigDefaults(config: BuilderConfigInput): BuilderConfig
/**
 * Defines the GraphQL schema, by combining the GraphQL types defined by the GraphQL Nexus layer or any
 * manually defined GraphQLType objects.
 *
 * Requires at least one type be named "Query", which will be used as the root query type.
 */
export declare function makeSchema(config: SchemaConfig): NexusGraphQLSchema
/** Like makeSchema except that typegen is always run and waited upon. */
export declare function generateSchema(config: SchemaConfig): Promise<NexusGraphQLSchema>
export declare namespace generateSchema {
  var withArtifacts: (
    config: SchemaConfig,
    typeFilePath?: string | null
  ) => Promise<{
    schema: NexusGraphQLSchema
    schemaTypes: string
    tsTypes: string
  }>
}
export {}
