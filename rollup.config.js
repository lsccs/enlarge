import { babel } from "@rollup/plugin-babel";
import postcss from 'rollup-plugin-postcss';

export default {
  input: './src/index.js',
  allowAllFormats: true,
  output: [
    {
      file: './dist/index.js',
      format: 'umd',
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
    postcss({
      extensions: ['.css']
    }),
  ],
};
