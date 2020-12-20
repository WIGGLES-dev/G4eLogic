import jsonfile from "jsonfile";
import yaml from "js-yaml";
import fs from "fs";
import * as path from "path";
const jp = require("jsonpath");
function replaceExtension(i: string, newExtension: string) {
    return path.resolve(
        i.split('.').slice(0, -1).join('/') + newExtension
    )
}
async function buildMonoConfig() {

}
function allYamlToJson(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const abs = path.resolve(dir, file);
        if (/\.ya?ml$/.test(abs)) {
            const buffer = fs.readFileSync(abs, 'utf-8');
            const obj = yaml.load(buffer);
            const newPath = replaceExtension(abs, ".json");
            if (obj.$schema) {
                obj.$id = `http://valorsheet/systems/gurps/${file.split('.')[0]}.json`;
            }
            jp.apply(obj, "$..default", val => {
                if (typeof val === "string" && val.startsWith("@require")) {
                    const replacement = require(val.split(" ")[1]);
                    return replacement
                } else {
                    return val
                }
            });
            jsonfile.writeFileSync(newPath, obj, {
                flag: 'w+'
            });
        } else if (!file.includes(".")) {
            allYamlToJson(`${dir}/${file}`)
        }
    }
}
function buildConfig(dir: string) {
    allYamlToJson(dir);
}
buildConfig(`${process.cwd()}/src/gurps/config`);