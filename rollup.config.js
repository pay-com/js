import resolve from '@rollup/plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import packageJson from './package.json'
import copy from 'rollup-plugin-copy'

const config = () => {
  let plugins = [
    builtins(),
    commonjs({ sourceMap: false }),
    resolve({ preferBuiltins: true }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
      noEmitOnError: false
    }),
    peerDepsExternal(),
    terser({ format: { comments: false } }),
    copy({
      targets: [{ src: 'src/types/**/*', dest: 'lib/dts/types' }]
    })
  ]

  return [
    {
      input: 'src/index.ts',
      output: [
        {
          file: packageJson.main,
          format: 'umd',
          name: 'Pay'
        },
        {
          file: packageJson.module,
          format: 'esm'
        }
      ],
      plugins,
      watch: {
        include: './src/**',
        clearScreen: true
      }
    },
    {
      input: 'lib/dts/index.d.ts',
      output: [{ file: 'lib/index.d.ts', format: 'es' }],
      plugins: [dts()]
    }
  ]
}

export default config
