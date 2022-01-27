const { request } = require("https");

const LiveAPI = {
    /**
     * DanmuServer
     * @typedef ServerHost
     * @property {string} token
     * @property {Array<{host: string, wss_port:number}>} host_list
     * @param {number} roomid
     * @param {string} [cookie]
     * @returns {Promise<ServerHost>}
     */
    DanmuServer(roomid, cookie) {
        return new Promise((resolve, reject) => {
            request(
                `https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomid}&type=0`,
                {
                    method: 'GET',
                    headers: {
                        accept: 'application/json, text/plain, */*',
                        cookie
                    }
                },
                response => {
                    let text = '';
                    response.setEncoding('utf8')
                    response.on('data', data => text += data)
                    response.on('error', error => reject(error.message))
                    response.on('end', () => {
                        try {
                            const res_jsonify = JSON.parse(text);
                            if (res_jsonify.code !== 0) throw Error(text);
                            resolve(res_jsonify.data)
                        } catch (error) {
                            reject(error)
                        }
                    })
                }
            ).on('error', error => reject(error.message)).end()
        });
    }
}


module.exports = LiveAPI;