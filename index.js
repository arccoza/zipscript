'use strict'
var print = console.log.bind(console)
var undefined = void 0  // Reset undefined.


function assert(isValid, orElse) {
  if (!isValid)
    throw orElse instanceof Error ? orElse : new Error(orElse)
}

function ZipScript(opts, comps) {
  let {h} = opts
  let cur = null
  let ctx = []
  let anchors = {}
  let wrapped = {}

  function z(type, props, ...children) {
    cur = {type, props, children}

    if (ctx.length)
      ctx[ctx.length - 1].children.push(cur)
  }

  function text(strs, ...vals) {
    if (ctx.length) {
      let s, v, i
      for (i = 0; v = strs[i]; i++) s += v + (vals[i] || '')
      ctx[ctx.length - 1].children.push(s)
    }
  }

  function wrap(type) {
    return function(...args) {
      return z(type, ...args)
    }
  }

  function start(anchor) {
    let idx = ctx.push(cur) - 1

    if (anchor != null)
      anchors[anchor] = idx
  }

  function end(countOrAnchor=1) {
    let pre = null
    let idx = anchors[countOrAnchor]
    idx = idx === undefined ? ctx.length - countOrAnchor : (anchors[countOrAnchor] = null, idx)
    
    assert(typeof idx == 'number' && idx >= 0, 'Bad index.')
    --idx  // Step the index back one more to the ctx before the one we are ending.
    
    // Move up through the ctx stack to before the selected idx.
    for (let i = ctx.length - 1, v; (v = ctx[i], i > idx); i--) {
      v.children = v.children.map(c => c.type ? h(c.type, c.props, ...c.children) : c)
    }

    cur = ctx[idx]
    pre = ctx[idx + 1]
    ctx = ctx.slice(0, idx + 1)
    
    // Skip rendering, for perf, unless it is the last node.
    if (cur)
      return

    let {type, props, children} = pre
    return h(type, props, ...children)
  }

  // Wrap any provided components, to be returned.
  for (let k in comps) {
    if (comps.hasOwnProperty(k)) {
      wrapped[k] = wrap(comps[k])
    }
  }

  return {...wrapped, z, t: text, text, wrap, start, end}
}



// var h = require('hyperscript-html').HyperScript()
var h = require('react').createElement
var {z, text, start, end} = ZipScript({h: h})
var result = null

var time = process.hrtime()
for(var i = 0; i < 100000; i++) {
z('section', null)
  start()
  z('h1', null, 'Title')
  z('div', null)
    start('content')
    z('p', null, 'content')
      start()
      text`oh ${'wha'} `
      z('b', null, 'yeah')
      text`yep`
      // end()
    end('content')
  z('aside')
  result = end()
}

print(result)
print(process.hrtime(time))


var time = process.hrtime()
for(var i = 0; i < 100000; i++) {
result = h('section', null,
  h('h1', null, 'Title'),
  h('div', null,
    h('p', null, 'content',
      `oh ${'wha'} `,
      h('b', null, 'yeah'),
      `yep`,
    )
  ),
  h('aside')
)

}

print(result)
print(process.hrtime(time))
