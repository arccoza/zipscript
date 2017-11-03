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

  // TODO: Make this fn's interface more flexible.
  function z(type, props, ...children) {
    cur = {type, props, children, $$z: true}

    if (ctx.length)
      ctx[ctx.length - 1].children.push(cur)
  }

  function text(strs, ...vals) {
    if (ctx.length) {
      let t, s, i
      for (i = 0; s = strs[i]; i++) t += s + (vals[i] || '')
      ctx[ctx.length - 1].children.push(t)
    }
  }

  // A fn to insert extra children/items rendered elsewhere.
  function extra(...items) {
    if (ctx.length)
      ctx[ctx.length - 1].children.push(...items)
  }

  function wrap(type) {
    return z.bind(null, type)
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
      v.children = v.children.map(c => c.$$z ? h(c.type, c.props, ...c.children) : c)
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

  return {...wrapped, z, t: text, text, extra, wrap, start, end}
}

module.exports = {
  ZipScript
}


if (require && require.main === module) {
  var comps = {section: 'section', aside: 'aside', div: 'div', h1: 'h1', p: 'p', b: 'b'}
  // var h = require('hyperscript-html').HyperScript()
  var h = require('react').createElement
  var {z, text, extra, start, end, section, aside, div, h1, p, b} = ZipScript({h: h}, comps)
  var result = null


  var stuff = h('div', null,
    h('p', null,
      h('span', null, 'extra extra')
    )
  )


  print('----------------------------------------------')
  var time = process.hrtime()
  for(var i = 0; i < 100000; i++) {
  section()
    start()
    h1(null, 'Title')
    extra(stuff, stuff)
    div()
      start('content')
      p(null, 'content')
        start()
        text`oh ${'wha'} `
        b(null, 'yeah')
        text`yep`
        // end()
      end('content')
    aside()
    result = end()
  }

  print(result)
  print(process.hrtime(time))


  print('----------------------------------------------')
  var time = process.hrtime()
  for(var i = 0; i < 100000; i++) {
  z('section', null)
    start()
    z('h1', null, 'Title')
    extra(stuff, stuff)
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


  print('----------------------------------------------')
  var time = process.hrtime()
  for(var i = 0; i < 100000; i++) {
  result = h('section', null,
    h('h1', null, 'Title'),
    stuff,
    stuff,
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
}