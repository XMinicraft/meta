import { argv } from 'node:process';
import { digest } from './utils.ts';
import fs from 'node:fs';

async function main() {
    const args = argv.slice(2);

    if (args.length === 0) {
        console.error("Missing input");
        return;
    }

    const file = args[0];
    if (!fs.existsSync(file)) {
        console.error("Filed '" + file + "' does not exist");
        return;
    }

    const data = fs.readFileSync(file);
    const size = fs.statSync(file).size;

    console.log(`\x1b[34m${file}\x1b[0m    ${('SIZE(\x1b[33m' + size + '\x1b[0m)')}    SHA1(\x1b[33m${await digest('SHA-1', data)}\x1b[0m)    SHA256(\x1b[33m${await digest('SHA-256', data)}\x1b[0m)`);
}

!import.meta.main || await main();