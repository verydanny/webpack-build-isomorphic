import chalk from 'chalk'
import { oneLine } from 'common-tags'
import { Options } from '../types';

// for later, we'll just send a warning

const configProps = [
  'output.filename',
  'output.chunkFilename',
  'output.hotUpdateMainFilename',
  'output.hotUpdateChunkFilename',
]

// STUB
// function verifyAssets(compilation: any, options: any) {
//   const { types, assets } = ['client', 'server']
// }

// STUB
export function checkHashes(options: Options) {
  const write = options.report ? options.report.write! : (msg: string) => process.stderr.write(msg)
  // compiler.once('end', (compilation) => {
  //   if (!verifyAssets(compilation, options)) {
  //     compiler.once('end', (compilation) => verifyAssets(compilation, options))
  //   }
  // })
  const str = oneLine`Make sure you do not [hash] or [chunkhash] the following options in your webpack config: ${configProps.join(', ')}, some loaders 
              have these options as well. This is known to cause ${chalk.bold('memory leaks')}.`

  return write(str)
}
