import html from "./cjs/rollup-plugins-html-for-multiple-bundle";
import {resolve} from "path";
import fs from "fs";

const distContent = fs.readdirSync(resolve("dist")).map((file) => file.indexOf('entrypoint') > -1 ? {
    fileName: file,
    type: "module"
} : file.indexOf('legacy') > -1 ? {fileName: file, defer:"", nomodule: ""} : undefined).filter((file)=> file !== undefined);

const config = {
    input: 'rollup.config.js',
    preserveEntrySignatures: false,
    output: {
        dir: "dist",
        entryFileNames: "index.html"
    },
    plugins: [
        html({
            attributes: {
                scripts: distContent
            }
        })
    ]
}

export default config;