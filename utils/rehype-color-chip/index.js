import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { color } from 'd3-color'

function transformer(tree) {
  visit(tree, 'element', function (node) {
    if (node.tagName === 'code' && node.properties) {
      const value = toString(node)
      if (color(value)) {
        node.children.push({
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['gfm-color-chip'],
            style: 'background-color: ' + color(value).formatHex() + ';',
          },
          children: [],
        })
      }
    }
    // return { ...node }
  })
}

function plugin() {
  return transformer
}

export default plugin
