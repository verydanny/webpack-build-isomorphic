"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compose_middleware_1 = require("compose-middleware");
const memory_fs_1 = __importDefault(require("memory-fs"));
const merge_1 = __importDefault(require("lodash/fp/merge"));
const omitBy_1 = __importDefault(require("lodash/fp/omitBy"));
const castArray_1 = __importDefault(require("lodash/fp/castArray"));
const checkHashes_1 = require("./src/util/checkHashes");
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
    options.report = options.report === true ? {} : options.report;
    options.notify = options.notify === true ? {} : options.notify;
    options.headers = omitBy_1.default(value => value == null, options.headers);
    return options;
}
function buildIsomorphicMiddleware(...args) {
    const { compiler, options } = parseArgs(args);
    if (options.memoryFs) {
        const fs = new memory_fs_1.default();
        compiler.client.webpackCompiler.outputFileSystem = fs;
        compiler.server.webpackCompiler.outputFileSystem = fs;
    }
    if (options.report !== false) {
        options.report = startReporting(compiler, options.report).options;
    }
    if (options.notify !== false) {
        options.notify = startNotifying(compiler, options.notify).options;
    }
    options.memoryFs && checkHashes_1.checkHashes(options);
    const middleware = compose_middleware_1.compose([]);
}
exports.default = buildIsomorphicMiddleware;
