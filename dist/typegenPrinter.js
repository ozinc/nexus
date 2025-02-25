'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypegenPrinter = void 0
const tslib_1 = require('tslib')
const graphql_1 = require('graphql')
const wrapping_1 = require('./definitions/wrapping')
const utils_1 = require('./utils')
const SpecifiedScalars = {
  ID: 'string',
  String: 'string',
  Float: 'number',
  Int: 'number',
  Boolean: 'boolean',
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
class TypegenPrinter {
  constructor(schema, typegenInfo) {
    this.schema = schema
    this.typegenInfo = typegenInfo
    this.printObj = (space, source) => (val, key) => {
      return [`${space}${key}: { // ${source}`]
        .concat(
          utils_1.mapObj(val, (v2, k2) => {
            return `${space}  ${k2}${v2[0]} ${v2[1]}`
          })
        )
        .concat(`${space}}`)
        .join('\n')
    }
    this.groupedTypes = utils_1.groupTypes(schema)
    this.printImports = {}
    this.hasDiscriminatedTypes = false
  }
  print() {
    const body = [
      this.printInputTypeMap(),
      this.printEnumTypeMap(),
      this.printScalarTypeMap(),
      this.printObjectTypeMap(),
      this.printInterfaceTypeMap(),
      this.printUnionTypeMap(),
      this.printRootTypeDef(),
      this.printAllTypesMap(),
      this.printFieldTypesMap(),
      this.printFieldTypeNamesMap(),
      this.printArgTypeMap(),
      this.printAbstractTypeMembers(),
      this.printInheritedFieldMap(),
      this.printTypeNames('object', 'NexusGenObjectNames', 'NexusGenObjects'),
      this.printTypeNames('input', 'NexusGenInputNames', 'NexusGenInputs'),
      this.printTypeNames('enum', 'NexusGenEnumNames', 'NexusGenEnums'),
      this.printTypeNames('interface', 'NexusGenInterfaceNames', 'NexusGenInterfaces'),
      this.printTypeNames('scalar', 'NexusGenScalarNames', 'NexusGenScalars'),
      this.printTypeNames('union', 'NexusGenUnionNames', 'NexusGenUnions'),
      this.printIsTypeOfObjectTypeNames('NexusGenObjectsUsingAbstractStrategyIsTypeOf'),
      this.printResolveTypeAbstractTypes('NexusGenAbstractsUsingStrategyResolveType'),
      this.printFeaturesConfig('NexusGenFeaturesConfig'),
      this.printGenTypeMap(),
      this.printPlugins(),
    ].join('\n\n')
    return [this.printHeaders(), body].join('\n\n')
  }
  printHeaders() {
    const fieldDefs = [
      this.printDynamicInputFieldDefinitions(),
      this.printDynamicOutputFieldDefinitions(),
      this.printDynamicOutputPropertyDefinitions(),
    ]
    return [
      this.typegenInfo.headers.join('\n'),
      this.typegenInfo.imports.join('\n'),
      this.printDynamicImport(),
      ...fieldDefs,
      GLOBAL_DECLARATION,
    ].join('\n')
  }
  printGenTypeMap() {
    return [`export interface NexusGenTypes {`]
      .concat([
        `  context: ${this.printContext()};`,
        `  inputTypes: NexusGenInputs;`,
        `  rootTypes: NexusGenRootTypes;`,
        `  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;`,
        `  argTypes: NexusGenArgTypes;`,
        `  fieldTypes: NexusGenFieldTypes;`,
        `  fieldTypeNames: NexusGenFieldTypeNames;`,
        `  allTypes: NexusGenAllTypes;`,
        `  typeInterfaces: NexusGenTypeInterfaces;`,
        `  objectNames: NexusGenObjectNames;`,
        `  inputNames: NexusGenInputNames;`,
        `  enumNames: NexusGenEnumNames;`,
        `  interfaceNames: NexusGenInterfaceNames;`,
        `  scalarNames: NexusGenScalarNames;`,
        `  unionNames: NexusGenUnionNames;`,
        `  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];`,
        `  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];`,
        `  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']`,
        `  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];`,
        `  abstractTypeMembers: NexusGenAbstractTypeMembers;`,
        `  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;`,
        `  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;`,
        `  features: NexusGenFeaturesConfig;`,
      ])
      .concat('}')
      .join('\n')
  }
  printDynamicImport() {
    var _a
    const {
      rootTypings,
      dynamicFields: { dynamicInputFields, dynamicOutputFields },
    } = this.schema.extensions.nexus.config
    const { contextTypeImport } = this.typegenInfo
    const imports = []
    const importMap = {}
    const outputPath = this.typegenInfo.typegenPath
    const nexusSchemaImportId =
      (_a = this.typegenInfo.nexusSchemaImportId) !== null && _a !== void 0
        ? _a
        : utils_1.getOwnPackage().name
    if (!this.printImports[nexusSchemaImportId]) {
      if (
        [dynamicInputFields, dynamicOutputFields].some((o) => Object.keys(o).length > 0) ||
        this.hasDiscriminatedTypes === true
      ) {
        this.printImports[nexusSchemaImportId] = {
          core: true,
        }
      }
    }
    if (contextTypeImport) {
      const importPath = utils_1.resolveImportPath(contextTypeImport, 'context', outputPath)
      importMap[importPath] = importMap[importPath] || new Set()
      importMap[importPath].add(
        contextTypeImport.alias
          ? `${contextTypeImport.export} as ${contextTypeImport.alias}`
          : contextTypeImport.export
      )
    }
    utils_1.eachObj(rootTypings, (rootType, typeName) => {
      if (typeof rootType !== 'string') {
        const importPath = utils_1.resolveImportPath(rootType, typeName, outputPath)
        importMap[importPath] = importMap[importPath] || new Set()
        importMap[importPath].add(
          rootType.alias ? `${rootType.export} as ${rootType.alias}` : rootType.export
        )
      }
    })
    utils_1.eachObj(importMap, (val, key) => {
      imports.push(`import { ${Array.from(val).join(', ')} } from ${JSON.stringify(key)}`)
    })
    utils_1.eachObj(this.printImports, (val, key) => {
      const { default: def } = val,
        rest = tslib_1.__rest(val, ['default'])
      const idents = []
      if (def) {
        idents.push(def)
      }
      let bindings = []
      utils_1.eachObj(rest, (alias, binding) => {
        bindings.push(alias !== true ? `${binding} as ${alias}` : `${binding}`)
      })
      if (bindings.length) {
        idents.push(`{ ${bindings.join(', ')} }`)
      }
      imports.push(`import ${idents.join(', ')} from ${JSON.stringify(key)}`)
    })
    return imports.join('\n')
  }
  printDynamicInputFieldDefinitions() {
    const { dynamicInputFields } = this.schema.extensions.nexus.config.dynamicFields
    // If there is nothing custom... exit
    if (!Object.keys(dynamicInputFields).length) {
      return []
    }
    return [`declare global {`, `  interface NexusGenCustomInputMethods<TypeName extends string> {`]
      .concat(
        utils_1.mapObj(dynamicInputFields, (val, key) => {
          if (typeof val === 'string') {
            const baseType = this.schema.getType(val)
            return this.prependDoc(
              `    ${key}<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // ${JSON.stringify(
                val
              )};`,
              baseType === null || baseType === void 0 ? void 0 : baseType.description
            )
          }
          return this.prependDoc(
            `    ${key}${val.value.typeDefinition || `(...args: any): void`}`,
            val.value.typeDescription
          )
        })
      )
      .concat([`  }`, `}`])
      .join('\n')
  }
  printDynamicOutputFieldDefinitions() {
    const { dynamicOutputFields } = this.schema.extensions.nexus.config.dynamicFields
    // If there is nothing custom... exit
    if (!Object.keys(dynamicOutputFields).length) {
      return []
    }
    return [`declare global {`, `  interface NexusGenCustomOutputMethods<TypeName extends string> {`]
      .concat(
        utils_1.mapObj(dynamicOutputFields, (val, key) => {
          if (typeof val === 'string') {
            const baseType = this.schema.getType(val)
            return this.prependDoc(
              `    ${key}<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // ${JSON.stringify(
                val
              )};`,
              baseType === null || baseType === void 0 ? void 0 : baseType.description
            )
          }
          return this.prependDoc(
            `    ${key}${val.value.typeDefinition || `(...args: any): void`}`,
            val.value.typeDescription
          )
        })
      )
      .concat([`  }`, `}`])
      .join('\n')
  }
  prependDoc(typeDef, typeDescription) {
    let outStr = ''
    if (typeDescription) {
      let parts = typeDescription.split('\n').map((f) => f.trimLeft())
      if (parts[0] === '') {
        parts = parts.slice(1)
      }
      if (parts[parts.length - 1] === '') {
        parts = parts.slice(0, -1)
      }
      outStr = ['    /**', ...parts.map((p) => `     *${p ? ` ${p}` : ''}`), '     */'].join('\n') + '\n'
    }
    return `${outStr}${typeDef}`
  }
  printDynamicOutputPropertyDefinitions() {
    const { dynamicOutputProperties } = this.schema.extensions.nexus.config.dynamicFields
    // If there is nothing custom... exit
    if (!Object.keys(dynamicOutputProperties).length) {
      return []
    }
    return [`declare global {`, `  interface NexusGenCustomOutputProperties<TypeName extends string> {`]
      .concat(
        utils_1.mapObj(dynamicOutputProperties, (val, key) => {
          return this.prependDoc(
            `    ${key}${val.value.typeDefinition || `: any`}`,
            val.value.typeDescription
          )
        })
      )
      .concat([`  }`, `}`])
      .join('\n')
  }
  printInheritedFieldMap() {
    const hasInterfaces = []
    const withInterfaces = hasInterfaces
      .concat(this.groupedTypes.object, this.groupedTypes.interface.map(utils_1.graphql15InterfaceType))
      .map((o) => {
        if (o.getInterfaces().length) {
          return [o.name, o.getInterfaces().map((i) => i.name)]
        }
        return null
      })
      .filter((f) => f)
    return ['export interface NexusGenTypeInterfaces {']
      .concat(
        withInterfaces.map(([name, interfaces]) => {
          return `  ${name}: ${interfaces.map((i) => JSON.stringify(i)).join(' | ')}`
        })
      )
      .concat('}')
      .join('\n')
  }
  printContext() {
    var _a, _b
    return (
      ((_a = this.typegenInfo.contextTypeImport) === null || _a === void 0 ? void 0 : _a.alias) ||
      ((_b = this.typegenInfo.contextTypeImport) === null || _b === void 0 ? void 0 : _b.export) ||
      'any'
    )
  }
  buildResolveSourceTypeMap() {
    const sourceMap = {}
    const abstractTypes = []
    abstractTypes
      .concat(this.groupedTypes.union)
      .concat(this.groupedTypes.interface)
      .forEach((type) => {
        if (graphql_1.isInterfaceType(type)) {
          const possibleNames = this.schema.getPossibleTypes(type).map((t) => t.name)
          if (possibleNames.length > 0) {
            sourceMap[type.name] = possibleNames.map((val) => `NexusGenRootTypes['${val}']`).join(' | ')
          }
        } else {
          sourceMap[type.name] = type
            .getTypes()
            .map((t) => `NexusGenRootTypes['${t.name}']`)
            .join(' | ')
        }
      })
    return sourceMap
  }
  printAbstractTypeMembers() {
    return this.printTypeInterface('NexusGenAbstractTypeMembers', this.buildAbstractTypeMembers())
  }
  buildAbstractTypeMembers() {
    const sourceMap = {}
    const abstractTypes = []
    abstractTypes
      .concat(this.groupedTypes.union)
      .concat(this.groupedTypes.interface)
      .forEach((type) => {
        if (graphql_1.isInterfaceType(type)) {
          const possibleNames = this.schema.getPossibleTypes(type).map((t) => t.name)
          if (possibleNames.length > 0) {
            sourceMap[type.name] = possibleNames.map((val) => JSON.stringify(val)).join(' | ')
          }
        } else {
          sourceMap[type.name] = type
            .getTypes()
            .map((t) => JSON.stringify(t.name))
            .join(' | ')
        }
      })
    return sourceMap
  }
  printTypeNames(name, exportName, source) {
    const obj = this.groupedTypes[name]
    const typeDef = obj.length === 0 ? 'never' : `keyof ${source}`
    return `export type ${exportName} = ${typeDef};`
  }
  printIsTypeOfObjectTypeNames(exportName) {
    const objectTypes = this.groupedTypes.object.filter((o) => o.isTypeOf !== undefined)
    const typeDef =
      objectTypes.length === 0
        ? 'never'
        : objectTypes
            .map((o) => JSON.stringify(o.name))
            .sort()
            .join(' | ')
    return `export type ${exportName} = ${typeDef};`
  }
  printResolveTypeAbstractTypes(exportName) {
    const abstractTypes = [...this.groupedTypes.interface, ...this.groupedTypes.union].filter(
      (o) => o.resolveType !== undefined
    )
    const typeDef =
      abstractTypes.length === 0
        ? 'never'
        : abstractTypes
            .map((o) => JSON.stringify(o.name))
            .sort()
            .join(' | ')
    return `export type ${exportName} = ${typeDef};`
  }
  printFeaturesConfig(exportName) {
    var _a, _b
    const abstractTypes =
      (_b =
        (_a = this.schema.extensions.nexus.config.features) === null || _a === void 0
          ? void 0
          : _a.abstractTypeStrategies) !== null && _b !== void 0
        ? _b
        : {}
    const unionProps = renderObject(
      utils_1.mapValues(abstractTypes, (val) => (val !== null && val !== void 0 ? val : false))
    )
    return [`export type ${exportName} = {`]
      .concat(`  abstractTypeStrategies: ${unionProps}`)
      .concat('}')
      .join('\n')
  }
  buildEnumTypeMap() {
    const enumMap = {}
    this.groupedTypes.enum.forEach((e) => {
      const sourceType = this.resolveSourceType(e.name)
      if (sourceType) {
        enumMap[e.name] = sourceType
      } else {
        const values = e.getValues().map((val) => JSON.stringify(val.value))
        enumMap[e.name] = values.join(' | ')
      }
    })
    return enumMap
  }
  buildInputTypeMap() {
    const inputObjMap = {}
    this.groupedTypes.input.forEach((input) => {
      utils_1.eachObj(input.getFields(), (field) => {
        inputObjMap[input.name] = inputObjMap[input.name] || {}
        inputObjMap[input.name][field.name] = this.normalizeArg(field)
      })
    })
    return inputObjMap
  }
  buildScalarTypeMap() {
    const scalarMap = {}
    this.groupedTypes.scalar.forEach((e) => {
      var _a
      if (graphql_1.isSpecifiedScalarType(e)) {
        scalarMap[e.name] =
          (_a = this.resolveSourceType(e.name)) !== null && _a !== void 0 ? _a : SpecifiedScalars[e.name]
        return
      }
      const sourceType = this.resolveSourceType(e.name)
      if (sourceType) {
        scalarMap[e.name] = sourceType
      } else {
        scalarMap[e.name] = 'any'
      }
    })
    return scalarMap
  }
  printInputTypeMap() {
    return this.printTypeFieldInterface('NexusGenInputs', this.buildInputTypeMap(), 'input type')
  }
  printEnumTypeMap() {
    return this.printTypeInterface('NexusGenEnums', this.buildEnumTypeMap())
  }
  printScalarTypeMap() {
    return this.printTypeInterface('NexusGenScalars', this.buildScalarTypeMap())
  }
  shouldDiscriminateType(abstractType, objectType) {
    var _a, _b
    if (
      !((_b =
        (_a = this.schema.extensions.nexus.config.features) === null || _a === void 0
          ? void 0
          : _a.abstractTypeStrategies) === null || _b === void 0
        ? void 0
        : _b.__typename)
    ) {
      return false
    }
    if (abstractType.resolveType !== undefined) {
      return 'optional'
    }
    if (objectType.isTypeOf !== undefined) {
      return 'optional'
    }
    return 'required'
  }
  maybeDiscriminate(abstractType, objectType) {
    const requiredOrOptional = this.shouldDiscriminateType(abstractType, objectType)
    if (requiredOrOptional === false) {
      return `NexusGenRootTypes['${objectType.name}']`
    }
    this.hasDiscriminatedTypes = true
    return `core.Discriminate<'${objectType.name}', '${requiredOrOptional}'>`
  }
  buildRootTypeMap(hasFields) {
    const rootTypeMap = {}
    hasFields.forEach((type) => {
      const rootTyping = this.resolveSourceType(type.name)
      if (rootTyping) {
        rootTypeMap[type.name] = rootTyping
        return
      }
      if (graphql_1.isUnionType(type)) {
        rootTypeMap[type.name] = type
          .getTypes()
          .map((t) => this.maybeDiscriminate(type, t))
          .join(' | ')
      } else if (graphql_1.isInterfaceType(type)) {
        const possibleRoots = this.schema.getPossibleTypes(type).map((t) => this.maybeDiscriminate(type, t))
        if (possibleRoots.length > 0) {
          rootTypeMap[type.name] = possibleRoots.join(' | ')
        } else {
          rootTypeMap[type.name] = 'any'
        }
      } else if (type.name === 'Query' || type.name === 'Mutation') {
        rootTypeMap[type.name] = '{}'
      } else {
        utils_1.eachObj(type.getFields(), (field) => {
          const obj = (rootTypeMap[type.name] = rootTypeMap[type.name] || {})
          if (!this.hasResolver(field, type)) {
            if (typeof obj !== 'string') {
              obj[field.name] = [this.argSeparator(field.type, false), this.printOutputType(field.type)]
            }
          }
        })
      }
    })
    return rootTypeMap
  }
  resolveSourceType(typeName) {
    const rootTyping = this.schema.extensions.nexus.config.rootTypings[typeName]
    if (rootTyping) {
      return typeof rootTyping === 'string' ? rootTyping : rootTyping.export
    }
    return this.typegenInfo.sourceTypeMap[typeName]
  }
  hasResolver(
    field,
    // Used in test mocking
    _type
  ) {
    if (field.extensions && field.extensions.nexus) {
      return field.extensions.nexus.hasDefinedResolver
    }
    return Boolean(field.resolve)
  }
  printObjectTypeMap() {
    return this.printRootTypeFieldInterface(
      'NexusGenObjects',
      this.buildRootTypeMap(this.groupedTypes.object)
    )
  }
  printInterfaceTypeMap() {
    return this.printRootTypeFieldInterface(
      'NexusGenInterfaces',
      this.buildRootTypeMap(this.groupedTypes.interface)
    )
  }
  printUnionTypeMap() {
    return this.printRootTypeFieldInterface('NexusGenUnions', this.buildRootTypeMap(this.groupedTypes.union))
  }
  printRootTypeDef() {
    const toJoin = []
    if (this.groupedTypes.interface.length) {
      toJoin.push('NexusGenInterfaces')
    }
    if (this.groupedTypes.object.length) {
      toJoin.push('NexusGenObjects')
    }
    if (this.groupedTypes.union.length) {
      toJoin.push('NexusGenUnions')
    }
    return `export type NexusGenRootTypes = ${toJoin.join(' & ')}`
  }
  printAllTypesMap() {
    const toJoin = ['NexusGenRootTypes']
    if (this.groupedTypes.scalar.length) {
      toJoin.push('NexusGenScalars')
    }
    if (this.groupedTypes.enum.length) {
      toJoin.push('NexusGenEnums')
    }
    return `export type NexusGenAllTypes = ${toJoin.join(' & ')}`
  }
  buildArgTypeMap() {
    const argTypeMap = {}
    const hasFields = []
    hasFields
      .concat(this.groupedTypes.object)
      .concat(this.groupedTypes.interface)
      .forEach((type) => {
        utils_1.eachObj(type.getFields(), (field) => {
          if (field.args.length > 0) {
            argTypeMap[type.name] = argTypeMap[type.name] || {}
            argTypeMap[type.name][field.name] = field.args.reduce((obj, arg) => {
              obj[arg.name] = this.normalizeArg(arg)
              return obj
            }, {})
          }
        })
      })
    return argTypeMap
  }
  printArgTypeMap() {
    return this.printArgTypeFieldInterface(this.buildArgTypeMap())
  }
  buildReturnTypeMap() {
    const returnTypeMap = {}
    const hasFields = []
    hasFields
      .concat(this.groupedTypes.object)
      .concat(this.groupedTypes.interface)
      .forEach((type) => {
        utils_1.eachObj(type.getFields(), (field) => {
          returnTypeMap[type.name] = returnTypeMap[type.name] || {}
          returnTypeMap[type.name][field.name] = [':', this.printOutputType(field.type)]
        })
      })
    return returnTypeMap
  }
  buildReturnTypeNamesMap() {
    const returnTypeMap = {}
    const hasFields = []
    hasFields
      .concat(this.groupedTypes.object)
      .concat(this.groupedTypes.interface)
      .forEach((type) => {
        utils_1.eachObj(type.getFields(), (field) => {
          returnTypeMap[type.name] = returnTypeMap[type.name] || {}
          returnTypeMap[type.name][field.name] = [':', `'${graphql_1.getNamedType(field.type).name}'`]
        })
      })
    return returnTypeMap
  }
  printOutputType(type) {
    const returnType = this.typeToArr(type)
    function combine(item) {
      if (item.length === 1) {
        if (Array.isArray(item[0])) {
          const toPrint = combine(item[0])
          return toPrint.indexOf('null') === -1 ? `${toPrint}[]` : `Array<${toPrint}>`
        }
        return item[0]
      }
      if (Array.isArray(item[1])) {
        const toPrint = combine(item[1])
        return toPrint.indexOf('null') === -1 ? `${toPrint}[] | null` : `Array<${toPrint}> | null`
      }
      return `${item[1]} | null`
    }
    return `${combine(returnType)}; // ${type}`
  }
  typeToArr(type) {
    const typing = []
    if (graphql_1.isNonNullType(type)) {
      type = type.ofType
    } else {
      typing.push(null)
    }
    if (graphql_1.isListType(type)) {
      typing.push(this.typeToArr(type.ofType))
    } else if (graphql_1.isScalarType(type)) {
      typing.push(this.printScalar(type))
    } else if (graphql_1.isEnumType(type)) {
      typing.push(`NexusGenEnums['${type.name}']`)
    } else if (
      graphql_1.isObjectType(type) ||
      graphql_1.isInterfaceType(type) ||
      graphql_1.isUnionType(type)
    ) {
      typing.push(`NexusGenRootTypes['${type.name}']`)
    }
    return typing
  }
  printFieldTypesMap() {
    return this.printTypeFieldInterface('NexusGenFieldTypes', this.buildReturnTypeMap(), 'field return type')
  }
  printFieldTypeNamesMap() {
    return this.printTypeFieldInterface(
      'NexusGenFieldTypeNames',
      this.buildReturnTypeNamesMap(),
      'field return type name'
    )
  }
  normalizeArg(arg) {
    return [this.argSeparator(arg.type, Boolean(arg.defaultValue)), this.argTypeRepresentation(arg.type)]
  }
  argSeparator(type, hasDefaultValue) {
    if (hasDefaultValue || graphql_1.isNonNullType(type)) {
      return ':'
    }
    return '?:'
  }
  argTypeRepresentation(arg) {
    const argType = this.argTypeArr(arg)
    function combine(item) {
      if (item.length === 1) {
        if (Array.isArray(item[0])) {
          const toPrint = combine(item[0])
          return toPrint.indexOf('null') === -1 ? `${toPrint}[]` : `Array<${toPrint}>`
        }
        return item[0]
      }
      if (Array.isArray(item[1])) {
        const toPrint = combine(item[1])
        return toPrint.indexOf('null') === -1 ? `${toPrint}[] | null` : `Array<${toPrint}> | null`
      }
      return `${item[1]} | null`
    }
    return `${combine(argType)}; // ${arg}`
  }
  argTypeArr(arg) {
    const typing = []
    if (graphql_1.isNonNullType(arg)) {
      arg = arg.ofType
    } else {
      typing.push(null)
    }
    if (graphql_1.isListType(arg)) {
      typing.push(this.argTypeArr(arg.ofType))
    } else if (graphql_1.isScalarType(arg)) {
      typing.push(this.printScalar(arg))
    } else if (graphql_1.isEnumType(arg)) {
      typing.push(`NexusGenEnums['${arg.name}']`)
    } else if (graphql_1.isInputObjectType(arg)) {
      typing.push(`NexusGenInputs['${arg.name}']`)
    }
    return typing
  }
  printTypeInterface(interfaceName, typeMapping) {
    return [`export interface ${interfaceName} {`]
      .concat(utils_1.mapObj(typeMapping, (val, key) => `  ${key}: ${val}`))
      .concat('}')
      .join('\n')
  }
  printRootTypeFieldInterface(interfaceName, typeMapping) {
    return [`export interface ${interfaceName} {`]
      .concat(
        utils_1.mapObj(typeMapping, (val, key) => {
          if (typeof val === 'string') {
            return `  ${key}: ${val};`
          }
          if (Object.keys(val).length === 0) {
            return `  ${key}: {};`
          }
          return this.printObj('  ', 'root type')(val, key)
        })
      )
      .concat('}')
      .join('\n')
  }
  printTypeFieldInterface(interfaceName, typeMapping, source) {
    return [`export interface ${interfaceName} {`]
      .concat(utils_1.mapObj(typeMapping, this.printObj('  ', source)))
      .concat('}')
      .join('\n')
  }
  printArgTypeFieldInterface(typeMapping) {
    return [`export interface NexusGenArgTypes {`]
      .concat(
        utils_1.mapObj(typeMapping, (val, key) => {
          return [`  ${key}: {`]
            .concat(utils_1.mapObj(val, this.printObj('    ', 'args')))
            .concat('  }')
            .join('\n')
        })
      )
      .concat('}')
      .join('\n')
  }
  printScalar(type) {
    var _a
    if (graphql_1.isSpecifiedScalarType(type)) {
      return (_a = this.resolveSourceType(type.name)) !== null && _a !== void 0
        ? _a
        : SpecifiedScalars[type.name]
    }
    return `NexusGenScalars['${type.name}']`
  }
  printPlugins() {
    const pluginFieldExt = [
      `  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {`,
    ]
    const pluginInputFieldExt = [
      `  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {`,
    ]
    const pluginArgExt = [`  interface NexusGenPluginArgConfig {`]
    const pluginSchemaExt = [`  interface NexusGenPluginSchemaConfig {`]
    const pluginTypeExt = [`  interface NexusGenPluginTypeConfig<TypeName extends string> {`]
    const pluginInputTypeExt = [`  interface NexusGenPluginInputTypeConfig<TypeName extends string> {`]
    const printInlineDefs = []
    const plugins = this.schema.extensions.nexus.config.plugins || []
    plugins.forEach((plugin) => {
      if (plugin.config.fieldDefTypes) {
        pluginFieldExt.push(padLeft(this.printType(plugin.config.fieldDefTypes), '    '))
      }
      if (plugin.config.inputFieldDefTypes) {
        pluginInputFieldExt.push(padLeft(this.printType(plugin.config.inputFieldDefTypes), '    '))
      }
      if (plugin.config.objectTypeDefTypes) {
        pluginTypeExt.push(padLeft(this.printType(plugin.config.objectTypeDefTypes), '    '))
      }
      if (plugin.config.inputObjectTypeDefTypes) {
        pluginInputTypeExt.push(padLeft(this.printType(plugin.config.inputObjectTypeDefTypes), '    '))
      }
      if (plugin.config.argTypeDefTypes) {
        pluginArgExt.push(padLeft(this.printType(plugin.config.argTypeDefTypes), '    '))
      }
    })
    return [
      printInlineDefs.join('\n'),
      [
        'declare global {',
        [
          pluginTypeExt.concat('  }').join('\n'),
          pluginInputTypeExt.concat('  }').join('\n'),
          pluginFieldExt.concat('  }').join('\n'),
          pluginInputFieldExt.concat('  }').join('\n'),
          pluginSchemaExt.concat('  }').join('\n'),
          pluginArgExt.concat('  }').join('\n'),
        ].join('\n'),
        '}',
      ].join('\n'),
    ].join('\n')
  }
  printType(strLike) {
    if (Array.isArray(strLike)) {
      return strLike.map((s) => this.printType(s)).join('\n')
    }
    if (wrapping_1.isNexusPrintedGenTyping(strLike)) {
      strLike.imports.forEach((i) => {
        this.addImport(i)
      })
      return strLike.toString()
    }
    if (wrapping_1.isNexusPrintedGenTypingImport(strLike)) {
      this.addImport(strLike)
      return ''
    }
    return strLike
  }
  addImport(i) {
    /* istanbul ignore if */
    if (!wrapping_1.isNexusPrintedGenTypingImport(i)) {
      console.warn(`Expected printedGenTypingImport, saw ${i}`)
      return
    }
    this.printImports[i.config.module] = this.printImports[i.config.module] || {}
    if (i.config.default) {
      this.printImports[i.config.module].default = i.config.default
    }
    if (i.config.bindings) {
      i.config.bindings.forEach((binding) => {
        if (typeof binding === 'string') {
          this.printImports[i.config.module][binding] = true
        } else {
          this.printImports[i.config.module][binding[0]] = binding[1]
        }
      })
    }
  }
}
exports.TypegenPrinter = TypegenPrinter
function padLeft(str, padding) {
  return str
    .split('\n')
    .map((s) => `${padding}${s}`)
    .join('\n')
}
const GLOBAL_DECLARATION = `
declare global {
  interface NexusGen extends NexusGenTypes {}
}`
function renderObject(object) {
  return [
    '{',
    utils_1
      .mapObj(object, (val, key) => {
        return `    ${key}: ${val}`
      })
      .join('\n'),
    '  }',
  ].join('\n')
}
//# sourceMappingURL=typegenPrinter.js.map
