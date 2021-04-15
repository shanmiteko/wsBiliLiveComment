const LiveFlow = require("./lib/live_flow");
const { messageHandle } = require("./lib/message_handle");

(function () {
    const live_flow = new LiveFlow();
    live_flow
        .setRoomId(80397)
        .setMessageHandle((msg) => msg.type === 'MESSAGE' && msg.inner.forEach(messageHandle))
        .run();

    process.stdin.on('data', (data) => {
        const stdin = data.toString().trim();
        switch (stdin) {
            case 'c':
                live_flow.close();
                break;
            case 'r':
                live_flow.run();
                break;
            case 'q':
                process.exit(0);
        }
    })
})()
