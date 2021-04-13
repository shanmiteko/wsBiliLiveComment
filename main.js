const LiveChat = require("./lib/LiveChat");

(function () {
    const LiveChatCLient = new LiveChat();
    LiveChatCLient
        .setRoomId(1)
        .setUid(1)
        .setMessageHandle((msg) => {
            console.log(JSON.stringify(msg))
        })
        .run();
    process.stdin.on('data', (data) => {
        const stdin = data.toString().trim();
        switch (stdin) {
            case 'c':
                LiveChatCLient.close();
                break;
            case 'r':
                LiveChatCLient.run();
                break;
            case 'q':
                process.exit(0);
        }
    })
})()
