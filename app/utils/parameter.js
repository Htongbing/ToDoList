function formatRule(rule) {
  rule = rule || {}
  if (typeof rule === 'string') {
    rule = { type: rule }
  } else if (Array.isArray(rule)) {
    rule = { type: 'enum', values: rule }
  } else if (rule instanceof RegExp) {
    rule = { type: 'string', format: rule }
  }
  return rule
}
function defaultMessage(type, key, valueType) {
  switch (type) {
    case 'empty':
      return `${key}值不能为空`
    case 'type':
      return `${key}值必须是${valueType}类型`
    default:
      return ''
  }
}
class Parameter {
  validate(rules, params) {
    if (typeof rules !== 'object') {
      throw new TypeError('必须传入object类型的规则参数')
    }
    if (!params || typeof params !== 'object') {
      throw new TypeError('必须传入object类型的校验参数')
    }
    const errors = []
    for (const key in rules) {
      const rule = formatRule(rules[key]), value = params[key]
      if (rule.type === 'string') {
        if (value == null || value === '') {
          rule.required && errors.push(rule.emptyMessage || defaultMessage('empty', key))
        } else if (typeof value !== 'string') {
          errors.push(rule.typeMessage || defaultMessage('type', key, 'string'))
        } else if (rule.format instanceof RegExp && !rule.format.exec(value)) {
          errors.push(rule.matchMessage || `${key}值必须匹配${rule.format}`)
        }
      } else if (rule.type === 'number') {
        if (value == null && rule.required) {
          errors.push(rule.emptyMessage || defaultMessage('empty', key))
        } else if (value != null && typeof value !== 'number') {
          errors.push(rule.typeMessage || defaultMessage('type', key, 'number'))
        } else if (value != null && rule.customVerify) {
          const message = rule.customVerify(value)
          message && errors.push(message)
        }
      } else {
        throw new TypeError(`不支持${rule.type}类型的验证`)
      }
    }
    return errors.length && errors
  }
}

module.exports = Parameter