import { compose } from 'compose-middleware'
import memoryFs from 'memory-fs'
import merge from 'lodash/fp/merge'
import omitBy from 'lodash/fp/omitBy'
import castArray from 'lodash/fp/castArray'

import { checkHashes } from './src/util/checkHashes'
import { Options, Stats, TypeIsomorphic, ParseReturns } from './src/types'

const webpackIsomorphicCompiler = require('webpack-isomorphic-compiler')
const startReporting = require('webpack-isomorphic-compiler-reporter')
const startNotifying = require('webpack-sane-compiler-notifier')

function parseArgs<T1, T2, T3>(args: [T1, T2, T3]): ParseReturns
function parseArgs<T1, T2>(args: [T1, T2]): ParseReturns
function parseArgs(args: any[]) {
  const [first, second, third] = args

  if (first.compiler && Array.isArray(first.compilers) && first.run) {
    return {
      compiler: webpackIsomorphicCompiler(first.compilers[0], first.compilers[1]),
      options: parseOptions(second),
    }
  }
  
  if (first.run && second && second.run) {
    return {
        compiler: webpackIsomorphicCompiler(first, second),
        options: parseOptions(third),
    }
  }

  throw new TypeError('Invalid arguments passed to middleware')
}

function parseOptions(options: Options) {
  options = merge({
    memoryFs: true,
    watchDelay: 0,
    watchOptions: undefined,
    report: { stats: 'once' },
    notify: false,
    headers: { 'Cache-Control': 'max-age=0, must-revalidate' },
    findServerAssetName: (stats: Stats['compilation']) => {
      const entrypoint = Object.keys(stats.entrypoints)[0]

      return castArray(stats.assetsByChunkName[entrypoint])
        .find(asset =>/\.js$/.test(asset))
    }
  }, options)

  options.report = options.report === true ? {} : options.report
  options.notify = options.notify === true ? {} : options.notify
  options.headers = omitBy(value => value == null, options.headers)

  return options
}

export default function buildIsomorphicMiddleware<T1, T2, T3>(...args: [T1, T2, T3]): any
export default function buildIsomorphicMiddleware<T1, T2>(...args: [T1, T2]): any
export default function buildIsomorphicMiddleware<T1, T2>(...args: [T1, T2]) {
  const { compiler, options } = parseArgs(args)

  if (options.memoryFs) {
    const fs = new memoryFs()

    compiler.client.webpackCompiler.outputFileSystem = fs
    compiler.server.webpackCompiler.outputFileSystem = fs
  }

  if (options.report !== false) {
    options.report = startReporting(compiler, options.report).options
  }

  if (options.notify !== false) {
    options.notify = startNotifying(compiler, options.notify).options
  }

  options.memoryFs && checkHashes(options)

  const middleware = compose([
    
  ])
}
