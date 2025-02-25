'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.queryType = void 0
const objectType_1 = require('./objectType')
/**
 * [2018 GraphQL Spec](https://spec.graphql.org/June2018/#sec-Query)
 *
 * Define a Query type.
 *
 * The Query type is one of three [root types](https://spec.graphql.org/June2018/#sec-Root-Operation-Types) in
 * GraphQL and its fields represent API operations your clients can run that must not have side-effects.
 *
 * You can only have one of these in your schema. If you are going to modularize your schema and thus be
 * wanting to contribute fields to Query type from multiple modules then use
 * [queryField](https://nxs.li/docs/api/query-field) intead.
 *
 * This is a shorthand for:
 *
 * `objectType({ name: 'Query' })`
 *
 * @example
 *   queryType({
 *     definitin(t) {
 *       t.field('user', {
 *         type: 'User',
 *         args: {
 *           id: idArg(),
 *         },
 *         // ...
 *       })
 *       t.field('search', {
 *         type: 'SearchResult',
 *         args: {
 *           pattern: stringArg(),
 *         },
 *         // ...
 *       })
 *     },
 *   })
 *
 * @param config Specify your Query type's fields, description, and more. See each config property's jsDoc
 *     for more detail.
 */
function queryType(config) {
  return objectType_1.objectType(Object.assign(Object.assign({}, config), { name: 'Query' }))
}
exports.queryType = queryType
//# sourceMappingURL=queryType.js.map
