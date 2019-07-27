import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

export default [{
  input: 'src/index.js',
  plugins: [minify()],
  output: {
    file: 'dist/index.js',
    format: 'esm',
    name: 'jsdiff',
    sourcemap: true,
  },
}, {
  input: 'src/index.js',
  plugins: [babel({exclude: 'node_modules/**'}), minify()],
  output: {
    file: 'dist/index.script.js',
    format: 'iife',
    sourcemap: true,
  },
}];
