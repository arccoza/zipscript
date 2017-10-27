interface MapOf<T> {
  [key: string]: T
}

interface VNode {
  children: VNode[] | string | number | boolean
}

type Component = any

type HyperScriptFn =
  <T extends Component, P extends MapOf<any>, C extends VNode>(t: T, p: P, ...c: C[]) => C

interface Options {
  h: HyperScriptFn
}

function ZipScript(opts?: Options, comps?: MapOf<Component>) {
  let {h} = opts
  let cur: VNode = null
  let ctx: VNode[] = []
  let anchors: MapOf<number> = {}
  let wrapped: MapOf<Component> = {}
}

let {z, start, end} = ZipScript()
