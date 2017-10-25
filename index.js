'use strict'
var print = console.log.bind(console)
var assert = require('assert')
var undefined = void 0  // Reset undefined.


function ZipScript(opts, comps) {
  let {h} = opts
  let cur = null
  let ctx = []
  let anchors = {}
  let wrapped = {}

  function z(type, props, ...children) {
    cur = {type, props, children}
    // print(cur)

    if (ctx.length)
      ctx[ctx.length - 1].children.push(cur)
    else
      ctx.push(cur)
  }

  z.wrap = wrap

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
    let idx = anchors[countOrAnchor]
    idx = idx === undefined ? ctx.length - 1 - countOrAnchor : (anchors[countOrAnchor] = null, idx)

    // assert(idx >= -1 && ctx[idx] !== undefined, `Error changing context, invalid index (${idx}) from: end(${countOrAnchor})`)

    // print('============')
    // print(ctx[ctx.length - 1] ? ctx[ctx.length - 1].type : ctx[ctx.length - 1])

    // print('-----------')
    // Move up through the ctx stack to the selected idx.
    for (let i = ctx.length - 1, v; (v = ctx[i], i > idx); i--) {
      v.children = v.children.map(c => c.type ? h(c.type, c.props, ...c.children) : c)
      // print(i, v.children.map((c) => c.type ? c.type : c))
    }
    cur = ctx[idx]
    let pre = ctx[idx + 1]
    ctx = ctx.slice(0, idx + 1)
    
    let {type, props, children} = pre
    return h(type, props, ...children)
  }

  // Wrap any provided components, to be returned.
  for (let k in comps) {
    if (comps.hasOwnProperty(k)) {
      wrapped[k] = wrap(comps[k])
    }
  }

  wrapped.z = z
  wrapped.wrap = wrap
  wrapped.start = start
  wrapped.end = end

  return wrapped
}

var {z, start, end} = ZipScript({h: require('hyperscript-html').HyperScript()})
// print(require('react').createElement)
// var {z, start, end} = ZipScript({h: require('react').createElement})

z('section', null)
  // start()
  z('h1', null, 'Title')
  z('div', null)
    start()
    z('p', null, 'content')
      start()
      z('b', null, 'yeah')
      // end()
    end(2)
  z('aside')
  print(end())
