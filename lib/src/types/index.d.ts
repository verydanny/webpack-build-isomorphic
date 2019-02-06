import { MultiCompiler, Compiler, Stats, compilation } from 'webpack';
export declare type TypeIsomorphicA = [MultiCompiler, Options];
export declare type TypeIsomorphicB = [Compiler, Compiler, Options];
export declare type TypeIsomorphic = TypeIsomorphicA | TypeIsomorphicB;
export interface Options {
    memoryFs: boolean;
    watchDelay: number;
    watchOptions: undefined;
    report: {
        stats?: 'once';
        write?: () => void;
    };
    notify: boolean | {};
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
interface CompilerStub {
    webpackCompiler: Compiler;
}
interface IsoCompiler {
    client: CompilerStub;
    server: CompilerStub;
}
export interface ParseReturns {
    compiler: IsoCompiler;
    options: Options;
}
export {};
