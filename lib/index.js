"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = __importDefault(require("lodash/fp/merge"));
const castArray_1 = __importDefault(require("lodash/fp/castArray"));
const webpackIsomorphicCompiler = require('webpack-isomorphic-compiler');
const startReporting = require('webpack-isomorphic-compiler-reporter');
const startNotifying = require('webpack-sane-compiler-notifier');
function parseArgs(args) {
    const [first, second, third] = args;
    if (first.compiler && Array.isArray(first.compilers) && first.run) {
        return {
            compiler: webpackIsomorphicCompiler(first.compilers[0], first.compilers[1]),
            options: parseOptions(second),
        };
    }
    if (first.run && second && second.run) {
        return {
            compiler: webpackIsomorphicCompiler(first, second),
            options: parseOptions(third),
        };
    }
    throw new TypeError('Invalid arguments passed to middleware');
}
function parseOptions(options) {
    options = merge_1.default({
        memoryFs: true,
        watchDelay: 0,
        watchOptions: undefined,
        report: { stats: 'once' },
        notify: false,
        headers: { 'Cache-Control': 'max-age=0, must-revalidate' },
        findServerAssetName: (stats) => {
            const entrypoint = Object.keys(stats.entrypoints)[0];
            return castArray_1.default(stats.assetsByChunkName[entrypoint])
                .find(asset => /\.js$/.test(asset));
        }
    }, options);
}
function buildIsomorphicMiddleware(...args) {
    parseArgs(args);
}
module.exports = buildIsomorphicMiddleware;
