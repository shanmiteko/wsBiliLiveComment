const chalk = require("chalk")

const Base = {
    log: {
        ok(msg) {
            console.log(chalk.gray(msg));
        },
        err(msg) {
            console.log(chalk.bgRed.bold(msg));
        }
    },
    /**
     * mergeArrayBuffer
     * @param  {ArrayBuffer[]} arrays
     * @returns {ArrayBuffer}
     */
    mergeArrayBuffer(...arrays) {
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

}


module.exports = Base;