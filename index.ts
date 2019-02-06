import { MultiCompiler, Compiler } from 'webpack'
import { compose } from 'compose-middleware'
import merge from 'lodash/fp/merge'
import omitBy from 'lodash/fp/omitBy'
import castArray from 'lodash/fp/castArray'

import { Options, Stats, TypeIsomorphicA, TypeIsomorphicB, TypeParseArgsReturn } from './src/types'

const webpackIsomorphicCompiler = require('webpack-isomorphic-compiler')
const startReporting = require('webpack-isomorphic-compiler-reporter')
const startNotifying = require('webpack-sane-compiler-notifier')

function parseArgs(args: [ MultiCompiler, Options ]): TypeParseArgsReturn
function parseArgs(args: [ Compiler, Compiler, Options ]): TypeParseArgsReturn
function parseArgs<T extends any[]>(args: T) {
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
}

function buildIsomorphicMiddleware(...args: TypeIsomorphicA) {
  parseArgs(args)
}

module.exports = buildIsomorphicMiddleware
