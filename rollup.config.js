import copy from 'rollup-plugin-copy'
import rollupBaseConfig from '../../rollup.config.base'
import packageJson from './package.json'

export default rollupBaseConfig({
  outputs: [
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
  watch: {
    include: './src/**',
    clearScreen: false
  },
  additionalPlugins: [
    copy({
      targets: [{ src: 'src/types/**/*', dest: 'lib/dts/types' }]
    })
  ]
})
