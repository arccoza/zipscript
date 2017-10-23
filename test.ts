interface MapOf<T> {
  [key: string]: T
}

interface VNode {
  children: VNode[] | string | boolean | number
}

type HyperScriptFn =
  <T, P extends MapOf<any>, C extends VNode>(t: T, p: P, ...c: C[]) => C

interface Options {
  h: HyperScriptFn
}

function ZipScript(opts?: Options, comps?: MapOf<any>) {
  let {h} = opts
  let cur: VNode = null
  let ctx: VNode[] = []
  let anchors: MapOf<number> = {}
  let wrapped: MapOf<any> = {}
}

let {z, start, end} = ZipScript()
