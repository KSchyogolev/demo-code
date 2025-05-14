import {build} from 'esbuild';
import {ramdaImportPlugin} from '../../../scripts/esbuild-plugins/index.js';

const EXTERNAL = ['@tools/react', 'react', 'mobx', 'mobx-react-lite', 'mobx-utils', 'ramda'];

build({
  entryPoints: ['./src/index.ts'],
  outdir: './dist',
  minify: false,
  metafile: true,
  bundle: true,
  sourcemap: false,
  format: 'esm',
  target: 'es2018',
  loader: {
    '.js': 'jsx',
  },
  plugins: [
    ramdaImportPlugin()
  ],
  external: EXTERNAL,
}).catch(() => process.exit(1));
