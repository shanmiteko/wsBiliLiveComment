const WebSocket = require("ws");
const { log } = require("./base");
const Convert = require("./convert");
const LiveAPI = require("./live_api");

class ServerInfo {
    constructor() {
        this.roomid = 0;
        this.uid = 1;
        this.cookie = '';
        this.wss_url = '';
        this._hostList = [];
        this.userAuthentication = {
            uid: 1,
            roomid: 0,
            protover: Convert.WS.BODY_PROTOCOL_VERSION_DEFLATE,
            platform: "web",
            clientver: "2.6.42",
            type: 2,
            key: ''
        };
    }

    /**
     * 设置直播房间号
     * @param {number} rid
     * @returns 
     */
    setRoomId(rid) {
        this.roomid = rid;
        return this
    }

    /**
     * 设置自己的uid(可随意设置)
     * @param {number} uid
     * @returns 
     */
    setUid(uid) {
        this.uid = uid;
        return this
    }

    /**
     * 设置Cookie(不必要)
     * @param {string} cookie
     */
    setCookie(cookie) {
        this.cookie = cookie;
        return this
    }

    _setWssURL(wss_url) {
        this.wss_url = wss_url;
    }

    *hostListIter() {
        for (const host of this._hostList) {
            yield host
        }
    }

    async initInfo() {
        let result = true;
        try {
            const DanmuInfo = await LiveAPI.DanmuServer(this.roomid, this.cookie);
            this.userAuthentication.key = DanmuInfo.token;
            this.userAuthentication.roomid = this.roomid;
            this.userAuthentication.uid = this.uid;
            this._hostList = DanmuInfo.host_list.map(it => {
                return 'wss://' + it.host + ':' + it.wss_port + '/sub'
            })
        } catch (error) {
            log.err(`live_flow(${this.roomid}) -> ${error}`);
            result = false;
        }
        return result
    }
}

class LiveFlow extends ServerInfo {
    constructor() {
        super();
        this.heartBeat = 0;
        this.HostList = null;
        this.option = {
            retryTimeOut: 500,
            heartBeatInterval: 30 * 1000,
        }
        this.connectState = false;
        /**
         * @type {Map<string, (msg: object) => undefined>}
         */
        this._commandHandles = new Map();
        this.resolve = () => { }
    }

    /**
     * @param {string} msg_name
     * @param {(msg: object) => undefined} cb
     * @returns 
     */
    addCommandHandle(msg_name, cb) {
        this._commandHandles.set(msg_name, cb);
        return this;
    }

    run() {
        return new Promise((resolve) => {
            this.resolve = resolve
            if (this.connectState) {
                this._wsConnect()
            } else if (this.roomid) {
                this.initInfo().then(status => {
                    if (status) {
                        log.ok(`live_flow(${this.roomid}) -> initialize success`);
                        this.HostList = this.hostListIter();
                        this._wsConnect()
                    } else {
                        log.ok(`live_flow(${this.roomid}) -> initialize failed`);
                        this.close()
                    }
                })
            }
        });
    }

    close() {
        if (this.ws) {
            this.ws.close()
        } else {
            log.ok(`live_flow(${this.roomid}) -> close`);
            this.resolve()
        }
    }

    _wsConnect() {
        if (!this.connectState) {
            const { value, done } = this.HostList.next();
            if (!done) this._setWssURL(value);
        }
        this.ws = new WebSocket(this.wss_url);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    _heartBeat() {
        return setInterval(() => {
            log.ok(`live_flow(${this.roomid}) -> heartBeat`);
            this.ws.send(
                Convert.toArrayBuffer(
                    {}.toString(),
                    Convert.WS.OP_HEARTBEAT
                )
            )
        }, this.option.heartBeatInterval);
    }

    onOpen() {
        log.ok(`live_flow(${this.roomid}) -> connent to ${this.wss_url}`);
        this.ws.send(
            Convert.toArrayBuffer(
                JSON.stringify(this.userAuthentication),
                Convert.WS.OP_USER_AUTHENTICATION
            )
        );
    }

    onMessage(raw_msg) {
        let raw_data_toArrayBuffer = null;
        const raw_data = raw_msg.data;
        if (raw_data instanceof Buffer) {
            raw_data_toArrayBuffer = raw_data.buffer.slice(raw_data.byteOffset, raw_data.byteOffset + raw_data.byteLength)
        } else if (raw_data instanceof ArrayBuffer) {
            raw_data_toArrayBuffer = raw_data
        }
        const { totalLen, body, op, popular_count } = Convert.toObject(raw_data_toArrayBuffer);
        if (totalLen > 0) {
            const { WS } = Convert;
            switch (op) {
                case WS.OP_MESSAGE:
                    body.forEach(
                        (msg) => (this._commandHandles.get(msg.cmd) || (() => undefined))(msg)
                    )
                    break;
                case WS.OP_HEARTBEAT_REPLY:
                    log.ok(`live_flow(${this.roomid}) -> popular: ${popular_count}`);
                    break;
                case WS.OP_CONNECT_SUCCESS:
                    if (body[0].code === WS.AUTH_OK) {
                        log.ok(`live_flow(${this.roomid}) -> connect success (roomid: ${this.roomid})`);
                        this.connectState = true;
                        this.heartBeat = this._heartBeat();
                    }
                    else if (body[0].code === WS.AUTH_TOKEN_ERROR) {
                        this.close();
                    }
                    break;
                default:
                    this.close();
                    return;
            }
        }
    }

    onError(err) {
        log.err(`live_flow(${this.roomid}) -> ${err.message}`);
        this.close()
    }

    onClose() {
        if (this.connectState) {
            clearInterval(this.heartBeat);
            log.ok(`live_flow(${this.roomid}) -> close`);
            this.resolve()
        } else {
            log.ok(`live_flow(${this.roomid}) -> change host`);
            setTimeout(this._wsConnect.bind(this), this.option.retryTimeOut)
        }
    }
}


module.exports = LiveFlow;