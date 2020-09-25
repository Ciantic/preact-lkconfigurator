import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import svg from "rollup-plugin-svg";
import fs from "fs";

import pkg from "./package.json";

const exts = [".js", ".jsx", ".ts", ".tsx"];

const config = {
    input: "src/LkConfigurator.tsx",
    output: {
        dir: "dist",
        name: "lkconfigurator",
        format: "iife",
    },
    plugins: [
        svg(),
        resolve({
            extensions: exts,
        }),
        commonjs(),
        babel({
            extensions: exts,
            babelHelpers: "bundled",
        }),
        postcss({
            inject: false,
            minimize: true,
            // modules: true,
            // inject: function (c, f) {
            //     console.log("wtf", c, f);
            //     return `
            //     console.log("heh2", ${c});
            //     `;
            // },
        }),
        terser(),
        {
            name: "endscripter",
            writeBundle: function (opts, bundle) {
                if (opts.name === "lkconfigurator") {
                    let code = bundle["LkConfigurator.js"].code;
                    if (typeof code === "string") {
                        // console.log("code", code);
                        fs.writeFileSync(
                            "C:\\Source\\PHP\\wp-content\\themes\\lampokansi\\block-lk-configurator.js",
                            code
                        );
                    }
                }
            },
        },
    ],
};

export default config;
