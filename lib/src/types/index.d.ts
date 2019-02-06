import { MultiCompiler, Compiler, Stats, compilation } from 'webpack';
export interface Options {
    memoryFs: boolean;
    watchDelay: number;
    watchOptions: undefined;
    report: {
        stats: 'once';
    };
    notify: boolean;
    headers: {
        [x: string]: string;
    };
    findServerAssetName: (stats: Stats) => any[];
}
export interface Stats extends Stats {
    compilation: compilation.Compilation & {
        assetsByChunkName: any;
    };
}
export declare type TypeParseArgsReturn = {
    compiler: any;
    options: any;
};
export declare type TypeIsomorphicA = [MultiCompiler, Options];
export declare type TypeIsomorphicB = [Compiler, Compiler, Options];
