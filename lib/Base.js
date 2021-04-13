/**
 * mergeArrayBuffer
 * @param  {ArrayBuffer[]} arrays
 * @returns {ArrayBuffer}
 */
function mergeArrayBuffer(...arrays) {
    let totalLen = 0
    for (let i = 0; i < arrays.length; i++) {
        arrays[i] = new Uint8Array(arrays[i])
        totalLen += arrays[i].length
    }

    let res = new Uint8Array(totalLen)

    let offset = 0
    for(let arr of arrays) {
        res.set(arr, offset)
        offset += arr.length
    }

    return res.buffer
}

module.exports = {
    mergeArrayBuffer
}