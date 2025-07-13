import path from 'node:path';
import fs from 'node:fs';
import { digest } from './utils.ts';
import { parseArgs } from 'node:util';
import { argv } from 'node:process';

async function main() {
    const args = parseArgs({ args: argv.slice(2), options: {
        pretty: { type: 'boolean', short: 'p' }
    }});
    
    const dirname = import.meta.dirname ?? (import.meta as unknown as { dir: string }).dir;
    const versionManifestPath = path.resolve(dirname, '../minicraft/version_manifest.json');

    const manifest = JSON.parse(fs.readFileSync(versionManifestPath).toString());

    for (const version of manifest.versions) {
        if ('id' in version) {
            version['uid'] = version.id;
            delete version.id;
        }

        if ('url' in version) {
            delete version.url;
        }

        const versionPath = path.resolve(path.dirname(versionManifestPath), version.uid + '.json');
        if (!fs.existsSync(versionPath)) {
            console.error(version.uid + ' does not exist');
            return;
        }

        if ('sha1' in version) {
            delete version.sha1;
        }

        const versionData = JSON.parse(fs.readFileSync(versionPath).toString());

        if ('id' in versionData) {
            versionData['uid'] = versionData.id;
            delete versionData.id;
        }

        fs.writeFileSync(versionPath, JSON.stringify(versionData, undefined, args.values.pretty ? 2 : undefined));

        version['sha256'] = await digest('SHA-256', fs.readFileSync(versionManifestPath));
    }

    fs.writeFileSync(versionManifestPath, JSON.stringify(manifest, undefined, args.values.pretty ? 2 : undefined));
}

!import.meta.main || await main();