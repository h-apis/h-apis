import pJson from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";


export default {
    input: pJson.main,
    output: {
        file: './dist/bundle.js',
        format: 'cjs',
    },
    plugins: [
        typescript(),
        commonjs(),
        terser(),
    ]
}
