import resolve from '@rollup/plugin-node-resolve';
import babel, {getBabelOutputPlugin} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import refresh from 'rollup-plugin-react-refresh';
import html from "@rollup/plugin-html";
import strip from "@rollup/plugin-strip";
import {injectManifest} from "rollup-plugin-workbox";
import typescript from "@rollup/plugin-typescript";

const development = process.env.NODE_ENV === 'development';
const production = process.env.NODE_ENV === 'production';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const output = [{
    dir: 'dist',
    format: 'esm',
    entryFileNames: "[name].[hash].js"
}]

if (production) {
    output.push({
        format: 'es',
        dir: 'dist',
        entryFileNames: "legacy.[hash].js",
        plugins: [getBabelOutputPlugin({presets: [['@babel/preset-env', {targets: {ie: 11}}]]})] // recompile to no module format up to ie11
    })
}

const config = {
    input: './src/entrypoint.tsx',
    output,
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        resolve({extensions, browser: true}), // node module mapping and mapping specific to browser mode than main in node module package.json
        commonjs(), // convert common js to ES modules
        injectManifest({swSrc: "./src/service-worker.ts", swDest: "./dist/service-worker.js", globDirectory: "./dist"}),
        development && html({publicPath: '/'}),
        development && refresh(), // just for development also supply sourcemap for while development
        production && strip(), // strip debugger, console.log, assert from bundle
        babel({extensions}), // do not run for development
        production && terser({
            compress: {
                global_defs: {
                    module: true // enable strict mode while compressing on ES6
                },
            },
        })
    ],
};


export default config;
