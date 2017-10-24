'use strict'
var print = console.log.bind(console)
var assert = require('assert')
var undefined = void 0  // Reset undefined.


function ZipScript(opts, comps) {
  var {h} = opts
  var cur = null
  var ctx = []
  var anchors = {}
  var wrapped = {}

  function z(type, props, ...children) {
    var v = h(type, props, ...children)

    if (cur != null)
      (cur.props ? cur.props.children : cur.children).push(v)
    else 
      ctx.push(cur = v)

    print(cur)
  }

  z.wrap = wrap

  function wrap(type) {
    return function(...args) {
      return z(type, ...args)
    }
  }

  function start(anchor) {
    var idx = ctx.push(cur) - 1

    if (anchor != null)
      anchors[anchor] = idx
  }

  function end(countOrAnchor) {
    var idx = anchors[countOrAnchor]
    idx = idx === undefined ? ctx.length - 1 - countOrAnchor : (anchors[countOrAnchor] = null, idx)

    assert(ctx[idx] !== undefined, 'Error changing context, invalid index: ' + idx)
    if (ctx[idx] !== undefined) {
      cur = ctx[idx]
      ctx = ctx.slice(0, idx + 1)
    }
  }

  // Wrap any provided components, to be returned.
  for (var k in comps) {
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

// var {z, start, end} = ZipScript({h: require('hyperscript-html').HyperScript()})
// print(require('react').createElement)
var {z, start, end} = ZipScript({h: require('react').createElement})

z('div', null, [])
start()
  z('h1', null, 'Title')