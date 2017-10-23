interface HyperNode {
  children: HyperNode[]
}

type HyperScriptFn =
  <T, P extends MapOf<any>, C extends (string | HyperNode)>(t: T, p: P, ...c: C[]) => C

interface MapOf<T> {
  [key: string]: T
}

interface Options {
  h: HyperScriptFn
}

function ZipScript(opts?: Options, comps?: MapOf<any>) {
  let {h} = opts
  let cur: HyperNode = null
  let ctx: HyperNode[] = []
  let anchors: MapOf<number> = {}
  let wrapped: MapOf<any> = {}
}

let {z, start, end} = ZipScript()
