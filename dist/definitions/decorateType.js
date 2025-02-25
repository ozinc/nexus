'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.decorateType = void 0
function decorateType(type, config) {
  type.extensions = Object.assign(Object.assign({}, type.extensions), {
    nexus: {
      asNexusMethod: config.asNexusMethod,
      sourceType: config.sourceType,
    },
  })
  return type
}
exports.decorateType = decorateType
//# sourceMappingURL=decorateType.js.map
