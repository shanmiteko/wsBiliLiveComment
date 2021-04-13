const WebSocket = require("ws");
const convert = require("./Convert");
const LiveAPI = require("./LiveAPI");

class ServerInfo {
    constructor() {
        this.roomid = 0;
        this.uid = 0;
        this.wss_url = '';
        this._hostList = [];
        this.userAuthentication = {
            uid: 0,
            roomid: 0,
            protover: convert.WS.BODY_PROTOCOL_VERSION_DEFLATE,
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
            const DanmuInfo = await LiveAPI.DanmuServer(this.roomid);
            this.userAuthentication.key = DanmuInfo.token;
            this.userAuthentication.roomid = this.roomid;
            this.userAuthentication.uid = this.uid;
            this._hostList = DanmuInfo.host_list.map(it => {
                return 'wss://' + it.host + ':' + it.wss_port + '/sub'
            })
        } catch (error) {
            console.error(error);
            result = false;
        }
        return result
    }
}

class LiveChat extends ServerInfo {
    constructor() {
        super();
        this.heartBeat = 0;
        this.HostList = null;
        this.option = {
            retryTimeOut: 1 * 1000,
            heartBeatInterval: 30 * 1000,
        }
        this.connectState = false;
        this._messageHandle = (msg) => { console.log(msg) };
    }

    /**
     * @typedef MSG
     * @property {"MESSAGE"|"POPULAR_COUNT"|"CONNECT_SUCCESS"} type
     * @property {Array|number} inner
     * @param {MessageHandle} cb
     * @returns {this}
     * @callback MessageHandle
     * @param {MSG} msg
     */
    setMessageHandle(cb) {
        this._messageHandle = cb;
        return this;
    }

    async run() {
        if (this.connectState) {
            this._wsConnect()
        } else {
            if (this.roomid && this.uid && await this.initInfo()) {
                console.log('chat_client -> initialize success');
                this.HostList = this.hostListIter();
                this._wsConnect()
            } else {
                console.log('chat_client -> initialize failed');
            }
        }
    }

    close() {
        this.ws.close()
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
            console.log('chat_client -> heartBeat');
            this.ws.send(
                convert.toArrayBuffer(
                    {}.toString(),
                    convert.WS.OP_HEARTBEAT
                )
            )
        }, this.option.heartBeatInterval);
    }

    onOpen() {
        console.log('chat_client -> connent to ' + this.wss_url);
        this.ws.send(
            convert.toArrayBuffer(
                JSON.stringify(this.userAuthentication),
                convert.WS.OP_USER_AUTHENTICATION
            )
        );
    }

    onMessage(raw_msg) {
        let raw_data_toArrayBuffer = null;
        let msg = { type: '' };
        const raw_data = raw_msg.data;
        if (raw_data instanceof Buffer) {
            raw_data_toArrayBuffer = raw_data.buffer.slice(raw_data.byteOffset, raw_data.byteOffset + raw_data.byteLength)
        } else if (raw_data instanceof ArrayBuffer) {
            raw_data_toArrayBuffer = raw_data
        }
        const { totalLen, body, op, popular_count } = convert.toObject(raw_data_toArrayBuffer);
        if (totalLen > 0) {
            const { WS } = convert;
            switch (op) {
                case WS.OP_MESSAGE:
                    msg.type = 'MESSAGE';
                    msg.inner = body;
                    break;
                case WS.OP_HEARTBEAT_REPLY:
                    msg.type = 'POPULAR_COUNT';
                    msg.inner = popular_count;
                    break;
                case WS.OP_CONNECT_SUCCESS:
                    if (body[0].code === WS.AUTH_OK) {
                        msg.type = 'CONNECT_SUCCESS';
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
            this._messageHandle(msg);
        }
    }

    onError(err) {
        console.log(err.message);
    }

    onClose() {
        clearInterval(this.heartBeat);
        if (this.connectState) {
            console.log('chat_client -> close');
        } else {
            console.log('chat_client -> change host');
            setTimeout(this._wsConnect.bind(this), this.option.retryTimeOut)
        }
    }
}


module.exports = LiveChat;