const LiveChat = require("./lib/live_chat");

(function () {
    const chat_client = new LiveChat();
    chat_client
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
                chat_client.close();
                break;
            case 'r':
                chat_client.run();
                break;
            case 'q':
                process.exit(0);
        }
    })
})()
