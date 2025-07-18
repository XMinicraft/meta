export async function digest(algorithm: string, data: BufferSource) {
    const hash = new Uint8Array(await crypto.subtle.digest(algorithm, data));
    const hexHash = Array.from(hash).map(it => it.toString(16).padStart(2, '0')).join('');
    return hexHash;
}

export function orderKeys(obj: Record<string, unknown>, orders: string[]) {
    const entries = Object.entries(obj);
    for (const [key] of entries) {
        delete obj[key];
    }

    for (const [key, value] of entries.sort(([kA], [kB]) => {
        const idxA = orders.indexOf(kA);
        const idxB = orders.indexOf(kB);

        return (idxA === -1 ? 998 : idxA) - (idxB === -1 ? 999 : idxB);
    })) { 
        obj[key] = value;
    }
}