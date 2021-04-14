const { HttpRequest } = require("smt-request");

const LiveAPI = {
    HOST: 'https://api.live.bilibili.com',
    /**
     * DanmuServer
     * @typedef ServerHost
     * @property {string} token
     * @property {Array<{host: string, wss_port:number}>} host_list
     * @param {number} roomid
     * @returns {Promise<ServerHost>}
     */
    DanmuServer(roomid) {
        return new Promise((resolve, reject) => {
            HttpRequest({
                method: 'GET',
                url: this.HOST + '/xlive/web-room/v1/index/getDanmuInfo',
                query: {
                    id: roomid,
                    type: 0
                },
                headers: {
                    accept: 'application/json, text/plain, */*',
                },
                success: res => {
                    try {
                        const res_jsonify = JSON.parse(res.body);
                        if (res_jsonify.code !== 0) throw Error(res.body);
                        resolve(res_jsonify.data)
                    } catch (error) {
                        reject(error)
                    }
                },
                failure: reject
            })
        });
    }
}


module.exports = LiveAPI;