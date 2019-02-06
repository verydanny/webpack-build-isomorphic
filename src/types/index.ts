import { MultiCompiler, Compiler, Stats, compilation } from 'webpack'

type Filter<T, U> = T extends U ? T : never
type Diff<T,U> = T extends U ? never : T


export type TypeIsomorphicA = [ MultiCompiler, Options ]
export type TypeIsomorphicB = [ Compiler, Compiler, Options ]
export type TypeIsomorphic = TypeIsomorphicA | TypeIsomorphicB

export interface Options {
  memoryFs: boolean,
  watchDelay: number,
  watchOptions: undefined,
  report: {
    stats?: 'once',
    write?: () => void,
  },
  notify: boolean | {},
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

interface CompilerStub {
  webpackCompiler: Compiler,
}

interface IsoCompiler {
  client: CompilerStub,
  server: CompilerStub,
}

export interface ParseReturns {
  compiler: IsoCompiler,
  options: Options,
}
