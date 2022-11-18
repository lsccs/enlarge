import { babel } from "@rollup/plugin-babel";
import postcss from 'rollup-plugin-postcss';
import commonjs from "rollup-plugin-commonjs";
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.js',
  output: [
    {
      file: './dist/index.js',
      format: 'es',
      name: 'enlarge',
    }
  ],
  plugins: [

    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      plugins: [
        '@babel/plugin-transform-runtime',
        'babel-plugin-transform-class-properties'
      ]
    }),
    commonjs(),
    resolve(),
    postcss({
      extensions: ['.css']
    }),

    terser()
  ],
};
