const LiveChat = require("./lib/LiveChat");

(function () {
    const LiveChatCLient = new LiveChat();
    LiveChatCLient
        .setRoomId(1)
        .setUid(1)
        .run();
})()