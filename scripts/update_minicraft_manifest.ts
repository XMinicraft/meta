import path from 'node:path';
import fs from 'node:fs';
import { digest, orderKeys } from './utils.ts';
import { parseArgs } from 'node:util';
import { argv } from 'node:process';

async function main() {
    const args = parseArgs({ args: argv.slice(2), options: {
        pretty: { type: 'boolean', short: 'p' }
    }});
    
    const dirname = import.meta.dirname ?? (import.meta as unknown as { dir: string }).dir;
    const versionManifestPath = path.resolve(dirname, '../minicraft/index.json');

    const manifest = JSON.parse(fs.readFileSync(versionManifestPath).toString());

    for (const version of manifest.versions) {
        if ('id' in version) {
            version['version'] = version.id;
            delete version.id;
        }

        if ('uid' in version) {
            version['version'] = version.uid;
            delete version.uid;
        }

        if ('url' in version) {
            delete version.url;
        }

        const versionPath = path.resolve(path.dirname(versionManifestPath), version.version + '.json');
        if (!fs.existsSync(versionPath)) {
            console.error(version.version + ' does not exist');
            return;
        }

        if ('sha1' in version) {
            delete version.sha1;
        }

        const versionData = JSON.parse(fs.readFileSync(versionPath).toString());

        if (!('format_version' in versionData)) {
            versionData['format_version'] = 1;
        }

        if ('id' in versionData) {
            versionData['version'] = versionData.id;
            delete versionData.id;
        }

        if ('uid' in versionData) {
            versionData['version'] = versionData.uid;
            delete versionData.uid;
        }

        if ('downloads' in versionData && 'client' in versionData.downloads && 'sha1' in versionData.downloads.client) {
            versionData.downloads.client['checksum'] = { type: 'sha1', hash: versionData.downloads.client.sha1 };
            delete versionData.downloads.client.sha1;
        }

        if ('libraries' in versionData && versionData.libraries.length === 0) {
            delete versionData.libraries;
        }

        orderKeys(versionData, [
            "format_version",
            "type",
            "version",
            "release_time",
            "java",
            "main_class",
            "libraries",
            "downloads"
        ]);
        
        fs.writeFileSync(versionPath, JSON.stringify(versionData, undefined, args.values.pretty ? 2 : undefined));

        if ('sha256' in version) {
            delete version.sha256;
        }

        version['checksum'] = { type: 'sha256', hash: await digest('SHA-256', fs.readFileSync(versionPath)) };

        orderKeys(version, [
            "type",
            "version",
            "release_time",
            "checksum"
        ]);
    }

    fs.writeFileSync(versionManifestPath, JSON.stringify(manifest, undefined, args.values.pretty ? 2 : undefined));
}

!import.meta.main || await main();