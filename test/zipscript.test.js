const test = require('tape')
const {ZipScript} = require('../packages/zipscript')
const {HyperScript} = require('../packages/hyperscript-html')
const {createElement} = require('react')


var hypers = [HyperScript(), createElement]

var fix = {
  props: {
    title: 'A title attribute',
    style: {
      position: 'absolute',
      backgroundColor: '#ff0000',
    }
  }
}

for (let h of hypers) {
  let {z} = ZipScript({h})
  test('Single element, with props and content.', function (t) {
    let a = h('div', fix.props, 'Some text.')
    z('div', fix.props, 'Some text.')
    let b = end()
    t.end()
  })
}
