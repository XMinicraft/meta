import path from "node:path";
import fs from "node:fs";
import { parseArgs } from "node:util";
import { argv } from "node:process";

function main() {
    const args = parseArgs({ args: argv.slice(2), options: {
        pretty: { type: 'boolean', short: 'p' }
    }});

    const dirname = import.meta.dirname ?? (import.meta as unknown as { dir: string }).dir;
    const patchesPath = path.resolve(dirname, '../minicraft_patch_notes.json');

    const patches = JSON.parse(fs.readFileSync(patchesPath).toString());

    for (const patch of patches.entries) {
        if ('id' in patch) {
            patch['uid'] = patch.id;
            delete patch.id;
        }
    }

    fs.writeFileSync(patchesPath, JSON.stringify(patches, undefined, args.values.pretty ? 2 : undefined));
}

!import.meta.main || main();