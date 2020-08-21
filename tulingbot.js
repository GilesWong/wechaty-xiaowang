const Tuling123 = require('tuling123-client')
const TULING123_API_KEY = 'YOUR_TULING_TOKEN_HERE'
const tuling = new Tuling123(TULING123_API_KEY)
/**
 * 在此处申请你的图灵机器人Token: http://www.tuling123.com/member/robot/index.jhtml
 * */
const {
    Wechaty,
    Message,
} = require('wechaty')
async function onMessage(msg) {
    // Skip message from self, or inside a room
    if (msg.self() || msg.from().name() === '微信运动' || msg.from().name() === '微信团队' || msg.type() !== Message.Type.Text || !(await msg.mentionSelf())) return

    console.log('Bot', 'talk: %s', msg.text())

    try {
        const {
            text: reply
        } = await tuling.ask(msg.text(), {
            userid: msg.from()
        })
        console.log('Tuling123', 'Talker reply:"%s" for "%s" ',
            reply,
            msg.text(),
        )
        await msg.say(reply)
    } catch (e) {
        console.error('Bot', 'on message tuling.ask() exception: %s', e && e.message || e)
    }
}

module.exports = onMessage

/*
Thanks huan for code here: https://github.com/wechaty/wechaty-getting-started/blob/master/examples/professional/tuling123-bot.js
* */