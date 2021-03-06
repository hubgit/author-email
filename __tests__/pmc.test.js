require('babel-polyfill')
const fs = require('fs-extra')
const libxmljs = require('libxmljs')
const { parse } = require('../src/pmc')

test('parses response', () => {
  const xml = fs.readFileSync(__dirname + '/data/efetch-result-pmc.xml')
  const doc = libxmljs.parseXml(xml)
  const result = parse(doc)

  // fs.writeJsonSync(__dirname + '/data/efetch-result-pmc.json', result, { spaces: 2 })

  const expected = fs.readJsonSync(__dirname + '/data/efetch-result-pmc.json')
  expect(result).toEqual(expected)
})
