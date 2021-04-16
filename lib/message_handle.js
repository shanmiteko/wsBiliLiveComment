const chalk = require("chalk");

function messageHandle(t) {
    let e = {};
    let r = {};
    switch (t.cmd) {
        case "MATCH_TEAM_GIFT_RANK":
            break;
        case "ACTIVITY_MATCH_GIFT":
            break;
        case "ANIMATION": break;
        case "CHANGE_ROOM_INFO": break;
        case "COMBO_SEND":
            break;
        case "CUT_OFF":
            switch (t.prev = t.next) {
                case 0:
                case 3:
                    break
                case 7:
                case 11:
                    break;
                case 13:
                case 14:
                case "end":
            }
            break;
        case "DANMU_GIFT_LOTTERY_START":
            break;
        case "DANMU_GIFT_LOTTERY_END":
            break;
        case "DANMU_GIFT_LOTTERY_AWARD":
            break;
        case "WARNING":
            switch (e.prev = e.next) {
                case 0:
                case 2:
                case "end":
            }
            break;
        case "DANMU_MSG":
            console.log(
                (t.info[3].length ? chalk.hex(['#5CC05C', '#5896DE', '#A068F1', '#FF86B2', '#F6BE18', '#AFC1AF', '#B7C9DE', '#D8C9F0', '#FFE5F0', '#F5E8C1'][~~((t.info[3][0] - 1) / 4)])('[' + t.info[3][1] + ']') : '')
                +
                chalk.hex(['#969696', '#61c05a', '#5896de', '#a068f1', '#ff86b2', '#ff9f3d'][~~((t.info[4][0] - 1) / 10)])(t.info[2][1])
                +
                chalk.grey(': ')
                +
                chalk.hex(t.info[2][7] || '#FFFFFF')(t.info[1])
            );
            break;
        case "USER_TOAST_MSG":
            break;
        case "GUARD_ACHIEVEMENT_ROOM":
            break;
        case "LIVE":
            switch (e.prev = e.next) {
                case 0:
                case 3:
                case "end":
            }
            break;
        case "MESSAGEBOX_USER_GAIN_MEDAL":
            break;
        case "MESSAGEBOX_USER_MEDAL_CHANGE":
            switch (r.type) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
            }
            break;
        case "MESSAGEBOX_USER_MEDAL_COMPENSATION":
            break;
        case "LITTLE_TIPS":
            break;
        case "LITTLE_MESSAGE_BOX":
            break;
        case "NOTICE_MSG":
            break;
        case "PK_MATCH":
            break;
        case "PK_PRE":
            break;
        case "PK_START":
            break;
        case "PK_PROCESS":
            break;
        case "PK_END":
            break;
        case "PK_SETTLE":
            break;
        case "PK_AGAIN":
            break;
        case "PK_MIC_END":
            break;
        case "PK_BATTLE_PRE_NEW":
            break;
        case "PK_BATTLE_START_NEW":
            break;
        case "PK_BATTLE_PROCESS_NEW":
            break;
        case "PK_BATTLE_PRO_TYPE":
            break;
        case "PK_BATTLE_GIFT":
        case "PK_BATTLE_SPECIAL_GIFT":
            break;
        case "PK_BATTLE_CRIT":
            break;
        case "PK_BATTLE_VOTES_ADD":
            break;
        case "PK_BATTLE_END":
            break;
        case "PK_BATTLE_SETTLE_V2":
            break;
        case "PK_BATTLE_SETTLE_NEW":
            break;
        case "PK_BATTLE_PUNISH_END":
            break;
        case "PK_BATTLE_RANK_CHANGE":
            break;
        case "PREPARING":
            break;
        case "ROOM_REFRESH":
            break;
        case "ROOM_SKIN_MSG":
            break;
        case "TV_START":
        case "RAFFLE_START":
            break;
        case "TV_END":
        case "RAFFLE_END":
            break;
        case "PK_LOTTERY_START":
            break;
        case "GUARD_LOTTERY_START":
            break;
        case "ROOM_BLOCK_INTO":
            break;
        case "ROOM_BLOCK_MSG":
            break;
        case "ROOM_KICKOUT":
            break;
        case "ROOM_LOCK":
            break;
        case "ROOM_LIMIT":
            break;
        case "ROOM_SILENT_ON":
            switch (e.prev = e.next) {
                case 0:
                    break
                case 4:
                case 7:
                    break;
                case 13:
                case 16:
                case "end":
            }
            break;
        case "ROOM_SILENT_OFF":
            switch (t.prev = t.next) {
                case 0:
                    break
                case 4:
                case 7:
                    break;
                case 12:
                case 15:
                case "end":
            }
            break;
        case "SEND_GIFT":
            break;
        case "SEND_TOP":
            break;
        case "SPECIAL_GIFT":
            break;
        case "INTERACT_WORD":
            break;
        case "ENTRY_EFFECT":
            break;
        case "ENTRY_EFFECT_MUST_RECEIVE":
            break;
        case "BOX_ACTIVITY_START":
            switch (e.prev = e.next) {
                case 0:
                case 3:
                case 4:
                case "end":
            }
            break;
        case "WIN_ACTIVITY":
            break;
        case "WIN_ACTIVITY_USER":
            break;
        case "ROOM_RANK":
            break;
        case "HOUR_RANK_AWARDS":
            switch (e.prev = e.next) {
                case 0:
                case 3:
                case "end":
            }
            break;
        case "LOL_ACTIVITY":
            break;
        case "ROOM_REAL_TIME_MESSAGE_UPDATE":
            switch (e.prev = e.next) {
                case 0:
                    break
                case 3:
                    break
                case 7:
                    break
                case 10:
                case "end":
            }
            break;
        case "VOICE_JOIN_STATUS":
            break;
        case "ROOM_CHANGE":
            switch (e.prev = e.next) {
                case 0:
                case 2:
                case "end":
            }
            break;
        case "SUPER_CHAT_MESSAGE":
            break;
        case "SUPER_CHAT_MESSAGE_DELETE":
            break;
        case "SUPER_CHAT_ENTRANCE":
            break;
        case "SUPER_CHAT_AUDIT":
            break;
        case "ANCHOR_LOT_CHECKSTATUS":
            break;
        case "ANCHOR_LOT_START":
            break;
        case "ANCHOR_LOT_END":
            break;
        case "ANCHOR_LOT_AWARD":
            break;
        case "CHASE_FRAME_SWITCH":
            break;
        case "WATCH_LPL_EXPIRED":
            break;
        case "VIDEO_CONNECTION_JOIN_START":
            break;
        case "VIDEO_CONNECTION_JOIN_END":
            break;
        case "VIDEO_CONNECTION_MSG":
            break;
        case "ROOM_BANNER":
            break;
        case "WIDGET_BANNER":
            break;
        case "ONLINE_RANK_V2":
            break;
        case "ONLINE_RANK_TOP3":
            break;
        case "HOT_RANK_CHANGED":
            break;
        case "HOT_RANK_SETTLEMENT":
        case "VTR_GIFT_LOTTERY":
            break;
        case "RED_POCKET_START":
            switch (e.prev = e.next) {
                case 0:
                    break
                case 5:
                case 6:
                case 8:
                    break
                case 11:
                case 14:
                case "end":
            }
    }
}


module.exports = { messageHandle };