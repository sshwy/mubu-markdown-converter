const { parse } = require('node-html-parser')
const fs = require('fs')

const raw = fs.readFileSync('data.html');

const root = parse(raw);

function parseList(el) {
  const list = []
  el.childNodes.filter(e => e.classList?.contains('node')).forEach(e => {
    const obj = {};

    const contentEl = e.childNodes.filter(son => son.classList?.contains('content'))[0] || undefined
    const content = contentEl.text
    const childrenEl = e.childNodes.filter(son => son.classList?.contains('children'))[0] || undefined

    obj.title = content

    if(childrenEl) {
      // console.log(childrenEl)
      const subList = parseList(childrenEl.childNodes[0])
      obj.children = subList
    }

    list.push(obj);
  })
  return list
}

const dataList = parseList(root.querySelector('body>.node-list'));

// console.log(JSON.stringify(dataList, null, 2))

function render(list, prefix = '') {
  return list.map(item =>
    prefix + '- ' + item.title + '\n'
    + (item.children ? render(item.children, prefix + '  ') : '')
  ).join('')
}

const markdownText = render(dataList);

// console.log(markdownText)

fs.writeFileSync('output.md', markdownText, 'utf8')