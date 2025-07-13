export async function digest(algorithm: string, data: BufferSource) {
    const hash = new Uint8Array(await crypto.subtle.digest(algorithm, data));
    const hexHash = Array.from(hash).map(it => it.toString(16).padStart(2, '0')).join('');
    return hexHash;
}