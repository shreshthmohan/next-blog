const postcss = require('postcss')
const fs = require('fs')
const readFileSync = fs.readFileSync
const path = require('path')

function kebabToPascalCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

function cssToNestedObject(root) {
  const result = {}

  root.walkRules(rule => {
    const selectors = rule.selector.split(',')
    const declarations = {}

    rule.walkDecls(decl => {
      const pascalCaseProp = kebabToPascalCase(decl.prop)
      declarations[pascalCaseProp] = decl.value
    })

    selectors.forEach(selector => {
      const parts = selector.trim().split(/\s+/)
      let current = result

      parts.forEach(part => {
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      })

      Object.assign(current, declarations)
    })
  })

  return result
}

export function getThemeByName(themeName) {
  try {
    const fileName = `${themeName}.css`
    const fileContent = readFileSync(
      path.resolve(__dirname, `./styles/${fileName}`),
      'utf8',
    )

    const root1 = postcss.parse(fileContent)

    return cssToNestedObject(root1)
  } catch (error) {
    console.error('Error reading the CSS file:', error)
  }
}
