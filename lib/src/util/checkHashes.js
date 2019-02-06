"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const common_tags_1 = require("common-tags");
// for later, we'll just send a warning
const configProps = [
    'output.filename',
    'output.chunkFilename',
    'output.hotUpdateMainFilename',
    'output.hotUpdateChunkFilename',
];
// STUB
// function verifyAssets(compilation: any, options: any) {
//   const { types, assets } = ['client', 'server']
// }
// STUB
function checkHashes(options) {
    const write = options.report ? options.report.write : (msg) => process.stderr.write(msg);
    // compiler.once('end', (compilation) => {
    //   if (!verifyAssets(compilation, options)) {
    //     compiler.once('end', (compilation) => verifyAssets(compilation, options))
    //   }
    // })
    const str = common_tags_1.oneLine `Make sure you do not [hash] or [chunkhash] the following options in your webpack config: ${configProps.join(', ')}, some loaders 
              have these options as well. This is known to cause ${chalk_1.default.bold('memory leaks')}.`;
    return write(str);
}
exports.checkHashes = checkHashes;
