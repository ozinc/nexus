import { NexusNonNullableTypes } from './wrapping'
export declare class NexusNonNullDef<TypeName extends NexusNonNullableTypes> {
  readonly ofNexusType: TypeName
  private _isNexusNonNullDef
  constructor(ofNexusType: TypeName)
}
/**
 * [API Docs](https://nxs.li/docs/api/nonNull) | [Nullability Guide](https://nxs.li/guides/nullability) |
 * [2018 GraphQL Spec](https://spec.graphql.org/June2018/#sec-Type-System.Non-Null)
 *
 * Modify a type to be Non-Null.
 *
 * In Nexus input and output position types are nullable by default so use this to modify them so long as
 * you've not changed the non-null defaults for one or both positions.
 *
 * If you find yourself using this a large majority of the time then consider changing your nullability defaults.
 *
 * @example
 *   objectType({
 *     name: 'User',
 *     definition(t) {
 *       t.field('id', {
 *         type: nonNull('ID'),
 *       })
 *       t.field('bio', {
 *         args: {
 *           format: nonNull(booleanArg()),
 *           maxWords: intArg(),
 *         },
 *         type: 'String',
 *       })
 *     },
 *   })
 *
 *   // GraphQL SDL
 *   // -----------
 *   //
 *   // type User {
 *   //   id: ID!
 *   //   bio(maxWords: Int, format: Boolean!): String
 *   // }
 *
 * @param type The type to wrap in Non-Null. This may be expressed in one of three ways:
 *
 * 1. As string literals matching the name of a builtin scalar. E.g.: 'ID', 'String', ...
 *
 * 2. As string literals matching the name of another type. E.g.: 'User', 'Location', ... Thanks to
 *     [Nexus' reflection
 *     system](https://nxs.li/guides/reflection) this is typesafe and autocompletable. This is the idiomatic
 *     approach in Nexus because it avoids excessive importing and circular references.
 *
 * 3. As references to other enums or object type definitions. E.g.: User, Location
 *
 * You may also use other type modifier helpers like list() which in turn accept one of the three
 */
export declare function nonNull<TypeName extends NexusNonNullableTypes>(type: TypeName): NexusNonNullDef<any>
