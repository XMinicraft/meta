import path from "node:path";
import fs from "node:fs";
import { argv } from "node:process";
import { parseArgs } from "node:util";
import { digest } from "./utils.ts";

async function main() {
    const args = parseArgs({ args: argv.slice(2), options: {
        pretty: { type: 'boolean', short: 'p' }
    }});
    
    const dirname = import.meta.dirname ?? (import.meta as unknown as { dir: string }).dir;
    const indexPath = path.resolve(dirname, '../index.json');

    const index = JSON.parse(fs.readFileSync(indexPath).toString()); 

    for (const entry of index.entries) {
        entry.checksum = { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(path.resolve(path.dirname(indexPath), entry.uid + '/index.json'))) };
    }

    fs.writeFileSync(indexPath, JSON.stringify(index, undefined, args.values.pretty ? 2 : undefined));
}

!import.meta.main || await main();