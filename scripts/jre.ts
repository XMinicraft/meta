import fs from "node:fs";
import path from "node:path";
import { argv } from "node:process";
import { parseArgs } from "node:util";
import { digest } from "./utils.ts";

async function main() {
    const args = parseArgs({ args: argv.slice(2), options: {
        pretty: { type: 'boolean', short: 'p' }
    }});
    
    const dirname = import.meta.dirname ?? (import.meta as unknown as { dir: string }).dir;
    const jrePath = path.resolve(dirname, '../jre/index.json');

    const zuluPath = path.resolve(path.dirname(jrePath), 'com_azul_zulu.json');
    const temurinPath = path.resolve(path.dirname(jrePath), 'net_adoptium_temurin.json');
    const libericaPath = path.resolve(path.dirname(jrePath), 'com_bellsoft-sw_liberica.json');
    const correttoPath = path.resolve(path.dirname(jrePath), 'com_amazon_corretto.json');
    const jbrPath = path.resolve(path.dirname(jrePath), 'com_jetbrains_jbr.json');

    fs.writeFileSync(jrePath, JSON.stringify({
        format_version: 1,
        uid: 'jre',
        vendors: [
            { uid: 'com.azul.zulu', name: 'Azul Zulu', checksum: { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(zuluPath)) } },
            { uid: 'net.adoptium.temurin', name: 'Eclipse Temurin', checksum: { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(temurinPath)) } },
            { uid: 'com.bellsoft-sw.liberica', name: 'BellSoft Liberica', checksum: { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(libericaPath)) } },
            { uid: 'com.amazon.corretto', name: 'Amazon Corretto', checksum: { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(correttoPath)) } },
            { uid: 'com.jetbrains.jre', name: 'Jetbrains Runtime', checksum: { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(jbrPath)) } }
        ]
    }, undefined, args.values.pretty ? 2 : undefined));
}

!import.meta.main || await main();