import { MultiCompiler, Compiler, Stats, compilation } from 'webpack'

type Filter<T, U> = T extends U ? T : never
type Diff<T,U> = T extends U ? never : T

export interface Options {
  memoryFs: boolean,
  watchDelay: number,
  watchOptions: undefined,
  report: {
    stats: 'once'
  },
  notify: boolean,
  headers: {
    [x: string]: string,
  },
  findServerAssetName: (stats: Stats) => any[]
}

export interface Stats extends Stats {
  compilation: compilation.Compilation & {
    assetsByChunkName: any
  }
}

export type TypeParseArgsReturn = {
  compiler: any,
  options: any,
}

export type TypeIsomorphicA = [ MultiCompiler, Options ]
export type TypeIsomorphicB = [ Compiler, Compiler, Options ]
