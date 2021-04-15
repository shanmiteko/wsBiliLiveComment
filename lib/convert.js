const { mergeArrayBuffer, log } = require("./base");
const { inflateSync } = require('zlib');
const WS = {
    OP_HEARTBEAT: 2,
    OP_USER_AUTHENTICATION: 7,
    OP_HEARTBEAT_REPLY: 3,
    OP_MESSAGE: 5,
    OP_CONNECT_SUCCESS: 8,

    PACKAGE_HEADER_TOTAL_LENGTH: 16,

    PACKAGE_OFFSET: 0,
    HEADER_OFFSET: 4,
    VERSION_OFFSET: 6,
    OPERATION_OFFSET: 8,
    SEQUENCE_OFFSET: 12,

    BODY_PROTOCOL_VERSION_NORMAL: 0,
    BODY_PROTOCOL_VERSION_DEFLATE: 2,

    HEADER_DEFAULT_VERSION: 1,
    HEADER_DEFAULT_OPERATION: 1,
    HEADER_DEFAULT_SEQUENCE: 1,

    AUTH_OK: 0,
    AUTH_TOKEN_ERROR: -101,

    BinaryHeaderList: [
        {
            "name": "Header Length",
            "key": "headerLen",
            "bytes": 2,
            "offset": 4,
            "value": 16
        },
        {
            "name": "Protocol Version",
            "key": "ver",
            "bytes": 2,
            "offset": 6,
            "value": 1
        },
        {
            "name": "Operation",
            "key": "op",
            "bytes": 4,
            "offset": 8,
            "value": 2
        },
        {
            "name": "Sequence Id",
            "key": "seq",
            "bytes": 4,
            "offset": 12,
            "value": 1
        }
    ]
}

/**
 * 去掉头部信息  
 * 原始数据转为object
 * @param {ArrayBuffer} raw_data
 * @returns
 */
function toObject(raw_data) {
    if (!raw_data) return {}

    const decoder = new TextDecoder();

    let raw_data_view = new DataView(raw_data),
        ret = {
            body: [],
            totalLen: raw_data.byteLength
        };

    WS.BinaryHeaderList.forEach((header) => {
        const { bytes, offset, key } = header;
        if (bytes === 4) {
            ret[key] = raw_data_view.getInt32(offset)
        } else if (bytes === 2) {
            ret[key] = raw_data_view.getInt16(offset)
        }
    })

    if (ret.op !== WS.OP_HEARTBEAT_REPLY) {

        for (let wpo = WS.PACKAGE_OFFSET, pl = 0, hl = 0, body = null; wpo < ret.totalLen; wpo += pl) {

            pl = raw_data_view.getInt32(wpo);
            hl = raw_data_view.getInt16(wpo + WS.HEADER_OFFSET);

            try {

                if (ret.ver === WS.BODY_PROTOCOL_VERSION_DEFLATE) {
                    const _raw_data = raw_data.slice(wpo + hl, wpo + pl);
                    const unzip_data = inflateSync(_raw_data);
                    ({ body } = toObject(unzip_data.buffer.slice(unzip_data.byteOffset, unzip_data.byteOffset + unzip_data.byteLength)));
                } else {
                    const msg_str = decoder.decode(
                        raw_data.slice(wpo + hl, wpo + pl)
                    );
                    if (msg_str) body = JSON.parse(msg_str);
                }

                if (body instanceof Array) {
                    ret.body.push(...body)
                } else {
                    body && ret.body.push(body);
                }

            } catch (error) { log.err('decode body error:', error) }
        }

    } else {

        ret.popular_count = raw_data_view.getInt32(WS.PACKAGE_HEADER_TOTAL_LENGTH);

    }

    return ret
}

/**
 * 加上头部信息  
 * 字符串转为ArrayBuffer
 * @param {string} raw_str
 * @param {number} op
 * @returns {ArrayBuffer}
 */
function toArrayBuffer(raw_str, op) {
    const encoder = new TextEncoder()
        , body = encoder.encode(raw_str);

    let header = new ArrayBuffer(WS.PACKAGE_HEADER_TOTAL_LENGTH),
        header_view = new DataView(header, WS.PACKAGE_OFFSET);

    header_view.setInt32(WS.PACKAGE_OFFSET, WS.PACKAGE_HEADER_TOTAL_LENGTH + body.byteLength);
    WS.BinaryHeaderList[2].value = op;
    WS.BinaryHeaderList.forEach(((header) => {
        const { bytes, offset, value } = header;
        if (bytes === 4) {
            header_view.setInt32(offset, value)
        } else if (bytes === 2) {
            header_view.setInt16(offset, value)
        }
    }))

    return mergeArrayBuffer(header, body.buffer);
}


module.exports = { WS, toObject, toArrayBuffer };